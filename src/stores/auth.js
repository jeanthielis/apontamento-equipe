// src/stores/auth.js
import { defineStore } from 'pinia'
import { supabase } from '../lib/supabase'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,    // Dados do Supabase Auth (email, id)
    profile: null, // Dados da nossa tabela 'usuarios' (nome, role, unidade_id)
    loading: true  // Para mostrar um "carregando" enquanto verifica a sessão
  }),
  actions: {
    async fetchProfile(sessionUser) {
      this.user = sessionUser
      if (sessionUser) {
        // Busca os dados complementares da tabela pública
        const { data, error } = await supabase
          .from('usuarios')
          .select('*')
          .eq('id', sessionUser.id)
          .single()
          
        if (!error && data) {
          this.profile = data
        }
      } else {
        this.profile = null
      }
      this.loading = false
    },
    async logout() {
      await supabase.auth.signOut()
      this.user = null
      this.profile = null
    }
  }
})