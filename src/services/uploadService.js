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