import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../stores/auth'
import MainLayout from '../layouts/MainLayout.vue'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { requiresAuth: false }
  },
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
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guardião de Rotas (Padrão Vue 3)
router.beforeEach(async (to, from) => {
  const authStore = useAuthStore()
  const { data: { session } } = await supabase.auth.getSession()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  // 1. Bloqueia acesso sem login
  if (requiresAuth && !session) {
    return { name: 'Login' }
  }

  // 2. Se logado, não deixa voltar pro Login
  if (!requiresAuth && session && to.name === 'Login') {
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