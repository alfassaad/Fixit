import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://fvadpeqpovftqqjpfmli.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2YWRwZXFwb3ZmdHFxanBmbWxpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5NTUxODIsImV4cCI6MjA5MDUzMTE4Mn0.JaE4WxhzQL8doQA6vuSX9cSSJbi41KG7b5RhZj3aeKA"

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function testInsert() {
  console.log('Testing insert to Supabase...')
  const { data, error } = await supabase.from('issues').insert([{
    title: 'Test Issue',
    description: 'This is a test issue created to see if insert works',
    category: 'Other',
    address: 'Test Address',
    latitude: 0,
    longitude: 0,
    priority: 'low'
  }]).select('*')
  
  if (error) {
    console.error('Error inserting data:', error.message, error.details || '', error.hint || '')
  } else {
    console.log('Successfully inserted data:', data)
  }
}

testInsert()
