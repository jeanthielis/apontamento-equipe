<template>
  <div class="animate-fade-in space-y-6 pb-6">

    <!-- Header -->
    <div>
      <h2 class="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">Estrutura Operacional</h2>
      <p class="text-slate-500 mt-1 text-sm">Gerencie setores, equipes e vínculos de liderança.</p>
    </div>

    <!-- Abas de navegação mobile-friendly -->
    <div class="flex gap-2 bg-slate-100 p-1 rounded-2xl w-full">
      <button
        @click="abaAtiva = 'unidades'"
        :class="abaAtiva === 'unidades' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'"
        class="flex-1 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2"
      >
        <i class="fa-solid fa-industry"></i>
        <span class="hidden sm:inline">Unidades</span>
        <span class="sm:hidden">Unidades</span>
      </button>
      <button
        @click="abaAtiva = 'equipes'"
        :class="abaAtiva === 'equipes' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'"
        class="flex-1 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2"
      >
        <i class="fa-solid fa-people-group"></i>
        <span>Equipes</span>
      </button>
      <button
        @click="abaAtiva = 'vinculos'"
        :class="abaAtiva === 'vinculos' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'"
        class="flex-1 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2"
      >
        <i class="fa-solid fa-sitemap"></i>
        <span class="hidden sm:inline">Vínculos</span>
        <span class="sm:hidden">Vínculos</span>
      </button>
    </div>

    <!-- ABA: UNIDADES -->
    <div v-if="abaAtiva === 'unidades'" class="space-y-4">

      <!-- Formulário nova unidade -->
      <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
        <h3 class="font-bold text-slate-800 mb-4 flex items-center text-sm">
          <div class="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center mr-2">
            <i class="fa-solid fa-plus text-xs"></i>
          </div>
          Nova Unidade / Setor
        </h3>
        <form @submit.prevent="salvarUnidade" class="flex gap-3">
          <input
            v-model="novaUnidade.nome"
            type="text"
            required
            placeholder="Ex: Preparação de Massa"
            class="flex-1 px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          >
          <button
            type="submit"
            :disabled="loadingUnidade"
            class="bg-slate-900 text-white font-bold py-3 px-5 rounded-xl hover:bg-slate-800 transition-all disabled:opacity-50 whitespace-nowrap text-sm"
          >
            <i v-if="loadingUnidade" class="fa-solid fa-circle-notch fa-spin"></i>
            <span v-else>Criar</span>
          </button>
        </form>
      </div>

      <!-- Lista de unidades -->
      <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div class="bg-slate-50 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
          <span class="font-bold text-slate-600 text-sm">Unidades Cadastradas</span>
          <span class="bg-indigo-100 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-full">{{ unidades.length }}</span>
        </div>
        <ul class="divide-y divide-slate-100">
          <li v-if="unidades.length === 0" class="p-6 text-center text-slate-400 text-sm">
            <i class="fa-solid fa-industry text-2xl mb-2 block"></i>
            Nenhuma unidade cadastrada.
          </li>
          <li
            v-for="u in unidades"
            :key="u.id"
            class="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
          >
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <i class="fa-solid fa-industry text-sm"></i>
              </div>
              <div>
                <p class="font-semibold text-slate-800 text-sm">{{ u.nome }}</p>
                <p class="text-xs text-slate-400">{{ contarEquipesPorUnidade(u.id) }} equipe(s)</p>
              </div>
            </div>
            <button
              @click="deletarUnidade(u.id)"
              class="w-8 h-8 rounded-lg text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-colors flex items-center justify-center"
              title="Excluir Unidade"
            >
              <i class="fa-solid fa-trash-can text-sm"></i>
            </button>
          </li>
        </ul>
      </div>
    </div>

    <!-- ABA: EQUIPES -->
    <div v-if="abaAtiva === 'equipes'" class="space-y-4">

      <!-- Formulário nova equipe -->
      <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
        <h3 class="font-bold text-slate-800 mb-4 flex items-center text-sm">
          <div class="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center mr-2">
            <i class="fa-solid fa-people-group text-xs"></i>
          </div>
          Nova Equipe / Turno
        </h3>
        <form @submit.prevent="salvarEquipe" class="space-y-3">
          <div>
            <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Unidade</label>
            <select
              v-model="novaEquipe.unidade_id"
              required
              class="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500 text-sm bg-white"
            >
              <option value="" disabled>Selecione a unidade...</option>
              <option v-for="u in unidades" :key="u.id" :value="u.id">{{ u.nome }}</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Nome da Equipe</label>
            <input
              v-model="novaEquipe.nome"
              type="text"
              required
              placeholder="Ex: Turma A – Manhã"
              class="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            >
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Supervisor (opcional)</label>
              <select
                v-model="novaEquipe.supervisor_id"
                class="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500 text-sm bg-white"
              >
                <option value="">Sem supervisor</option>
                <option v-for="u in usuarios" :key="u.id" :value="u.id">{{ u.nome }}</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Coordenador (opcional)</label>
              <select
                v-model="novaEquipe.coordenador_id"
                class="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500 text-sm bg-white"
              >
                <option value="">Sem coordenador</option>
                <option v-for="u in usuarios" :key="u.id" :value="u.id">{{ u.nome }}</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            :disabled="loadingEquipe || !novaEquipe.unidade_id"
            class="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 transition-all disabled:opacity-50 text-sm"
          >
            <i v-if="loadingEquipe" class="fa-solid fa-circle-notch fa-spin mr-2"></i>
            {{ loadingEquipe ? 'Salvando...' : 'Criar Equipe' }}
          </button>
        </form>
      </div>

      <!-- Lista de equipes em cards mobile -->
      <div class="space-y-3">
        <div v-if="equipes.length === 0" class="bg-white rounded-2xl p-8 text-center text-slate-400 border border-slate-200">
          <i class="fa-solid fa-people-group text-3xl mb-2 block"></i>
          Nenhuma equipe cadastrada.
        </div>

        <div
          v-for="eq in equipes"
          :key="eq.id"
          class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
        >
          <!-- Header do card -->
          <div class="p-4 flex items-start justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <i class="fa-solid fa-people-group"></i>
              </div>
              <div>
                <p class="font-bold text-slate-800 text-sm">{{ eq.nome }}</p>
                <p class="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                  <i class="fa-solid fa-industry"></i>
                  {{ eq.unidades?.nome || 'Unidade desconhecida' }}
                </p>
              </div>
            </div>
            <button
              @click="deletarEquipe(eq.id)"
              class="w-8 h-8 rounded-lg text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-colors flex items-center justify-center shrink-0"
            >
              <i class="fa-solid fa-trash-can text-sm"></i>
            </button>
          </div>

          <!-- Liderança da equipe -->
          <div class="px-4 pb-4 grid grid-cols-2 gap-2" v-if="eq.supervisor_id || eq.coordenador_id">
            <div v-if="eq.supervisor_id" class="bg-indigo-50 rounded-xl p-3">
              <p class="text-[10px] font-black text-indigo-400 uppercase tracking-wider mb-1">Supervisor</p>
              <p class="text-xs font-bold text-indigo-800 truncate">{{ getNomeUsuario(eq.supervisor_id) }}</p>
            </div>
            <div v-if="eq.coordenador_id" class="bg-amber-50 rounded-xl p-3">
              <p class="text-[10px] font-black text-amber-400 uppercase tracking-wider mb-1">Coordenador</p>
              <p class="text-xs font-bold text-amber-800 truncate">{{ getNomeUsuario(eq.coordenador_id) }}</p>
            </div>
          </div>

          <!-- Sem liderança definida -->
          <div v-if="!eq.supervisor_id && !eq.coordenador_id" class="px-4 pb-4">
            <button
              @click="abrirModalVinculo(eq)"
              class="w-full text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl py-2 hover:border-indigo-300 hover:text-indigo-500 transition-all"
            >
              <i class="fa-solid fa-plus mr-1"></i> Vincular liderança
            </button>
          </div>

          <!-- Botão editar vínculo quando já tem liderança -->
          <div v-else class="px-4 pb-4">
            <button
              @click="abrirModalVinculo(eq)"
              class="w-full text-xs text-slate-400 hover:text-indigo-500 transition-colors py-1"
            >
              <i class="fa-solid fa-pen-to-square mr-1"></i> Editar vínculos
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ABA: VÍNCULOS (Visão geral hierárquica) -->
    <div v-if="abaAtiva === 'vinculos'" class="space-y-4">
      <div v-for="u in unidades" :key="u.id" class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

        <!-- Unidade header -->
        <div class="bg-slate-800 px-5 py-4 flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white">
            <i class="fa-solid fa-industry"></i>
          </div>
          <div>
            <p class="font-bold text-white">{{ u.nome }}</p>
            <p class="text-[11px] text-slate-400">{{ getEquipesDaUnidade(u.id).length }} equipe(s)</p>
          </div>
        </div>

        <!-- Equipes da unidade -->
        <div class="divide-y divide-slate-100">
          <div v-if="getEquipesDaUnidade(u.id).length === 0" class="p-4 text-sm text-slate-400 text-center">
            Nenhuma equipe nesta unidade.
          </div>

          <div
            v-for="eq in getEquipesDaUnidade(u.id)"
            :key="eq.id"
            class="p-4"
          >
            <!-- Nome da equipe -->
            <div class="flex items-center gap-2 mb-3">
              <div class="w-2 h-2 rounded-full bg-emerald-500"></div>
              <p class="font-bold text-slate-800 text-sm">{{ eq.nome }}</p>
            </div>

            <!-- Liderança em grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 ml-4">
              <!-- Supervisor -->
              <div class="flex items-center gap-3 bg-indigo-50 rounded-xl p-3">
                <div class="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold shrink-0">
                  <span v-if="eq.supervisor_id">{{ getNomeUsuario(eq.supervisor_id)?.charAt(0) }}</span>
                  <i v-else class="fa-solid fa-user-slash text-slate-300"></i>
                </div>
                <div class="min-w-0">
                  <p class="text-[10px] font-black text-indigo-400 uppercase tracking-wider">Supervisor</p>
                  <p class="text-xs font-bold text-indigo-800 truncate">
                    {{ eq.supervisor_id ? getNomeUsuario(eq.supervisor_id) : 'Não definido' }}
                  </p>
                </div>
              </div>

              <!-- Coordenador -->
              <div class="flex items-center gap-3 bg-amber-50 rounded-xl p-3">
                <div class="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs font-bold shrink-0">
                  <span v-if="eq.coordenador_id">{{ getNomeUsuario(eq.coordenador_id)?.charAt(0) }}</span>
                  <i v-else class="fa-solid fa-user-slash text-slate-300"></i>
                </div>
                <div class="min-w-0">
                  <p class="text-[10px] font-black text-amber-400 uppercase tracking-wider">Coordenador</p>
                  <p class="text-xs font-bold text-amber-800 truncate">
                    {{ eq.coordenador_id ? getNomeUsuario(eq.coordenador_id) : 'Não definido' }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Membros da equipe -->
            <div class="ml-4 mt-2" v-if="getMembros(eq.id).length > 0">
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">
                Membros ({{ getMembros(eq.id).length }})
              </p>
              <div class="flex flex-wrap gap-1.5">
                <span
                  v-for="m in getMembros(eq.id)"
                  :key="m.id"
                  class="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-medium"
                >
                  {{ m.nome }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="unidades.length === 0" class="bg-white rounded-2xl p-10 text-center text-slate-400 border border-slate-200">
        <i class="fa-solid fa-sitemap text-4xl mb-3 block"></i>
        Nenhuma unidade cadastrada ainda.
      </div>
    </div>

    <!-- Modal para editar vínculos de liderança -->
    <div
      v-if="modalVinculo.aberto"
      class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
    >
      <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="fecharModal"></div>
      <div class="relative bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl z-10 overflow-hidden">

        <!-- Header do modal -->
        <div class="bg-slate-800 px-6 py-5 flex items-center justify-between">
          <div>
            <p class="font-bold text-white">Vínculos de Liderança</p>
            <p class="text-xs text-slate-400 mt-0.5">{{ modalVinculo.equipe?.nome }}</p>
          </div>
          <button @click="fecharModal" class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <!-- Conteúdo -->
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              <i class="fa-solid fa-user-tie text-indigo-500 mr-1"></i> Supervisor
            </label>
            <select
              v-model="modalVinculo.supervisor_id"
              class="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
            >
              <option value="">Sem supervisor</option>
              <option v-for="u in usuarios" :key="u.id" :value="u.id">{{ u.nome }}</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              <i class="fa-solid fa-user-shield text-amber-500 mr-1"></i> Coordenador
            </label>
            <select
              v-model="modalVinculo.coordenador_id"
              class="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-amber-500 text-sm bg-white"
            >
              <option value="">Sem coordenador</option>
              <option v-for="u in usuarios" :key="u.id" :value="u.id">{{ u.nome }}</option>
            </select>
          </div>
        </div>

        <!-- Ações do modal -->
        <div class="px-6 pb-6 flex gap-3">
          <button @click="fecharModal" class="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50">
            Cancelar
          </button>
          <button @click="salvarVinculo" :disabled="loadingVinculo" class="flex-1 py-3 rounded-xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 transition-all disabled:opacity-50">
            <i v-if="loadingVinculo" class="fa-solid fa-circle-notch fa-spin mr-2"></i>
            {{ loadingVinculo ? 'Salvando...' : 'Salvar Vínculos' }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../lib/supabase'
import { toast, alerta } from '../lib/alerts'

const abaAtiva = ref('unidades')
const unidades = ref([])
const equipes = ref([])
const usuarios = ref([])
const funcionarios = ref([])

const novaUnidade = ref({ nome: '' })
const novaEquipe = ref({ nome: '', unidade_id: '', supervisor_id: '', coordenador_id: '' })

const loadingUnidade = ref(false)
const loadingEquipe = ref(false)
const loadingVinculo = ref(false)

const modalVinculo = ref({
  aberto: false,
  equipe: null,
  supervisor_id: '',
  coordenador_id: ''
})

const fetchData = async () => {
  const { data: u } = await supabase.from('unidades').select('*').order('nome')
  if (u) unidades.value = u

  const { data: e } = await supabase.from('equipes').select(`
    id, nome, unidade_id, supervisor_id, coordenador_id,
    unidades (nome)
  `).order('nome')
  if (e) equipes.value = e

  const { data: us } = await supabase.from('usuarios').select('id, nome').order('nome')
  if (us) usuarios.value = us

  const { data: f } = await supabase.from('funcionarios').select('id, nome, equipe_id').eq('ativo', true).order('nome')
  if (f) funcionarios.value = f
}

const getNomeUsuario = (id) => {
  if (!id) return null
  return usuarios.value.find(u => u.id === id)?.nome || 'Usuário não encontrado'
}

const contarEquipesPorUnidade = (unidadeId) => {
  return equipes.value.filter(e => e.unidade_id === unidadeId).length
}

const getEquipesDaUnidade = (unidadeId) => {
  return equipes.value.filter(e => e.unidade_id === unidadeId)
}

const getMembros = (equipeId) => {
  return funcionarios.value.filter(f => f.equipe_id === equipeId)
}

const salvarUnidade = async () => {
  if (!novaUnidade.value.nome) return
  loadingUnidade.value = true
  const { error } = await supabase.from('unidades').insert([{ nome: novaUnidade.value.nome }])
  if (!error) {
    novaUnidade.value.nome = ''
    toast.fire({ icon: 'success', title: 'Unidade criada!' })
    await fetchData()
  } else {
    toast.fire({ icon: 'error', title: 'Erro ao criar unidade', text: error.message })
  }
  loadingUnidade.value = false
}

const salvarEquipe = async () => {
  if (!novaEquipe.value.nome || !novaEquipe.value.unidade_id) return
  loadingEquipe.value = true

  const dados = {
    nome: novaEquipe.value.nome,
    unidade_id: novaEquipe.value.unidade_id,
    supervisor_id: novaEquipe.value.supervisor_id || null,
    coordenador_id: novaEquipe.value.coordenador_id || null
  }

  const { error } = await supabase.from('equipes').insert([dados])
  if (!error) {
    novaEquipe.value = { nome: '', unidade_id: '', supervisor_id: '', coordenador_id: '' }
    toast.fire({ icon: 'success', title: 'Equipe criada!' })
    await fetchData()
  } else {
    toast.fire({ icon: 'error', title: 'Erro ao criar equipe', text: error.message })
  }
  loadingEquipe.value = false
}

const abrirModalVinculo = (equipe) => {
  modalVinculo.value = {
    aberto: true,
    equipe,
    supervisor_id: equipe.supervisor_id || '',
    coordenador_id: equipe.coordenador_id || ''
  }
}

const fecharModal = () => {
  modalVinculo.value.aberto = false
}

const salvarVinculo = async () => {
  if (!modalVinculo.value.equipe) return
  loadingVinculo.value = true

  const { error } = await supabase.from('equipes').update({
    supervisor_id: modalVinculo.value.supervisor_id || null,
    coordenador_id: modalVinculo.value.coordenador_id || null
  }).eq('id', modalVinculo.value.equipe.id)

  if (!error) {
    toast.fire({ icon: 'success', title: 'Vínculos atualizados!' })
    fecharModal()
    await fetchData()
  } else {
    toast.fire({ icon: 'error', title: 'Erro ao salvar', text: error.message })
  }
  loadingVinculo.value = false
}

const deletarUnidade = async (id) => {
  const confirmacao = await alerta.fire({
    title: 'Excluir Unidade?',
    html: 'As equipes vinculadas também serão removidas.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#e11d48',
    cancelButtonColor: '#94a3b8',
    confirmButtonText: 'Sim, excluir',
    cancelButtonText: 'Cancelar'
  })
  if (confirmacao.isConfirmed) {
    await supabase.from('unidades').delete().eq('id', id)
    await fetchData()
  }
}

const deletarEquipe = async (id) => {
  const confirmacao = await alerta.fire({
    title: 'Excluir Equipe?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#e11d48',
    cancelButtonColor: '#94a3b8',
    confirmButtonText: 'Sim, excluir',
    cancelButtonText: 'Cancelar'
  })
  if (confirmacao.isConfirmed) {
    await supabase.from('equipes').delete().eq('id', id)
    await fetchData()
  }
}

onMounted(fetchData)
</script>
