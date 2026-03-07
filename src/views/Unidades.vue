<template>
  <div class="animate-fade-in">
    <div class="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h2 class="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">Estrutura Corporativa</h2>
        <p class="text-slate-500 mt-1 text-sm sm:text-base">Gerencie as unidades da fábrica e a liderança responsável.</p>
      </div>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
      
      <div class="flex flex-col gap-6">
        <div class="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 transition-all hover:shadow-md">
          <h3 class="text-lg font-bold text-slate-800 mb-5 flex items-center">
            <div class="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center mr-3">
              <i class="fa-solid fa-industry"></i>
            </div>
            Nova Unidade / Setor
          </h3>
          
          <form @submit.prevent="salvarUnidade" class="space-y-4">
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-2">Nome da Unidade</label>
              <input v-model="novaUnidade.nome" type="text" required placeholder="Ex: Matriz - Linha de Produção 1" class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm placeholder:text-slate-400">
            </div>
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-2">Descrição (Opcional)</label>
              <textarea v-model="novaUnidade.descricao" rows="2" placeholder="Detalhes do setor..." class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm placeholder:text-slate-400 resize-none"></textarea>
            </div>
            <button type="submit" :disabled="loading" class="w-full bg-slate-900 text-white font-bold py-3 px-4 rounded-xl hover:bg-slate-800 active:scale-[0.98] transition-all disabled:opacity-50 flex justify-center items-center">
              <i v-if="loading" class="fa-solid fa-circle-notch fa-spin mr-2"></i>
              {{ loading ? 'Salvando...' : 'Cadastrar Unidade' }}
            </button>
          </form>
        </div>

        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <table class="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr class="bg-slate-50/80 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                <th class="p-5 font-bold">Unidade Cadastrada</th>
                <th class="p-5 font-bold text-right">Ação</th>
              </tr>
            </thead>
            <tbody class="text-sm">
              <tr v-if="unidades.length === 0">
                <td colspan="2" class="p-8 text-center text-slate-500 font-medium">Nenhuma unidade cadastrada.</td>
              </tr>
              <tr v-for="unidade in unidades" :key="unidade.id" class="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                <td class="p-5">
                  <p class="font-bold text-slate-800">{{ unidade.nome }}</p>
                  <p class="text-xs text-slate-500 mt-0.5 truncate max-w-xs">{{ unidade.descricao || 'Sem descrição' }}</p>
                </td>
                <td class="p-5 text-right">
                   <button class="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors">
                    <i class="fa-solid fa-pen"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-fit">
        <div class="p-6 sm:p-8 border-b border-slate-100">
          <h3 class="text-lg font-bold text-slate-800 flex items-center">
            <div class="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center mr-3">
              <i class="fa-solid fa-users-gear"></i>
            </div>
            Gestores do Sistema
          </h3>
          <p class="text-sm text-slate-500 mt-2">Profissionais com acesso administrativo ou gerencial.</p>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse whitespace-nowrap">
            <tbody class="text-sm">
              <tr v-if="supervisores.length === 0">
                <td class="p-8 text-center text-slate-500 font-medium">Nenhum gestor encontrado.</td>
              </tr>
              <tr v-for="sup in supervisores" :key="sup.id" class="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                <td class="p-5">
                  <div class="flex items-center">
                    <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-slate-200 to-slate-300 flex items-center justify-center text-slate-600 font-bold mr-3 shadow-inner">
                      {{ sup.nome?.charAt(0) || 'U' }}
                    </div>
                    <div>
                      <p class="font-bold text-slate-800">{{ sup.nome }}</p>
                      <p class="text-xs text-slate-500">{{ sup.email }}</p>
                    </div>
                  </div>
                </td>
                <td class="p-5 text-right">
                  <span class="px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider" 
                        :class="sup.role === 'gerente' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'">
                    {{ sup.role }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../lib/supabase'

const unidades = ref([])
const supervisores = ref([])
const loading = ref(false)
const novaUnidade = ref({ nome: '', descricao: '' })

const fetchData = async () => {
  // 1. Busca as Unidades
  const { data: dataUnidades } = await supabase
    .from('unidades')
    .select('*')
    .order('nome')
  
  if (dataUnidades) unidades.value = dataUnidades

  // 2. Busca Supervisores e Gerentes
  const { data: dataGestores } = await supabase
    .from('usuarios')
    .select('*')
    .in('role', ['supervisor', 'gerente'])
    .order('nome')

  if (dataGestores) supervisores.value = dataGestores
}

const salvarUnidade = async () => {
  if (!novaUnidade.value.nome) return
  loading.value = true

  const { error } = await supabase
    .from('unidades')
    .insert([{ 
      nome: novaUnidade.value.nome, 
      descricao: novaUnidade.value.descricao 
    }])

  if (error) {
    alert('Erro ao salvar unidade: ' + error.message)
  } else {
    novaUnidade.value = { nome: '', descricao: '' }
    await fetchData()
  }
  loading.value = false
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>