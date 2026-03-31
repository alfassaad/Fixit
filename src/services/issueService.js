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