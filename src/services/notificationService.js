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