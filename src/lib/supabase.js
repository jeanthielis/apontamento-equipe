// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gqbdpmkkkveydjgbpldc.supabase.co'
const supabaseAnonKey = 'sb_publishable_-Wpksode4NZwQzyZBVN0XQ_I0BSTI2f'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)