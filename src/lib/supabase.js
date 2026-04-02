
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://fvadpeqpovftqqjpfmli.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2YWRwZXFwb3ZmdHFxanBmbWxpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5NTUxODIsImV4cCI6MjA5MDUzMTE4Mn0.JaE4WxhzQL8doQA6vuSX9cSSJbi41KG7b5RhZj3aeKA"

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
