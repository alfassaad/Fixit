// ============================================================
// src/services/issueService.js
// ============================================================
 
import { supabase } from '../lib/supabase.js'
 
// Fetch all issues (with filters)
export const getIssues = async ({ status, category, sortBy = 'created_at', limit = 20, offset = 0 } = {}) => {
  let query = supabase
    .from('issues')
    .select(`
      issue_id,
      title,
      description,
      category,
      status,
      priority,
      upvote_count,
      created_at,
      address,
      location,
      reporter:profiles!reporter_id(user_id, full_name, avatar_url),
      assignee:profiles!assigned_to(user_id, full_name, avatar_url),
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
export const getIssueById = async (issue_id) => {
  const { data, error } = await supabase
    .from('issues')
    .select(`
      *,
      reporter:profiles!reporter_id(user_id, full_name, avatar_url),
      assignee:profiles!assigned_to(user_id, full_name, avatar_url),
      photos:issue_photos(photo_id, photo_url, photo_type, uploaded_at),
      comments(comment_id, comment_text, created_at, user:profiles(user_id, full_name, avatar_url)),
      ratings(score, comment)
    `)
    .eq('issue_id', issue_id)
    .single()
 
  if (error) throw error
  return data
}
 
// Fetch issues for map (within bounding box)
export const getIssuesForMap = async ({ minLat, maxLat, minLng, maxLng }) => {
  const { data, error } = await supabase
    .from('issues')
    .select('issue_id, title, description, category, status, priority, latitude, longitude, upvote_count')
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
  
  // Convert latitude and longitude into the format PostGIS expects: 'POINT(longitude latitude)'
  const location = `POINT(${longitude} ${latitude})`

  const { data, error } = await supabase
    .from('issues')
    .insert([{
      title,
      description,
      category,
      address,
      location, // Use the correctly formatted location string
      priority,
      reporter_id: user?.id ?? null,
    }])
    .select()
    .single()
 
  if (error) {
    console.error("Error creating issue:", error);
    throw error;
  }
  return data;
}
 
// Update issue status (admin/technician)
export const updateIssueStatus = async (issue_id, status) => {
  const updates = { status }
  if (status === 'resolved') updates.resolved_at = new Date().toISOString()
 
  const { data, error } = await supabase
    .from('issues')
    .update(updates)
    .eq('issue_id', issue_id)
    .select()
    .single()
 
  if (error) throw error
  return data
}
 
// Assign issue to technician
export const assignIssue = async (issue_id, technicianId, dueDate, notes) => {
  // Update issue
  const { data: issue, error: issueError } = await supabase
    .from('issues')
    .update({ assigned_to: technicianId, status: 'assigned' })
    .eq('issue_id', issue_id)
    .select()
    .single()
 
  if (issueError) throw issueError
 
  // Create task record
  const { data: { user } } = await supabase.auth.getUser()
  const { data: task, error: taskError } = await supabase
    .from('tasks')
    .insert([{
      issue_id: issue_id,
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
export const toggleUpvote = async (issue_id) => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Must be logged in to upvote')
 
  // Check if already upvoted
  const { data: existing } = await supabase
    .from('issue_upvotes')
    .select('*')
    .eq('user_id', user.id)
    .eq('issue_id', issue_id)
    .single()
 
  if (existing) {
    // Remove upvote
    const { error } = await supabase
      .from('issue_upvotes')
      .delete()
      .eq('user_id', user.id)
      .eq('issue_id', issue_id)
    if (error) throw error
    return { upvoted: false }
  } else {
    // Add upvote
    const { error } = await supabase
      .from('issue_upvotes')
      .insert([{ user_id: user.id, issue_id: issue_id }])
    if (error) throw error
    return { upvoted: true }
  }
}
 
// Check if user has upvoted an issue
export const hasUpvoted = async (issue_id) => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false
 
  const { data } = await supabase
    .from('issue_upvotes')
    .select('*')
    .eq('user_id', user.id)
    .eq('issue_id', issue_id)
    .single()
 
  return !!data
}
 
// Add a comment
export const addComment = async (issue_id, content) => {
  const { data: { user } } = await supabase.auth.getUser()
  const { data, error } = await supabase
    .from('comments')
    .insert([{ issue_id: issue_id, user_id: user.id, content }])
    .select(`*, user:profiles(user_id, full_name, avatar_url)`)
    .single()
 
  if (error) throw error
  return data
}
 
// Submit rating
export const submitRating = async (issue_id, score, comment) => {
  const { data: { user } } = await supabase.auth.getUser()
  const { data, error } = await supabase
    .from('ratings')
    .insert([{ issue_id: issue_id, user_id: user.id, score, comment }])
    .select()
    .single()
 
  if (error) throw error
  return data
}

// Update an issue (generic, for admins)
export const updateIssue = async (issue_id, updates) => {
  const { data, error } = await supabase
    .from('issues')
    .update(updates)
    .eq('issue_id', issue_id)
    .select()
    .single()

  if (error) {
    console.error('Error updating issue:', error)
    throw error
  }
  return data
}

// Delete an issue (for admins)
export const deleteIssue = async (issue_id) => {
  const { error } = await supabase
    .from('issues')
    .delete()
    .eq('issue_id', issue_id)

  if (error) {
    console.error('Error deleting issue:', error)
    throw error
  }
  return
}

// Listen for changes to the issues table
export const onIssuesChange = (callback) => {
  const subscription = supabase
    .channel('public:issues')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'issues' }, (payload) => {
      callback(payload);
    })
    .subscribe();

  return subscription;
};
