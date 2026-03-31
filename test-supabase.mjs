import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://fvadpeqpovftqqjpfmli.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2YWRwZXFwb3ZmdHFxanBmbWxpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5NTUxODIsImV4cCI6MjA5MDUzMTE4Mn0.JaE4WxhzQL8doQA6vuSX9cSSJbi41KG7b5RhZj3aeKA"

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function testConnection() {
  console.log('Testing connection to Supabase...')
  const { data, error } = await supabase.from('issues').select('*').limit(5)
  if (error) {
    console.error('Error fetching data:', error.message, error.details, error.hint)
  } else {
    console.log('Successfully fetched data. Row count:', data.length)
    console.log(data)
  }
}

testConnection()
