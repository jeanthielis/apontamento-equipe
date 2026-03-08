<template>
  <div class="animate-fade-in max-w-6xl mx-auto space-y-6 pb-20">
    
    <div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-black text-slate-900">Controle de Acesso</h2>
        <p class="text-slate-500 text-sm font-medium">Gerencie usuários e níveis de permissão do sistema.</p>
      </div>
      <div class="flex gap-2">
        <button @click="abaAtiva = 'usuarios'" :class="abaAtiva === 'usuarios' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'" class="px-4 py-2 rounded-xl font-bold text-sm transition-all">Usuários</button>
        <button @click="abaAtiva = 'niveis'" :class="abaAtiva === 'niveis' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'" class="px-4 py-2 rounded-xl font-bold text-sm transition-all">Níveis de Acesso</button>
      </div>
    </div>

    <div v-if="abaAtiva === 'usuarios'" class="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
      <div class="p-6 border-b border-slate-100 flex justify-between items-center">
        <h3 class="font-bold text-slate-800">Funcionários com Acesso</h3>
        <button @click="abrirModalUsuario" class="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-800 transition-all">+ Novo Usuário</button>
      </div>
      
      <table class="w-full text-left">
        <thead class="bg-slate-50 text-[10px] uppercase tracking-widest font-black text-slate-400">
          <tr>
            <th class="p-4">Nome</th>
            <th class="p-4">Email</th>
            <th class="p-4">Nível</th>
            <th class="p-4 text-right">Ação</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-50">
          <tr v-for="u in usuarios" :key="u.id" class="text-sm">
            <td class="p-4 font-bold text-slate-700">{{ u.nome }}</td>
            <td class="p-4 text-slate-500">{{ u.email }}</td>
            <td class="p-4">
              <span class="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg font-bold text-[10px] uppercase">
                {{ u.niveis_acesso?.nome || 'Sem Nível' }}
              </span>
            </td>
            <td class="p-4 text-right">
              <button class="text-slate-400 hover:text-rose-500"><i class="fa-solid fa-trash"></i></button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="abaAtiva === 'niveis'" class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 h-fit">
        <h3 class="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wider">Cargos Criados</h3>
        <div class="space-y-2">
          <button v-for="n in niveis" :key="n.id" @click="selecionarNivel(n)" :class="nivelSelecionado?.id === n.id ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-slate-50 border-transparent text-slate-600'" class="w-full text-left p-3 rounded-xl border font-bold text-sm flex justify-between items-center">
            {{ n.nome }}
            <i class="fa-solid fa-chevron-right text-[10px]"></i>
          </button>
          <button @click="criarNovoNivel" class="w-full p-3 rounded-xl border border-dashed border-slate-300 text-slate-400 font-bold text-sm hover:bg-slate-50 transition-all">
            + Criar Novo Nível
          </button>
        </div>
      </div>

      <div v-if="nivelSelecionado" class="md:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
        <div class="flex justify-between items-center mb-6">
          <div>
            <h3 class="font-bold text-xl text-slate-800">{{ nivelSelecionado.nome }}</h3>
            <p class="text-sm text-slate-500">Marque o que este nível pode acessar no SafeTrack.</p>
          </div>
          <button @click="salvarPermissoes" class="bg-emerald-600 text-white px-6 py-2 rounded-xl font-bold shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all">Salvar Acessos</button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label v-for="modulo in modulosSistema" :key="modulo.slug" class="flex items-center p-4 rounded-2xl border cursor-pointer transition-all" :class="permissoesNivel.includes(modulo.slug) ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-slate-100 hover:bg-slate-50'">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center mr-4" :class="permissoesNivel.includes(modulo.slug) ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-400'">
              <i :class="modulo.icone"></i>
            </div>
            <div class="flex-1">
              <p class="font-bold text-sm" :class="permissoesNivel.includes(modulo.slug) ? 'text-indigo-900' : 'text-slate-700'">{{ modulo.nome }}</p>
              <p class="text-[10px] text-slate-400 uppercase font-black">{{ modulo.slug }}</p>
            </div>
            <input type="checkbox" :value="modulo.slug" v-model="permissoesNivel" class="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500">
          </label>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../lib/supabase'

const abaAtiva = ref('usuarios')
const usuarios = ref([])
const niveis = ref([])
const nivelSelecionado = ref(null)
const permissoesNivel = ref([])

// Definimos quais são as "chaves" de acesso do seu sistema
const modulosSistema = [
  { nome: 'Dashboard Gerencial', slug: 'home', icone: 'fa-solid fa-chart-line' },
  { nome: 'Aplicar DDS', slug: 'dds_aplicar', icone: 'fa-solid fa-bullhorn' },
  { nome: 'Histórico de DDS', slug: 'dds_historico', icone: 'fa-solid fa-clock-rotate-left' },
  { nome: 'Biblioteca de Temas', slug: 'dds_temas', icone: 'fa-solid fa-book-medical' },
  { nome: 'Diário de Bordo', slug: 'diario_bordo', icone: 'fa-solid fa-clipboard-user' },
  { nome: 'Configuração de Checklists', slug: 'checklists', icone: 'fa-solid fa-list-check' },
  { nome: 'Gestão de Funcionários', slug: 'funcionarios', icone: 'fa-solid fa-users-gear' },
  { nome: 'Super Admin: Acessos', slug: 'admin', icone: 'fa-solid fa-user-shield' }
]

const fetchData = async () => {
  const { data: users } = await supabase.from('usuarios').select('*, niveis_acesso(nome)')
  usuarios.value = users || []

  const { data: nvs } = await supabase.from('niveis_acesso').select('*').order('nome')
  niveis.value = nvs || []
}

const selecionarNivel = async (nivel) => {
  nivelSelecionado.value = nivel
  const { data: perms } = await supabase.from('permissoes_acesso').select('modulo_slug').eq('nivel_id', nivel.id)
  permissoesNivel.value = perms?.map(p => p.modulo_slug) || []
}

const salvarPermissoes = async () => {
  if (!nivelSelecionado.value) return
  
  // 1. Limpa as permissões antigas
  await supabase.from('permissoes_acesso').delete().eq('nivel_id', nivelSelecionado.value.id)

  // 2. Insere as novas
  const novasPerms = permissoesNivel.value.map(slug => ({
    nivel_id: nivelSelecionado.value.id,
    modulo_slug: slug
  }))

  const { error } = await supabase.from('permissoes_acesso').insert(novasPerms)
  if (!error) alert("Permissões de " + nivelSelecionado.value.nome + " atualizadas!")
}

const criarNovoNivel = async () => {
  const nome = prompt("Nome do novo nível de acesso:")
  if (nome) {
    const { data } = await supabase.from('niveis_acesso').insert([{ nome }]).select().single()
    if (data) {
      niveis.value.push(data)
      selecionarNivel(data)
    }
  }
}

onMounted(fetchData)
</script>