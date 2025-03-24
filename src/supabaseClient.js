import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vikrrywgleamuvsjyruc.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpa3JyeXdnbGVhbXV2c2p5cnVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4MzY3MDQsImV4cCI6MjA1ODQxMjcwNH0.Xquz72mKLcnU8xxA-ufGePbjmBY3V6SUmcGlLbpeVVo'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)