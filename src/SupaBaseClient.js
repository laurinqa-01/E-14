import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wutjkaonjygrjbanfxzn.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1dGprYW9uanlncmpiYW5meHpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA2MTU0MTcsImV4cCI6MjA5NjE5MTQxN30.dRK5MzAJ51DukC0E2lMMVkH9NNkNKffrWx4Mie5-C18'

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
)