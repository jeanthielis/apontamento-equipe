// src/stores/auth.js
import { defineStore } from 'pinia'
import { supabase } from '../lib/supabase'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,    // Dados do Supabase Auth (email, id)
    profile: null, // Dados da tabela 'usuarios' + Permissoes Dinâmicas
    loading: true  // Para mostrar um "carregando" enquanto verifica a sessão
  }),
  actions: {
    async fetchProfile(sessionUser) {
      this.user = sessionUser
      if (sessionUser) {
        
        // A MÁGICA: Busca relacional! Pega o usuário, entra na tabela de níveis e puxa as permissões.
        const { data, error } = await supabase
          .from('usuarios')
          .select(`
            *,
            niveis_acesso (
              nome,
              permissoes_acesso (
                modulo_slug
              )
            )
          `)
          .eq('id', sessionUser.id)
          .single()
          
        if (!error && data) {
          // Simplificamos a resposta do banco para o Vue ler mais fácil
          // Extraímos os slugs para uma lista simples: ['home', 'dds_aplicar', 'admin']
          const listaPermissoes = data.niveis_acesso?.permissoes_acesso?.map(p => p.modulo_slug) || []
          
          // Guardamos tudo mastigado no state profile
          this.profile = {
            ...data, // Traz id, nome, email, etc.
            cargoNome: data.niveis_acesso?.nome || 'Sem Acesso', // Ex: "Técnico de Segurança"
            permissoes: listaPermissoes // A lista que vai controlar os botões
          }
        } else {
          console.error("Erro ao buscar perfil com permissões:", error)
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