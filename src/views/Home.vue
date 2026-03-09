<template>
  <div class="h-[80vh] flex flex-col items-center justify-center p-6 text-center animate-fade-in">
    
    <div class="w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-emerald-500/30 mb-8 border border-emerald-400/50">
      <i class="fa-solid fa-industry text-5xl"></i>
    </div>

    <h1 class="text-4xl md:text-5xl font-black text-slate-800 tracking-tight mb-4">
      {{ saudacao }}, <span class="text-emerald-500">{{ primeiroNome }}</span>!
    </h1>

    <p class="text-lg text-slate-500 max-w-xl mb-10">
      Bem-vindo ao <strong class="text-slate-700">SafeTrack</strong>. Seu acesso de <strong class="text-indigo-500 uppercase tracking-widest text-sm font-bold">{{ cargo }}</strong> está confirmado e ativo.
    </p>

    <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm max-w-md w-full relative overflow-hidden">
      <div class="absolute top-0 right-0 w-16 h-16 bg-slate-50 rounded-bl-full -z-0"></div>
      
      <div class="relative z-10">
        <div class="flex items-center text-amber-500 mb-3 justify-center gap-2">
          <i class="fa-solid fa-circle-info text-lg"></i>
          <span class="font-bold text-xs uppercase tracking-widest">Aviso do Sistema</span>
        </div>
        <p class="text-slate-600 text-sm leading-relaxed">
          Utilize o <strong class="text-slate-800">menu lateral esquerdo</strong> para navegar entre os módulos e ferramentas que foram liberadas para o seu perfil operacional.
        </p>
      </div>
    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()

// Pega apenas o primeiro nome
const primeiroNome = computed(() => {
  const nomeCompleto = authStore.profile?.nome || 'Colaborador'
  return nomeCompleto.split(' ')[0]
})

// Pega o nome do cargo que veio do banco de dados
const cargo = computed(() => {
  return authStore.profile?.cargoNome || 'Operacional'
})

// Define a saudação baseada na hora local
const saudacao = computed(() => {
  const hora = new Date().getHours()
  if (hora < 12) return 'Bom dia'
  if (hora < 18) return 'Boa tarde'
  return 'Boa noite'
})
</script>

<style scoped>
/* Animação suave de entrada */
.animate-fade-in {
  animation: fadeIn 0.8s ease-out forwards;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>