<template>
  <div class="animate-fade-in max-w-6xl mx-auto space-y-6 pb-20">
    
    <div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h2 class="text-2xl font-black text-slate-900">Controle de Acesso</h2>
        <p class="text-slate-500 text-sm font-medium">Gerencie usuários e níveis de permissão do sistema.</p>
      </div>
      <div class="flex gap-2 w-full md:w-auto">
        <button @click="abaAtiva = 'usuarios'" :class="abaAtiva === 'usuarios' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'" class="flex-1 md:flex-none px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm">Usuários</button>
        <button @click="abaAtiva = 'niveis'" :class="abaAtiva === 'niveis' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'" class="flex-1 md:flex-none px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm">Cargos e Permissões</button>
      </div>
    </div>

    <div v-if="abaAtiva === 'usuarios'" class="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
      <div class="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
        <div>
          <h3 class="font-bold text-slate-800">Equipe Autenticada</h3>
          <p class="text-[11px] text-slate-500 mt-0.5">Clique na etiqueta para definir ou alterar o nível de acesso do colaborador.</p>
        </div>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead class="bg-white text-[10px] uppercase tracking-widest font-black text-slate-400 border-b border-slate-100">
            <tr>
              <th class="p-4">Usuário</th>
              <th class="p-4">Email</th>
              <th class="p-4 text-center">Nível de Acesso</th>
              <th class="p-4 text-right">Ação</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            <tr v-for="u in usuarios" :key="u.id" class="text-sm hover:bg-slate-50/50 transition-colors">
              <td class="p-4 font-bold text-slate-700 flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">{{ u.nome?.charAt(0) || 'U' }}</div>
                {{ u.nome }}
              </td>
              <td class="p-4 text-slate-500 font-mono text-xs">{{ u.email }}</td>
              
              <td class="p-4 text-center">
                <button @click="alterarNivelUsuario(u)" class="px-3 py-1.5 rounded-lg font-bold text-[10px] uppercase transition-colors border shadow-sm w-full max-w-[160px] truncate"
                  :class="u.niveis_acesso?.nome ? 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100' : 'bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100 animate-pulse'">
                  <i class="fa-solid" :class="u.niveis_acesso?.nome ? 'fa-shield-halved mr-1' : 'fa-lock mr-1'"></i>
                  {{ u.niveis_acesso?.nome || '⚠️ Aguardando Liberação' }}
                </button>
              </td>
              
              <td class="p-4 text-right">
                <button @click="excluirUsuario(u)" class="w-8 h-8 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-colors" title="Revogar Acesso">
                  <i class="fa-solid fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="abaAtiva === 'niveis'" class="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 h-fit">
        <h3 class="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wider">Cargos Criados</h3>
        <div class="space-y-2">
          <button v-for="n in niveis" :key="n.id" @click="selecionarNivel(n)" :class="nivelSelecionado?.id === n.id ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-slate-50 border-transparent text-slate-600 hover:bg-slate-100'" class="w-full text-left p-3 rounded-xl border font-bold text-sm flex justify-between items-center transition-all">
            {{ n.nome }}
            <i class="fa-solid fa-chevron-right text-[10px]"></i>
          </button>
          <button @click="criarNovoNivel" class="w-full p-3 rounded-xl border border-dashed border-slate-300 text-slate-400 font-bold text-sm hover:bg-slate-50 hover:text-slate-600 transition-all mt-4">
            <i class="fa-solid fa-plus mr-1"></i> Criar Novo Cargo
          </button>
        </div>
      </div>

      <div v-if="nivelSelecionado" class="md:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h3 class="font-black text-2xl text-slate-800">{{ nivelSelecionado.nome }}</h3>
            <p class="text-sm text-slate-500">Marque os módulos que este cargo pode acessar.</p>
          </div>
          <button @click="salvarPermissoes" class="w-full md:w-auto bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all">
            <i class="fa-solid fa-floppy-disk mr-2"></i> Salvar Acessos
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label v-for="modulo in modulosSistema" :key="modulo.slug" class="flex items-center p-4 rounded-2xl border cursor-pointer transition-all" :class="permissoesNivel.includes(modulo.slug) ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-slate-100 hover:bg-slate-50'">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center mr-4" :class="permissoesNivel.includes(modulo.slug) ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/30' : 'bg-slate-100 text-slate-400'">
              <i :class="modulo.icone"></i>
            </div>
            <div class="flex-1">
              <p class="font-bold text-sm" :class="permissoesNivel.includes(modulo.slug) ? 'text-indigo-900' : 'text-slate-700'">{{ modulo.nome }}</p>
              <p class="text-[10px] text-slate-400 uppercase font-black tracking-wider">{{ modulo.slug }}</p>
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
import { toast, alerta, traduzirErro } from '../lib/alerts'

const abaAtiva = ref('usuarios')
const usuarios = ref([])
const niveis = ref([])
const nivelSelecionado = ref(null)
const permissoesNivel = ref([])

const modulosSistema = [
  { nome: 'Dashboard Gerencial', slug: 'home', icone: 'fa-solid fa-chart-line' },
  { nome: 'Aplicar DDS', slug: 'dds_aplicar', icone: 'fa-solid fa-bullhorn' },
  { nome: 'Histórico de DDS', slug: 'dds_historico', icone: 'fa-solid fa-clock-rotate-left' },
  { nome: 'Biblioteca de Temas', slug: 'dds_temas', icone: 'fa-solid fa-book-medical' },
  { nome: 'Diário de Bordo', slug: 'diario_bordo', icone: 'fa-solid fa-clipboard-user' },
  { nome: 'Configuração de Checklists', slug: 'checklists', icone: 'fa-solid fa-list-check' },
  { nome: 'Gestão de Efetivo', slug: 'funcionarios', icone: 'fa-solid fa-users-gear' },
  { nome: 'Super Admin: Acessos', slug: 'admin', icone: 'fa-solid fa-user-shield' }
]

const fetchData = async () => {
  const { data: users } = await supabase.from('usuarios').select('*, niveis_acesso(nome)').order('nome')
  usuarios.value = users || []

  const { data: nvs } = await supabase.from('niveis_acesso').select('*').order('nome')
  niveis.value = nvs || []
}

// ==== GESTÃO DE USUÁRIOS (A MÁGICA ACONTECE AQUI) ====

const alterarNivelUsuario = async (usuario) => {
  // Transforma nosso array de níveis em um objeto pro SweetAlert ler
  const opcoesDeNivel = { "": "Remover Acesso (Sem Nível)" }
  niveis.value.forEach(n => { opcoesDeNivel[n.id] = n.nome })

  const { value: nivelEscolhido, isConfirmed } = await alerta.fire({
    title: 'Definir Nível de Acesso',
    html: `Qual será o cargo de permissão de <b>${usuario.nome}</b>?`,
    input: 'select',
    inputOptions: opcoesDeNivel,
    inputValue: usuario.nivel_id || "", // Já vem pré-selecionado o atual
    showCancelButton: true,
    confirmButtonText: 'Salvar Acesso',
    cancelButtonText: 'Cancelar'
  })

  // Se ele confirmou a tela do SweetAlert
  if (isConfirmed) {
    const idParaSalvar = nivelEscolhido === "" ? null : nivelEscolhido
    
    const { error } = await supabase.from('usuarios').update({ nivel_id: idParaSalvar }).eq('id', usuario.id)
    
    if (!error) {
      toast.fire({ icon: 'success', title: 'Acesso atualizado com sucesso!' })
      await fetchData()
    } else {
      toast.fire({ icon: 'error', title: 'Erro', text: traduzirErro(error) })
    }
  }
}

const excluirUsuario = async (usuario) => {
  const confirmacao = await alerta.fire({
    title: 'Revogar Acesso?',
    html: `Deseja remover <b>${usuario.nome}</b> do sistema?<br><br><span class="text-sm text-slate-500">Ele perderá o acesso imediatamente.</span>`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#e11d48',
    cancelButtonColor: '#94a3b8',
    confirmButtonText: '<i class="fa-solid fa-trash mr-2"></i> Sim, remover',
    cancelButtonText: 'Cancelar'
  })

  if (confirmacao.isConfirmed) {
    // Apaga os dados públicos do usuário
    const { error } = await supabase.from('usuarios').delete().eq('id', usuario.id)
    if (!error) {
      toast.fire({ icon: 'success', title: 'Usuário removido!' })
      await fetchData()
    } else {
      toast.fire({ icon: 'error', title: 'Erro', text: traduzirErro(error) })
    }
  }
}


// ==== GESTÃO DE NÍVEIS E PERMISSÕES ====

const selecionarNivel = async (nivel) => {
  nivelSelecionado.value = nivel
  const { data: perms } = await supabase.from('permissoes_acesso').select('modulo_slug').eq('nivel_id', nivel.id)
  permissoesNivel.value = perms?.map(p => p.modulo_slug) || []
}

const salvarPermissoes = async () => {
  if (!nivelSelecionado.value) return
  
  await supabase.from('permissoes_acesso').delete().eq('nivel_id', nivelSelecionado.value.id)

  const novasPerms = permissoesNivel.value.map(slug => ({
    nivel_id: nivelSelecionado.value.id,
    modulo_slug: slug
  }))

  const { error } = await supabase.from('permissoes_acesso').insert(novasPerms)
  
  if (!error) {
    toast.fire({ icon: 'success', title: `Permissões salvas para ${nivelSelecionado.value.nome}!` })
  } else {
    toast.fire({ icon: 'error', title: 'Erro', text: traduzirErro(error) })
  }
}

const criarNovoNivel = async () => {
  const { value: nome } = await alerta.fire({
    title: 'Criar Novo Cargo',
    input: 'text',
    inputLabel: 'Nome do Nível (Ex: Gerente de Produção, Inspetor)',
    showCancelButton: true,
    confirmButtonText: 'Criar Cargo',
    cancelButtonText: 'Cancelar'
  })

  if (nome) {
    const { data, error } = await supabase.from('niveis_acesso').insert([{ nome }]).select().single()
    if (data) {
      niveis.value.push(data)
      selecionarNivel(data)
      toast.fire({ icon: 'success', title: 'Cargo criado com sucesso!' })
    } else {
      toast.fire({ icon: 'error', title: 'Erro ao criar', text: traduzirErro(error) })
    }
  }
}

onMounted(fetchData)
</script>