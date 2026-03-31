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