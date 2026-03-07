<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-50 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl shadow-lg border border-slate-100">
      
      <div class="text-center">
        <div class="mx-auto h-16 w-16 bg-slate-900 rounded-2xl flex items-center justify-center shadow-md mb-6">
          <i class="fa-solid fa-industry text-3xl text-emerald-400"></i>
        </div>
        <h2 class="text-3xl font-extrabold text-slate-900 tracking-tight">SafeTrack</h2>
        <p class="mt-2 text-sm text-slate-500 font-medium">
          Acesso ao Sistema Operacional
        </p>
      </div>

      <div v-if="errorMessage" class="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-start">
        <i class="fa-solid fa-circle-exclamation text-red-500 mt-0.5 mr-3"></i>
        <p class="text-sm text-red-700 font-medium">{{ errorMessage }}</p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="space-y-4 shadow-sm">
          
          <div>
            <label for="email" class="block text-sm font-semibold text-slate-700 mb-1">E-mail Corporativo</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i class="fa-solid fa-envelope text-slate-400"></i>
              </div>
              <input id="email" v-model="email" name="email" type="email" autocomplete="email" required 
                class="appearance-none rounded-xl relative block w-full px-3 py-3 pl-10 border border-slate-300 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm transition-colors" 
                placeholder="nome@fabrica.com.br"
                :disabled="loading" />
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-semibold text-slate-700 mb-1">Senha</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i class="fa-solid fa-lock text-slate-400"></i>
              </div>
              <input id="password" v-model="password" :type="showPassword ? 'text' : 'password'" autocomplete="current-password" required 
                class="appearance-none rounded-xl relative block w-full px-3 py-3 pl-10 pr-10 border border-slate-300 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm transition-colors" 
                placeholder="••••••••"
                :disabled="loading" />
              
              <button type="button" @click="showPassword = !showPassword" class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none">
                <i class="fa-solid" :class="showPassword ? 'fa-eye-slash' : 'fa-eye'"></i>
              </button>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between mt-4">
          <div class="text-sm">
            <a href="#" class="font-medium text-emerald-600 hover:text-emerald-500 transition-colors">Esqueceu a senha?</a>
          </div>
        </div>

        <div>
          <button type="submit" :disabled="loading" 
            class="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-all disabled:opacity-70 disabled:cursor-not-allowed">
            <span v-if="loading" class="absolute left-0 inset-y-0 flex items-center pl-3">
              <i class="fa-solid fa-circle-notch fa-spin text-emerald-500"></i>
            </span>
            {{ loading ? 'Autenticando...' : 'Entrar no Sistema' }}
          </button>
        </div>
      </form>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../lib/supabase'

const router = useRouter()
const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')
const showPassword = ref(false)

const handleLogin = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    })

    if (error) {
      // Tradução simples de erros comuns do Supabase para o usuário final
      if (error.message.includes('Invalid login credentials')) {
        errorMessage.value = 'E-mail ou senha incorretos. Tente novamente.'
      } else {
        errorMessage.value = 'Ocorreu um erro ao tentar acessar. Verifique sua conexão.'
      }
    } else {
      // Se der certo, o redirecionamento é feito lá no `router.beforeEach`
      // Mas podemos forçar a ida pro Dashboard aqui por garantia:
      router.push('/dashboard')
    }
  } catch (err) {
    errorMessage.value = 'Erro inesperado no sistema.'
  } finally {
    loading.value = false
  }
}
</script>