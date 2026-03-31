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