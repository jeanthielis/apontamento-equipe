<template>
  <div class="animate-fade-in max-w-7xl mx-auto space-y-8 pb-20">
    
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 class="text-3xl font-black text-slate-900 tracking-tight">Painel de Controle</h1>
        <p class="text-slate-500 font-medium">Olá, Supervisor. Aqui está o pulso da fábrica hoje.</p>
      </div>
      <div class="flex gap-2">
        <button @click="fetchDashboardData" class="p-3 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
          <i class="fa-solid fa-arrows-rotate" :class="{ 'fa-spin': loading }"></i>
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div class="flex justify-between items-start mb-4">
          <div class="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-xl">
            <i class="fa-solid fa-users-check"></i>
          </div>
          <span class="text-[10px] font-black uppercase tracking-widest text-slate-400">Hoje</span>
        </div>
        <p class="text-sm font-bold text-slate-500 uppercase tracking-wide">Adesão DDS</p>
        <div class="flex items-baseline gap-2">
          <h3 class="text-3xl font-black text-slate-900">{{ stats.totalAssinaturasDds }}</h3>
          <span class="text-xs font-bold text-slate-400">colaboradores</span>
        </div>
      </div>

      <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div class="flex justify-between items-start mb-4">
          <div class="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-xl">
            <i class="fa-solid fa-gauge-high"></i>
          </div>
          <span :class="stats.indiceConformidade >= 90 ? 'text-emerald-500' : 'text-amber-500'" class="text-xs font-black tracking-widest">
            {{ stats.indiceConformidade >= 90 ? 'EXCELENTE' : 'ATENÇÃO' }}
          </span>
        </div>
        <p class="text-sm font-bold text-slate-500 uppercase tracking-wide">Conformidade Geral</p>
        <h3 class="text-3xl font-black text-slate-900">{{ stats.indiceConformidade }}%</h3>
      </div>

      <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div class="flex justify-between items-start mb-4">
          <div class="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center text-xl">
            <i class="fa-solid fa-trowel-bricks"></i>
          </div>
        </div>
        <p class="text-sm font-bold text-slate-500 uppercase tracking-wide">Equipes em Campo</p>
        <h3 class="text-3xl font-black text-slate-900">{{ stats.totalEquipes }}</h3>
      </div>

      <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div class="flex justify-between items-start mb-4">
          <div class="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center text-xl">
            <i class="fa-solid fa-circle-exclamation"></i>
          </div>
        </div>
        <p class="text-sm font-bold text-slate-500 uppercase tracking-wide">Não Conformidades</p>
        <h3 class="text-3xl font-black text-rose-600">{{ stats.totalNC }}</h3>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      <div class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <h3 class="font-bold text-slate-800 mb-6 flex items-center">
          <i class="fa-solid fa-chart-pie mr-2 text-indigo-500"></i> Saúde do Processo (C/CP/NC)
        </h3>
        <apexchart type="donut" height="300" :options="chartOptionsDonut" :series="seriesDonut"></apexchart>
      </div>

      <div class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <h3 class="font-bold text-slate-800 mb-6 flex items-center">
          <i class="fa-solid fa-chart-bar mr-2 text-rose-500"></i> Pareto: Top 5 Não Conformidades
        </h3>
        <apexchart type="bar" height="300" :options="chartOptionsBar" :series="seriesBar"></apexchart>
      </div>
      
    </div>

    <div class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
      <h3 class="font-bold text-slate-800 mb-6">Últimos DDS Aplicados</h3>
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
              <th class="pb-4">Tema</th>
              <th class="pb-4">Data/Hora</th>
              <th class="pb-4">Participantes</th>
              <th class="pb-4 text-right">Ação</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            <tr v-for="dds in ultimosDds" :key="dds.id" class="group">
              <td class="py-4 font-bold text-slate-700">{{ dds.dds_temas?.titulo }}</td>
              <td class="py-4 text-sm text-slate-500">{{ formatarData(dds.data_aplicacao) }}</td>
              <td class="py-4">
                <span class="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold">
                  {{ dds.dds_assinaturas?.length }} assinaram
                </span>
              </td>
              <td class="py-4 text-right">
                <router-link to="/historico-dds" class="text-slate-400 hover:text-indigo-600 transition-colors">
                  <i class="fa-solid fa-arrow-up-right-from-square"></i>
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../lib/supabase'
import VueApexCharts from 'vue3-apexcharts'

const apexchart = VueApexCharts
const loading = ref(false)

// Estados dos Dados
const stats = ref({
  totalAssinaturasDds: 0,
  indiceConformidade: 0,
  totalEquipes: 0,
  totalNC: 0
})

const seriesDonut = ref([0, 0, 0]) // C, CP, NC
const seriesBar = ref([{ name: 'Ocorrências', data: [] }])
const ultimosDds = ref([])

// Configurações dos Gráficos
const chartOptionsDonut = ref({
  labels: ['Conforme', 'Conf. Parcial', 'Não Conforme'],
  colors: ['#10b981', '#f59e0b', '#f43f5e'],
  legend: { position: 'bottom', fontWeight: 'bold' },
  plotOptions: { pie: { donut: { size: '70%' } } }
})

const chartOptionsBar = ref({
  chart: { toolbar: { show: false } },
  colors: ['#f43f5e'],
  plotOptions: { bar: { borderRadius: 8, horizontal: true } },
  xaxis: { categories: [] },
  dataLabels: { enabled: true }
})

// Mágica: Busca os dados de todas as tabelas
const fetchDashboardData = async () => {
  loading.value = true
  const hoje = new Date().toISOString().split('T')[0]

  try {
    // 1. Total de Equipes
    const { count: countEq } = await supabase.from('equipes').select('*', { count: 'exact', head: true })
    stats.value.totalEquipes = countEq || 0

    // 2. Participação DDS Hoje
    const { data: ddsHoje } = await supabase
      .from('dds_assinaturas')
      .select('id')
      .gte('assinado_em', hoje)
    stats.value.totalAssinaturasDds = ddsHoje?.length || 0

    // 3. Distribuição de Conformidade (Diário de Bordo)
    const { data: avaliacoes } = await supabase
      .from('diario_avaliacoes')
      .select('status, quesito_id, itens_checklist(descricao)')

    if (avaliacoes) {
      const counts = { C: 0, CP: 0, NC: 0 }
      const pareto = {}

      avaliacoes.forEach(a => {
        counts[a.status]++
        if (a.status === 'NC' || a.status === 'CP') {
          const nomeItem = a.itens_checklist?.descricao || 'Desconhecido'
          pareto[nomeItem] = (pareto[nomeItem] || 0) + 1
        }
      })

      // Atualiza Donut
      seriesDonut.value = [counts.C, counts.CP, counts.NC]
      
      // Calcula Índice de Conformidade (C / Total)
      const total = counts.C + counts.CP + counts.NC
      stats.value.indiceConformidade = total > 0 ? Math.round((counts.C / total) * 100) : 0
      stats.value.totalNC = counts.NC

      // Atualiza Pareto (Top 5)
      const sortedPareto = Object.entries(pareto)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
      
      seriesBar.value = [{ name: 'Desvios', data: sortedPareto.map(i => i[1]) }]
      chartOptionsBar.value = { ...chartOptionsBar.value, xaxis: { categories: sortedPareto.map(i => i[0]) } }
    }

    // 4. Últimos DDS
    const { data: ddsLista } = await supabase
      .from('dds_aplicacoes')
      .select('id, data_aplicacao, dds_temas(titulo), dds_assinaturas(id)')
      .order('data_aplicacao', { ascending: false })
      .limit(5)
    ultimosDds.value = ddsLista || []

  } catch (error) {
    console.error("Erro no Dashboard:", error)
  } finally {
    loading.value = false
  }
}

const formatarData = (d) => new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })

onMounted(fetchDashboardData)
</script>