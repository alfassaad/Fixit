// ============================================================
// src/services/taskService.js
// ============================================================

import { supabase } from '../lib/supabase'

// Create a new task for an issue
export const createTask = async ({ issue_id, assigned_to, due_date, notes }) => {
  const { data: { user } } = await supabase.auth.getUser()

  const { data, error } = await supabase
    .from('tasks')
    .insert([{
      issue_id,
      assigned_to,
      assigned_by: user.id,
      due_date,
      notes,
    }])
    .select()
    .single()

  if (error) {
    console.error('Error creating task:', error)
    throw error
  }
  return data
}

// Get all tasks for a specific issue
export const getTasksForIssue = async (issueId) => {
  const { data, error } = await supabase
    .from('tasks')
    .select(`
      *,
      assignee:profiles!assigned_to(id, full_name, avatar_url),
      assigner:profiles!assigned_by(id, full_name, avatar_url)
    `)
    .eq('issue_id', issueId)

  if (error) {
    console.error('Error fetching tasks:', error)
    throw error
  }
  return data
}

// Update a task
export const updateTask = async (taskId, updates) => {
  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', taskId)
    .select()
    .single()

  if (error) {
    console.error('Error updating task:', error)
    throw error
  }
  return data
}

// Delete a task
export const deleteTask = async (taskId) => {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId)

  if (error) {
    console.error('Error deleting task:', error)
    throw error
  }
  return
}
