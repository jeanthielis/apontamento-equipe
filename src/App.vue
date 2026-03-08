<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from './lib/supabase'
import { useAuthStore } from './stores/auth'

const authStore = useAuthStore()
const router = useRouter()

onMounted(() => {
  // Configura o listener do Supabase assim que o app inicia
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
      // Se logou, busca o perfil (cargo/nome) e salva no Pinia
      authStore.fetchProfile(session?.user || null)
    } else if (event === 'SIGNED_OUT') {
      // Se deslogou, limpa o Pinia e manda pro Login
      authStore.fetchProfile(null)
      router.push('/')
    }
  })
})
</script>

<template>
  <div v-if="authStore.loading" class="h-screen w-screen flex items-center justify-center bg-slate-100">
    <i class="fa-solid fa-circle-notch fa-spin text-4xl text-emerald-500"></i>
  </div>
  
  <router-view v-else />
</template>

