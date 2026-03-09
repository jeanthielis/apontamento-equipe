<template>
  <div class="animate-fade-in space-y-6 pb-6">

    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
      <div>
        <h2 class="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">Efetivo & Operadores</h2>
        <p class="text-slate-500 mt-1 text-sm">Gerencie colaboradores e vínculos com as equipes.</p>
      </div>
      <div class="flex items-center gap-2">
        <div class="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl text-sm font-bold border border-indigo-100 flex items-center">
          <i class="fa-solid fa-users mr-2"></i>
          {{ funcionariosAtivos }} ativos
        </div>
        <button
          @click="mostrarFormulario = !mostrarFormulario"
          class="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-800 transition-all"
        >
          <i :class="mostrarFormulario ? 'fa-solid fa-xmark' : 'fa-solid fa-user-plus'"></i>
          <span class="hidden sm:inline">{{ mostrarFormulario ? 'Fechar' : 'Novo' }}</span>
        </button>
      </div>
    </div>

    <!-- Formulário de cadastro (colapsável) -->
    <div v-if="mostrarFormulario" class="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
      <h3 class="font-bold text-slate-800 mb-4 flex items-center text-sm">
        <div class="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center mr-2">
          <i class="fa-solid fa-user-plus text-xs"></i>
        </div>
        Novo Colaborador
      </h3>
      <form @submit.prevent="salvarFuncionario" class="space-y-3">
        <div>
          <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Nome Completo</label>
          <input
            v-model="novo.nome"
            type="text"
            required
            class="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          >
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Matrícula</label>
            <input
              v-model="novo.matricula"
              type="text"
              placeholder="Opcional"
              class="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            >
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Cargo</label>
            <input
              v-model="novo.cargo"
              type="text"
              placeholder="Ex: Operador I"
              class="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            >
          </div>
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Equipe / Turno</label>
          <select
            v-model="novo.equipe_id"
            required
            class="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
          >
            <option value="" disabled>Selecione a equipe...</option>
            <optgroup v-for="u in unidades" :key="u.id" :label="u.nome">
              <option
                v-for="eq in getEquipesDaUnidade(u.id)"
                :key="eq.id"
                :value="eq.id"
              >
                {{ eq.nome }}
              </option>
            </optgroup>
          </select>
        </div>
        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-all flex justify-center items-center text-sm"
        >
          <i v-if="loading" class="fa-solid fa-circle-notch fa-spin mr-2"></i>
          {{ loading ? 'Salvando...' : 'Cadastrar Colaborador' }}
        </button>
      </form>
    </div>

    <!-- Barra de busca e filtros -->
    <div class="flex flex-col sm:flex-row gap-3">
      <div class="relative flex-1">
        <i class="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
        <input
          v-model="busca"
          type="text"
          placeholder="Buscar por nome ou matrícula..."
          class="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 bg-white"
        >
      </div>
      <div class="flex gap-2">
        <select
          v-model="filtroEquipe"
          class="flex-1 sm:flex-none px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-indigo-400 bg-white"
        >
          <option value="">Todas as equipes</option>
          <option v-for="eq in equipesComUnidade" :key="eq.id" :value="eq.id">
            {{ eq.nome }}
          </option>
        </select>
        <button
          @click="filtroStatus = filtroStatus === 'ativo' ? 'todos' : 'ativo'"
          :class="filtroStatus === 'ativo' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-600 border-slate-200'"
          class="px-4 py-3 rounded-xl border text-sm font-bold transition-all whitespace-nowrap"
        >
          <i class="fa-solid fa-circle-check mr-1"></i>
          <span class="hidden sm:inline">{{ filtroStatus === 'ativo' ? 'Ativos' : 'Todos' }}</span>
        </button>
      </div>
    </div>

    <!-- Contador de resultados -->
    <div class="flex items-center justify-between">
      <p class="text-xs text-slate-500 font-medium">
        {{ funcionariosFiltrados.length }} colaborador(es) encontrado(s)
      </p>
      <!-- Alternador de visualização -->
      <div class="flex bg-slate-100 rounded-xl p-1 gap-1">
        <button
          @click="visualizacao = 'cards'"
          :class="visualizacao === 'cards' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-400'"
          class="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
        >
          <i class="fa-solid fa-grip text-sm"></i>
        </button>
        <button
          @click="visualizacao = 'lista'"
          :class="visualizacao === 'lista' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-400'"
          class="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
        >
          <i class="fa-solid fa-list text-sm"></i>
        </button>
      </div>
    </div>

    <!-- Visualização em CARDS (mobile first) -->
    <div v-if="visualizacao === 'cards'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      <div v-if="funcionariosFiltrados.length === 0" class="sm:col-span-2 lg:col-span-3">
        <div class="bg-white rounded-2xl p-10 text-center text-slate-400 border border-slate-200">
          <i class="fa-solid fa-users-slash text-3xl mb-3 block"></i>
          Nenhum colaborador encontrado.
        </div>
      </div>

      <div
        v-for="func in funcionariosFiltrados"
        :key="func.id"
        class="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col gap-3"
      >
        <!-- Avatar e nome -->
        <div class="flex items-start gap-3">
          <div class="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white font-bold text-base shrink-0 shadow-md shadow-indigo-500/20">
            {{ func.nome?.charAt(0) || 'U' }}
          </div>
          <div class="min-w-0 flex-1">
            <p class="font-bold text-slate-800 text-sm leading-tight truncate">{{ func.nome }}</p>
            <p class="text-xs text-slate-500 mt-0.5">{{ func.cargo || 'Sem cargo' }}</p>
            <p v-if="func.matricula" class="text-[10px] text-slate-400 font-mono">Mat: {{ func.matricula }}</p>
          </div>
          <!-- Status badge -->
          <span
            class="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold border"
            :class="func.ativo ? 'text-emerald-600 bg-emerald-50 border-emerald-200' : 'text-slate-500 bg-slate-100 border-slate-200'"
          >
            {{ func.ativo ? 'Ativo' : 'Inativo' }}
          </span>
        </div>

        <!-- Equipe e unidade -->
        <div class="bg-slate-50 rounded-xl px-3 py-2 flex items-center gap-2">
          <i class="fa-solid fa-people-group text-xs text-slate-400"></i>
          <div class="min-w-0">
            <p class="text-xs font-bold text-slate-700 truncate">{{ getNomeEquipe(func.equipe_id) }}</p>
            <p class="text-[10px] text-slate-400 truncate">{{ getNomeUnidadePorEquipe(func.equipe_id) }}</p>
          </div>
        </div>

        <!-- Ação -->
        <button
          @click="toggleStatus(func)"
          class="w-full py-2 rounded-xl border text-xs font-bold transition-all"
          :class="func.ativo
            ? 'border-rose-200 text-rose-500 hover:bg-rose-50'
            : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'"
        >
          <i :class="func.ativo ? 'fa-solid fa-ban mr-1' : 'fa-solid fa-circle-check mr-1'"></i>
          {{ func.ativo ? 'Desativar' : 'Reativar' }}
        </button>
      </div>
    </div>

    <!-- Visualização em LISTA (desktop friendly) -->
    <div v-if="visualizacao === 'lista'" class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
              <th class="p-4 font-bold">Colaborador</th>
              <th class="p-4 font-bold hidden sm:table-cell">Equipe</th>
              <th class="p-4 font-bold text-center">Status</th>
              <th class="p-4 font-bold text-right">Ações</th>
            </tr>
          </thead>
          <tbody class="text-sm divide-y divide-slate-50">
            <tr v-if="funcionariosFiltrados.length === 0">
              <td colspan="4" class="p-8 text-center text-slate-400">Nenhum colaborador encontrado.</td>
            </tr>
            <tr
              v-for="func in funcionariosFiltrados"
              :key="func.id"
              class="hover:bg-slate-50/50 transition-colors group"
            >
              <td class="p-4">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs shrink-0">
                    {{ func.nome?.charAt(0) }}
                  </div>
                  <div>
                    <p class="font-bold text-slate-800">{{ func.nome }}</p>
                    <p class="text-xs text-slate-500">{{ func.cargo }} {{ func.matricula ? `• Mat: ${func.matricula}` : '' }}</p>
                  </div>
                </div>
              </td>
              <td class="p-4 hidden sm:table-cell">
                <div>
                  <span class="bg-slate-100 px-2.5 py-1 rounded-lg text-xs font-semibold border border-slate-200">
                    {{ getNomeEquipe(func.equipe_id) }}
                  </span>
                  <p class="text-[10px] text-slate-400 mt-1">{{ getNomeUnidadePorEquipe(func.equipe_id) }}</p>
                </div>
              </td>
              <td class="p-4 text-center">
                <span
                  class="px-2.5 py-1 rounded-full text-xs font-bold border"
                  :class="func.ativo ? 'text-emerald-600 bg-emerald-50 border-emerald-200' : 'text-slate-500 bg-slate-100 border-slate-200'"
                >
                  {{ func.ativo ? 'Ativo' : 'Inativo' }}
                </span>
              </td>
              <td class="p-4 text-right">
                <button
                  @click="toggleStatus(func)"
                  class="text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors"
                >
                  {{ func.ativo ? 'Desativar' : 'Reativar' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { supabase } from '../lib/supabase'
import { toast, alerta, traduzirErro } from '../lib/alerts'

const funcionarios = ref([])
const equipesComUnidade = ref([])
const unidades = ref([])
const loading = ref(false)
const mostrarFormulario = ref(false)
const busca = ref('')
const filtroEquipe = ref('')
const filtroStatus = ref('ativo')
const visualizacao = ref('cards')

const novo = ref({ nome: '', matricula: '', cargo: 'Operador', equipe_id: '' })

const fetchData = async () => {
  const { data: f } = await supabase.from('funcionarios').select('*').order('nome')
  if (f) funcionarios.value = f

  const { data: eq } = await supabase.from('equipes').select(`
    id, nome, unidade_id,
    unidades (nome)
  `).order('nome')
  if (eq) equipesComUnidade.value = eq

  const { data: u } = await supabase.from('unidades').select('*').order('nome')
  if (u) unidades.value = u
}

const getEquipesDaUnidade = (unidadeId) => {
  return equipesComUnidade.value.filter(e => e.unidade_id === unidadeId)
}

const getNomeEquipe = (id) => {
  return equipesComUnidade.value.find(e => e.id === id)?.nome || 'Sem equipe'
}

const getNomeUnidadePorEquipe = (equipeId) => {
  const eq = equipesComUnidade.value.find(e => e.id === equipeId)
  return eq?.unidades?.nome || ''
}

const funcionariosAtivos = computed(() => funcionarios.value.filter(f => f.ativo).length)

const funcionariosFiltrados = computed(() => {
  return funcionarios.value.filter(f => {
    const matchBusca = !busca.value ||
      f.nome?.toLowerCase().includes(busca.value.toLowerCase()) ||
      f.matricula?.toLowerCase().includes(busca.value.toLowerCase())

    const matchEquipe = !filtroEquipe.value || f.equipe_id === filtroEquipe.value

    const matchStatus = filtroStatus.value === 'todos' || f.ativo

    return matchBusca && matchEquipe && matchStatus
  })
})

const salvarFuncionario = async () => {
  if (!novo.value.nome || !novo.value.equipe_id) return
  loading.value = true

  const dadosParaSalvar = {
    nome: novo.value.nome,
    equipe_id: novo.value.equipe_id,
    matricula: novo.value.matricula || null,
    funcao: novo.value.cargo || 'Operador',
    cargo: novo.value.cargo || 'Operador'
  }

  const { error } = await supabase.from('funcionarios').insert([dadosParaSalvar])

  if (!error) {
    toast.fire({ icon: 'success', title: 'Operador cadastrado com sucesso!' })
    novo.value = { nome: '', matricula: '', cargo: 'Operador', equipe_id: '' }
    mostrarFormulario.value = false
    await fetchData()
  } else {
    toast.fire({ icon: 'error', title: 'Erro ao cadastrar', text: traduzirErro(error) })
  }
  loading.value = false
}

const toggleStatus = async (func) => {
  const acao = func.ativo ? 'Desativar' : 'Reativar'

  const confirmacao = await alerta.fire({
    title: `${acao} colaborador?`,
    html: `Deseja realmente ${acao.toLowerCase()} <b>${func.nome}</b>?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: func.ativo ? '#e11d48' : '#10b981',
    cancelButtonColor: '#94a3b8',
    confirmButtonText: `Sim, ${acao.toLowerCase()}`,
    cancelButtonText: 'Cancelar'
  })

  if (confirmacao.isConfirmed) {
    const { error } = await supabase.from('funcionarios').update({ ativo: !func.ativo }).eq('id', func.id)
    if (!error) {
      toast.fire({ icon: 'success', title: 'Status atualizado!' })
      await fetchData()
    } else {
      toast.fire({ icon: 'error', title: 'Erro', text: error.message })
    }
  }
}

onMounted(fetchData)
</script>
