// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gqbdpmkkkveydjgbpldc.supabase.co'
const supabaseAnonKey = 'sb_publishable_-Wpksode4NZwQzyZBVN0XQ_I0BSTI2f'

// 1. Cliente que você usa para navegar
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 2. Cliente para o Super Admin cadastrar novos (agora também manual para não dar erro!)
export const supabaseCadastro = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { 
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
    storageKey: 'fantasma-auth-token'
  }
})