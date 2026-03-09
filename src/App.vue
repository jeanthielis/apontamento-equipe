<template>
  <div id="safetrack-app-root" class="min-h-screen w-full relative bg-slate-100/50">

    <router-view />

    <div
      v-if="renderScreen"
      :class="[
        'fixed inset-0 z-[9999] bg-slate-900 flex flex-col items-center justify-center transition-opacity duration-700 ease-in-out',
        isAppLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'
      ]"
    >
      <div class="w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-emerald-500/40 mb-6 border border-emerald-400/50 animate-pulse">
        <i class="fa-solid fa-industry text-4xl"></i>
      </div>
      
      <div class="w-8 h-8 border-4 border-slate-600 border-t-emerald-400 rounded-full animate-spin mb-4"></div>
      
      <h1 class="font-black text-2xl text-white tracking-tight mb-1">SafeTrack</h1>
      <p class="text-emerald-400 font-bold tracking-widest uppercase text-[10px] animate-pulse">Sincronizando Operação...</p>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Controla a visibilidade (Fade In/Out)
const isAppLoading = ref(true)

// Controla a existência do elemento no HTML
const renderScreen = ref(true)

onMounted(() => {
  const removeLoading = () => {
    // 1. O Tailwind faz a tela ficar transparente suavemente (700ms)
    isAppLoading.value = false

    // 2. Depois que a animação acaba, nós arrancamos a tela do HTML para liberar memória
    setTimeout(() => {
      renderScreen.value = false
    }, 700)
  }

  // Verifica se a página já carregou (ótimo para mobile)
  if (document.readyState === 'complete') {
    setTimeout(removeLoading, 500)
  } else {
    window.addEventListener('load', removeLoading)
  }

  // Trava de segurança de 3 segundos
  setTimeout(() => {
    if (isAppLoading.value) removeLoading()
  }, 3000)
})
</script>