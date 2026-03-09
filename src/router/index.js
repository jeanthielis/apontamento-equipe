import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../stores/auth'
import MainLayout from '../layouts/MainLayout.vue'
import HomeView from '../views/Home.vue' // ou o caminho onde você salvou o arquivo

const routes = [
  // 1. ROTA PÚBLICA: LOGIN
  {
    path: '/',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { requiresAuth: false }
  },
  
  // 2. ROTA PÚBLICA: CADASTRO (Agora ela está livre aqui fora!)
  {
    path: '/cadastro',
    name: 'Cadastro',
    component: () => import('../views/Cadastro.vue'),
    meta: { requiresAuth: false }
  },

  // 3. ÁREA RESTRITA (Requer Login)
  {
    path: '/',
    component: MainLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('../views/Dashboard.vue'),
        meta: { allowedRoles: ['gerente', 'supervisor', 'lider'] }
      },
      {
        path: 'funcionarios',
        name: 'Funcionarios',
        component: () => import('../views/Funcionarios.vue'),
        meta: { allowedRoles: ['gerente', 'supervisor'] }
      },
      {
        path: 'unidades',
        name: 'Unidades',
        component: () => import('../views/Unidades.vue'),
        meta: { allowedRoles: ['gerente', 'supervisor'] }
      },
      {
        path: 'admin',
        name: 'Admin',
        component: () => import('../views/Admin.vue'),
        meta: { allowedRoles: ['gerente', 'supervisor'] }
      },
        {
        path: '/home',
        name: 'home',
        component: HomeView,
        // Se você usa o Sidebar como "pai", coloque o Home dentro dele
      },
      {
        path: 'aplicacao-dds',
        name: 'Aplicação DDS',
        component: () => import('../views/AplicacaoDDS.vue'),
        meta: { allowedRoles: ['gerente', 'supervisor', 'lider'] } 
      },
      {
        path: 'historico-dds',
        name: 'Histórico DDS',
        component: () => import('../views/HistoricoDDS.vue'),
        meta: { allowedRoles: ['gerente', 'supervisor'] } 
      },
      {
        path: 'acompanhamento',
        name: 'Acompanhamento Diário',
        component: () => import('../views/AcompanhamentoDiario.vue'),
        meta: { allowedRoles: ['gerente', 'supervisor', 'lider'] }
      },
      {
        path: 'adminSuper',
        name: 'Gestão de Acessos',
        component: () => import('../views/GestaoAcesso.vue'),
        meta: { moduloSlug: 'admin' }
      },
      { 
        path: 'biblioteca-dds',
        name: 'Biblioteca DDS',
        component: () => import('../views/BibliotecaDDS.vue'),
        meta: { allowedRoles: ['gerente', 'supervisor'] }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guardião de Rotas
router.beforeEach(async (to, from) => {
  const authStore = useAuthStore()
  const { data: { session } } = await supabase.auth.getSession()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  // 1. Bloqueia acesso sem login
  if (requiresAuth && !session) {
    return { name: 'Login' }
  }

  // 2. Se logado, não deixa voltar pro Login nem pro Cadastro
  if (!requiresAuth && session && (to.name === 'Login' || to.name === 'Cadastro')) {
    return { name: 'Dashboard' }
  }

  // 3. Verificação de Permissões (Roles)
  if (requiresAuth && session) {
    if (!authStore.profile) {
      await authStore.fetchProfile(session.user)
    }

    const userRole = authStore.profile?.role
    if (to.meta.allowedRoles && !to.meta.allowedRoles.includes(userRole)) {
      return { name: 'Dashboard' }
    }
  }

  return true
})

export default router