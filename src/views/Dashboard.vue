<template>
  <div class="animate-fade-in">
    <div class="mb-8">
      <h2 class="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">Visão Geral</h2>
      <p class="text-slate-500 mt-1 text-sm sm:text-base">Acompanhe suas rotinas e indicadores do turno atual.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer group">
        <div class="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform">
          <i class="fa-solid fa-users-viewfinder"></i>
        </div>
        <h3 class="text-lg font-bold text-slate-800 mb-1">Aplicar DDS</h3>
        <p class="text-sm text-slate-500">Realize o Diálogo de Segurança diário e colete as assinaturas da equipe.</p>
      </div>

      <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer group">
        <div class="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform">
          <i class="fa-solid fa-clipboard-check"></i>
        </div>
        <h3 class="text-lg font-bold text-slate-800 mb-1">Novo Apontamento</h3>
        <p class="text-sm text-slate-500">Avalie os colaboradores do seu turno com base no checklist vigente.</p>
      </div>

      <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-indigo-500 hover:shadow-md transition-all cursor-pointer group">
        <div class="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform">
          <i class="fa-solid fa-chart-simple"></i>
        </div>
        <h3 class="text-lg font-bold text-slate-800 mb-1">Meu Histórico</h3>
        <p class="text-sm text-slate-500">Visualize os formulários enviados e indicadores de conformidade.</p>
      </div>

    </div>

    <div class="bg-slate-100/50 border border-slate-200 border-dashed rounded-2xl p-12 text-center">
      <div class="text-slate-400 mb-3"><i class="fa-solid fa-chart-line text-3xl"></i></div>
      <h4 class="text-slate-600 font-bold mb-1">Painel de Indicadores</h4>
      <p class="text-sm text-slate-400">Os gráficos de performance aparecerão aqui conforme os dados forem inseridos.</p>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>