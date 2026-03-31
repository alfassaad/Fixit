// ============================================================
// src/services/authService.js
// ============================================================

import { supabase } from '../lib/supabase'

// Sign up a new citizen
export const signUp = async ({ email, password, fullName, phone }) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, role: 'citizen' }
    }
  })
  if (error) throw error

  // Update phone if provided
  if (phone && data.user) {
    await supabase
      .from('profiles')
      .update({ phone })
      .eq('id', data.user.id)
  }
  return data
}

// Log in
export const signIn = async ({ email, password }) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

// Log out
export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

// Get current session
export const getSession = async () => {
  const { data, error } = await supabase.auth.getSession()
  if (error) throw error
  return data.session
}

// Get current user profile
export const getCurrentProfile = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) throw error
  return data
}

// Update profile
export const updateProfile = async (updates) => {
  const { data: { user } } = await supabase.auth.getUser()
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id)
    .select()
    .single()
  if (error) throw error
  return data
}

// Listen to auth state changes
export const onAuthStateChange = (callback) => {
  return supabase.auth.onAuthStateChange(callback)
}


// ============================================================
// src/services/issueService.js
// ============================================================

import { supabase } from '../lib/supabase'

// Fetch all issues (with filters)
export const getIssues = async ({ status, category, sortBy = 'created_at', limit = 20, offset = 0 } = {}) => {
  let query = supabase
    .from('issues')
    .select(`
      *,
      reporter:profiles!reporter_id(id, full_name, avatar_url),
      assignee:profiles!assigned_to(id, full_name, avatar_url),
      photos:issue_photos(photo_url, photo_type)
    `)
    .order(sortBy, { ascending: false })
    .range(offset, offset + limit - 1)

  if (status) query = query.eq('status', status)
  if (category) query = query.eq('category', category)

  const { data, error } = await query
  if (error) throw error
  return data
}

// Fetch single issue by ID
export const getIssueById = async (id) => {
  const { data, error } = await supabase
    .from('issues')
    .select(`
      *,
      reporter:profiles!reporter_id(id, full_name, avatar_url),
      assignee:profiles!assigned_to(id, full_name, avatar_url),
      photos:issue_photos(id, photo_url, photo_type, uploaded_at),
      comments(id, content, created_at, user:profiles(id, full_name, avatar_url)),
      ratings(score, comment)
    `)
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

// Fetch issues for map (within bounding box)
export const getIssuesForMap = async ({ minLat, maxLat, minLng, maxLng }) => {
  const { data, error } = await supabase
    .from('issues')
    .select('id, title, category, status, priority, latitude, longitude, upvote_count')
    .gte('latitude', minLat)
    .lte('latitude', maxLat)
    .gte('longitude', minLng)
    .lte('longitude', maxLng)
    .neq('status', 'closed')

  if (error) throw error
  return data
}

// Fetch issues by current user
export const getMyIssues = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  const { data, error } = await supabase
    .from('issues')
    .select(`
      *,
      photos:issue_photos(photo_url, photo_type)
    `)
    .eq('reporter_id', user.id)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

// Submit a new issue
export const createIssue = async ({ title, description, category, address, latitude, longitude, priority = 'medium' }) => {
  const { data: { user } } = await supabase.auth.getUser()

  const { data, error } = await supabase
    .from('issues')
    .insert([{
      title,
      description,
      category,
      address,
      latitude,
      longitude,
      priority,
      reporter_id: user?.id ?? null,
    }])
    .select()
    .single()

  if (error) throw error
  return data
}

// Update issue status (admin/technician)
export const updateIssueStatus = async (id, status) => {
  const updates = { status }
  if (status === 'resolved') updates.resolved_at = new Date().toISOString()

  const { data, error } = await supabase
    .from('issues')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

// Assign issue to technician
export const assignIssue = async (issueId, technicianId, dueDate, notes) => {
  // Update issue
  const { data: issue, error: issueError } = await supabase
    .from('issues')
    .update({ assigned_to: technicianId, status: 'assigned' })
    .eq('id', issueId)
    .select()
    .single()

  if (issueError) throw issueError

  // Create task record
  const { data: { user } } = await supabase.auth.getUser()
  const { data: task, error: taskError } = await supabase
    .from('tasks')
    .insert([{
      issue_id: issueId,
      assigned_to: technicianId,
      assigned_by: user.id,
      due_date: dueDate,
      notes,
    }])
    .select()
    .single()

  if (taskError) throw taskError
  return { issue, task }
}

// Toggle upvote
export const toggleUpvote = async (issueId) => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Must be logged in to upvote')

  // Check if already upvoted
  const { data: existing } = await supabase
    .from('issue_upvotes')
    .select('*')
    .eq('user_id', user.id)
    .eq('issue_id', issueId)
    .single()

  if (existing) {
    // Remove upvote
    const { error } = await supabase
      .from('issue_upvotes')
      .delete()
      .eq('user_id', user.id)
      .eq('issue_id', issueId)
    if (error) throw error
    return { upvoted: false }
  } else {
    // Add upvote
    const { error } = await supabase
      .from('issue_upvotes')
      .insert([{ user_id: user.id, issue_id: issueId }])
    if (error) throw error
    return { upvoted: true }
  }
}

// Check if user has upvoted an issue
export const hasUpvoted = async (issueId) => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const { data } = await supabase
    .from('issue_upvotes')
    .select('*')
    .eq('user_id', user.id)
    .eq('issue_id', issueId)
    .single()

  return !!data
}

// Add a comment
export const addComment = async (issueId, content) => {
  const { data: { user } } = await supabase.auth.getUser()
  const { data, error } = await supabase
    .from('comments')
    .insert([{ issue_id: issueId, user_id: user.id, content }])
    .select(`*, user:profiles(id, full_name, avatar_url)`)
    .single()

  if (error) throw error
  return data
}

// Submit rating
export const submitRating = async (issueId, score, comment) => {
  const { data: { user } } = await supabase.auth.getUser()
  const { data, error } = await supabase
    .from('ratings')
    .insert([{ issue_id: issueId, user_id: user.id, score, comment }])
    .select()
    .single()

  if (error) throw error
  return data
}


// ============================================================
// src/services/uploadService.js
// ============================================================

import { supabase } from '../lib/supabase'

// Upload a photo to Supabase Storage
export const uploadPhoto = async (file, issueId, type = 'evidence') => {
  const fileExt = file.name.split('.').pop()
  const fileName = `${issueId}/${type}-${Date.now()}.${fileExt}`

  const { data, error } = await supabase.storage
    .from('issue-photos')
    .upload(fileName, file, { cacheControl: '3600', upsert: false })

  if (error) throw error

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('issue-photos')
    .getPublicUrl(fileName)

  // Save photo record to DB
  const { data: { user } } = await supabase.auth.getUser()
  const { data: photo, error: dbError } = await supabase
    .from('issue_photos')
    .insert([{
      issue_id: issueId,
      uploader_id: user?.id,
      photo_url: publicUrl,
      photo_type: type,
    }])
    .select()
    .single()

  if (dbError) throw dbError
  return photo
}


// ============================================================
// src/services/notificationService.js
// ============================================================

import { supabase } from '../lib/supabase'

// Get notifications for current user
export const getNotifications = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  const { data, error } = await supabase
    .from('notifications')
    .select('*, issue:issues(id, title, category)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) throw error
  return data
}

// Mark all notifications as read
export const markAllRead = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', user.id)
    .eq('is_read', false)

  if (error) throw error
}

// Mark single notification as read
export const markRead = async (notificationId) => {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId)

  if (error) throw error
}

// Get unread count
export const getUnreadCount = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('is_read', false)

  if (error) throw error
  return count
}

// Subscribe to real-time notifications
export const subscribeToNotifications = (userId, callback) => {
  return supabase
    .channel('notifications')
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'notifications',
      filter: `user_id=eq.${userId}`,
    }, callback)
    .subscribe()
}


// ============================================================
// src/services/adminService.js
// ============================================================

import { supabase } from '../lib/supabase'

// Get dashboard stats
export const getDashboardStats = async () => {
  const [total, open, critical, resolved] = await Promise.all([
    supabase.from('issues').select('*', { count: 'exact', head: true }),
    supabase.from('issues').select('*', { count: 'exact', head: true }).eq('status', 'open'),
    supabase.from('issues').select('*', { count: 'exact', head: true }).eq('priority', 'critical').neq('status', 'resolved'),
    supabase.from('issues').select('*', { count: 'exact', head: true }).eq('status', 'resolved')
      .gte('resolved_at', new Date(new Date().setDate(1)).toISOString()),
  ])

  return {
    totalIssues: total.count ?? 0,
    openIssues: open.count ?? 0,
    criticalIssues: critical.count ?? 0,
    resolvedThisMonth: resolved.count ?? 0,
  }
}

// Get all issues for admin (paginated)
export const getAllIssues = async ({ page = 1, limit = 10, status, category, priority, search } = {}) => {
  const from = (page - 1) * limit
  const to = from + limit - 1

  let query = supabase
    .from('issues')
    .select(`
      *,
      reporter:profiles!reporter_id(full_name),
      assignee:profiles!assigned_to(full_name)
    `, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (status) query = query.eq('status', status)
  if (category) query = query.eq('category', category)
  if (priority) query = query.eq('priority', priority)
  if (search) query = query.ilike('title', `%${search}%`)

  const { data, error, count } = await query
  if (error) throw error
  return { data, count, totalPages: Math.ceil(count / limit) }
}

// Get all technicians
export const getTechnicians = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, department_id, departments(name)')
    .eq('role', 'technician')

  if (error) throw error
  return data
}

// Get tasks for kanban board
export const getTasksForKanban = async () => {
  const { data, error } = await supabase
    .from('issues')
    .select(`
      id, title, category, status, priority, upvote_count,
      assignee:profiles!assigned_to(id, full_name, avatar_url)
    `)
    .neq('status', 'closed')
    .order('priority_score', { ascending: false })

  if (error) throw error
  return data
}

// Get category breakdown for chart
export const getCategoryBreakdown = async () => {
  const categories = ['Roads & Potholes', 'Street Lighting', 'Water & Drainage', 'Waste Management', 'Parks & Recreation', 'Other']
  const results = await Promise.all(
    categories.map(cat =>
      supabase.from('issues').select('*', { count: 'exact', head: true }).eq('category', cat)
    )
  )
  return categories.map((name, i) => ({ name, value: results[i].count ?? 0 }))
}
