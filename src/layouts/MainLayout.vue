<template>
  <div class="flex h-screen bg-slate-100/50 font-sans text-slate-800 overflow-hidden relative">
    
    <transition name="fade">
      <div 
        v-if="isMobileMenuOpen" 
        @click="isMobileMenuOpen = false" 
        class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden">
      </div>
    </transition>

    <aside :class="[
      'w-[280px] flex flex-col bg-slate-900 rounded-3xl shadow-2xl shadow-slate-900/20 overflow-hidden z-50 transition-transform duration-300 ease-out',
      'fixed inset-y-4 left-0', /* Base Mobile: Fica fixo à esquerda */
      isMobileMenuOpen ? 'translate-x-4' : '-translate-x-[120%]', /* Animação Mobile: Entra e sai da tela */
      'md:relative md:inset-auto md:translate-x-0 md:m-4 md:mr-0 md:flex' /* Base Desktop: Sempre visível e estático */
    ]">
      
      <div class="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

      <div class="h-24 flex items-center justify-between px-8">
        <div class="flex items-center">
          <div class="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/30 mr-3 border border-emerald-400/50">
            <i class="fa-solid fa-industry text-lg"></i>
          </div>
          <div>
            <h1 class="font-bold text-xl tracking-tight text-white">SafeTrack</h1>
            <p class="text-[10px] uppercase tracking-widest text-emerald-400 font-semibold mt-0.5">Operação Integrada</p>
          </div>
        </div>
        
        <button @click="isMobileMenuOpen = false" class="md:hidden w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white bg-white/5 rounded-full">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <nav @click="isMobileMenuOpen = false" class="flex-1 overflow-y-auto py-4 px-4 space-y-2">
        <p class="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 mt-2">Menu Principal</p>
        
        <router-link v-if="temPermissao('home')" to="/dashboard" class="flex items-center px-4 py-3 text-slate-300 rounded-2xl hover:bg-white/10 hover:text-white transition-all group" active-class="bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
          <i class="fa-solid fa-border-all w-7 text-lg group-hover:scale-110 transition-transform"></i>
          <span class="text-sm">Painel Operacional</span>
        </router-link>

        <div v-if="mostrarMenuGestao">
          <p class="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 mt-8">Gestão & Setup</p>
          
          <router-link v-if="temPermissao('admin')" to="/admin" class="flex items-center px-4 py-3 text-slate-300 rounded-2xl hover:bg-white/10 hover:text-white transition-all group" active-class="bg-indigo-500/10 text-indigo-400 font-semibold border border-indigo-500/20">
            <i class="fa-solid fa-sliders w-7 text-lg group-hover:scale-110 transition-transform"></i>
            <span class="text-sm">Configurações</span>
          </router-link>
          
          <router-link v-if="temPermissao('admin')" to="/unidades" class="flex items-center px-4 py-3 text-slate-300 rounded-2xl hover:bg-white/10 hover:text-white transition-all group" active-class="bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
            <i class="fa-solid fa-users-gear w-7 text-lg group-hover:scale-110 transition-transform"></i>
            <span class="text-sm">Estrutura e Liderança</span>
          </router-link>

          <router-link v-if="temPermissao('funcionarios')" to="/funcionarios" class="flex items-center px-4 py-3 text-slate-300 rounded-2xl hover:bg-white/10 hover:text-white transition-all group" active-class="bg-indigo-500/10 text-indigo-400 font-semibold border border-indigo-500/20">
            <i class="fa-solid fa-address-card w-7 text-lg group-hover:scale-110 transition-transform"></i>
            <span class="text-sm">Efetivo & Operadores</span>
          </router-link>

          <router-link v-if="temPermissao('dds_temas')" to="/biblioteca-dds" class="flex items-center px-4 py-3 text-slate-300 rounded-2xl hover:bg-white/10 hover:text-white transition-all group" active-class="bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
            <i class="fa-solid fa-book-medical w-7 text-lg group-hover:scale-110 transition-transform"></i>
            <span class="text-sm">Biblioteca de DDS</span>
          </router-link>

          <router-link v-if="temPermissao('dds_aplicar')" to="/aplicacao-dds" class="flex items-center px-4 py-3 text-slate-300 rounded-2xl hover:bg-white/10 hover:text-white transition-all group" active-class="bg-amber-500/10 text-amber-400 font-semibold border border-amber-500/20">
            <i class="fa-solid fa-bullhorn w-7 text-lg group-hover:scale-110 transition-transform"></i>
            <span class="text-sm">Aplicar DDS</span>
          </router-link>

          <router-link v-if="temPermissao('dds_historico')" to="/historico-dds" class="flex items-center px-4 py-3 text-slate-300 rounded-2xl hover:bg-white/10 hover:text-white transition-all group" active-class="bg-indigo-500/10 text-indigo-400 font-semibold border border-indigo-500/20">
            <i class="fa-solid fa-clock-rotate-left w-7 text-lg group-hover:scale-110 transition-transform"></i>
            <span class="text-sm">Histórico e Auditoria</span>
          </router-link>

          <router-link v-if="temPermissao('diario_bordo')" to="/acompanhamento" class="flex items-center px-4 py-3 text-slate-300 rounded-2xl hover:bg-white/10 hover:text-white transition-all group" active-class="bg-indigo-500/10 text-indigo-400 font-semibold border border-indigo-500/20">
            <i class="fa-solid fa-clipboard-user w-7 text-lg group-hover:scale-110 transition-transform"></i>
            <span class="text-sm">Diário de Bordo</span>
          </router-link>

          <div v-if="temPermissao('admin')" class="mt-8 mb-4 px-4">
            <h4 class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Administração</h4>
          </div>

          <router-link v-if="temPermissao('admin')" to="/adminSuper" class="flex items-center px-4 py-3 text-slate-300 rounded-2xl hover:bg-white/10 hover:text-white transition-all group" active-class="bg-rose-500/10 text-rose-400 font-semibold border border-rose-500/20">
            <div class="w-8 flex justify-center mr-2">
              <i class="fa-solid fa-user-shield text-lg group-hover:scale-110 transition-transform"></i>
            </div>
            <span class="text-sm">Controle de Acesso</span>
          </router-link>
        </div>
      </nav>

      <div class="p-4 m-4 mt-0 bg-slate-800/50 rounded-2xl border border-slate-700/50 flex items-center justify-between backdrop-blur-md">
        <div class="flex items-center overflow-hidden">
          <div class="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-inner shrink-0">
            {{ authStore.profile?.nome?.charAt(0) || 'U' }}
          </div>
          <div class="ml-3 truncate">
            <p class="text-sm font-bold text-slate-200 truncate">{{ authStore.profile?.nome?.split(' ')[0] }}</p>
            <p class="text-[10px] text-slate-400 uppercase tracking-wider truncate">{{ authStore.profile?.cargoNome || 'Sem Cargo' }}</p>
          </div>
        </div>
        <button @click="handleLogout" class="w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-700 hover:text-rose-400 transition-all" title="Sair">
          <i class="fa-solid fa-power-off text-sm"></i>
        </button>
      </div>
    </aside>

    <main class="flex-1 flex flex-col h-screen relative overflow-hidden">
      
      <header class="h-20 bg-white/70 backdrop-blur-xl border-b border-slate-200 flex items-center justify-between px-6 sm:px-10 z-10 sticky top-0 shrink-0">
        
        <div class="md:hidden flex items-center">
          <div class="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white mr-3">
            <i class="fa-solid fa-industry text-sm"></i>
          </div>
          <h1 class="font-bold text-slate-800 text-lg">SafeTrack</h1>
        </div>

        <div class="hidden md:flex items-center text-sm font-medium text-slate-500">
          <i class="fa-solid fa-house mr-2 text-slate-400"></i>
          <span>Início</span>
          <i class="fa-solid fa-chevron-right mx-2 text-[10px] text-slate-300"></i>
          <span class="text-slate-800 font-bold">Workspace</span>
        </div>

        <div class="flex items-center space-x-4">
          <button class="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-emerald-600 hover:border-emerald-200 hover:shadow-md transition-all flex items-center justify-center relative">
            <i class="fa-regular fa-bell"></i>
            <span class="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
          </button>
          
          <button @click="isMobileMenuOpen = true" class="md:hidden w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-600 flex items-center justify-center hover:bg-slate-50 active:scale-95 transition-transform">
            <i class="fa-solid fa-bars"></i>
          </button>
        </div>
      </header>

      <div class="flex-1 overflow-y-auto p-4 sm:p-6 md:p-10 relative">
        <div class="max-w-7xl mx-auto pb-20 md:pb-0">
          <router-view v-slot="{ Component }">
            <transition name="page" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </div>

    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

// 1. A variável que controla se o menu está aberto ou não no celular
const isMobileMenuOpen = ref(false)

const temPermissao = (slug) => {
  if (authStore.profile?.cargoNome === 'SuperAdmin') return true
  return authStore.profile?.permissoes?.includes(slug) || false
}

const mostrarMenuGestao = computed(() => {
  if (authStore.profile?.cargoNome === 'SuperAdmin') return true
  const permissoesGestao = ['admin', 'funcionarios', 'dds_temas', 'dds_aplicar', 'dds_historico', 'diario_bordo']
  return permissoesGestao.some(p => authStore.profile?.permissoes?.includes(p))
})

const handleLogout = async () => {
  await authStore.logout()
  router.push('/')
}
</script>

<style>
/* Animação suave para o overlay escuro sumir/aparecer */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>