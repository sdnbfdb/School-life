import { createRouter, createWebHistory } from 'vue-router'
import JobsView from '@/views/jobs/JobsView.vue'
import JobDetailView from '@/views/jobs/JobDetailView.vue'
import MarketplaceView from '@/views/marketplace/MarketplaceView.vue'
import SchoolsView from '@/views/schools/CompareView.vue'
import BottlesView from '@/views/bottles/BottlesView.vue'
import ProfileView from '@/views/profile/ProfileView.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/jobs'
    },
    {
      path: '/jobs',
      name: 'jobs',
      component: JobsView
    },
    {
      path: '/jobs/:id',
      name: 'job-detail',
      component: JobDetailView,
      props: true,
      beforeEnter: (to, from, next) => {
        const id = to.params.id
        if (!id || id === 'undefined') {
          next('/jobs')
        } else {
          next()
        }
      }
    },
    {
      path: '/marketplace',
      name: 'marketplace',
      component: MarketplaceView
    },
    {
      path: '/schools',
      name: 'schools',
      component: SchoolsView
    },
    {
      path: '/bottles',
      name: 'bottles',
      component: BottlesView
    },
    {
      path: '/bottles/new',
      name: 'new-bottle',
      component: () => import('@/views/bottles/NewBottleView.vue')
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'profile-overview',
          component: () => import('@/views/profile/OverviewView.vue')
        },
        {
          path: 'jobs',
          name: 'profile-jobs',
          component: () => import('@/views/profile/JobsView.vue')
        },
        {
          path: 'bottles',
          name: 'profile-bottles',
          component: () => import('@/views/profile/BottlesView.vue')
        },
        {
          path: 'settings',
          name: 'profile-settings',
          component: () => import('@/views/profile/SettingsView.vue')
        }
      ]
    },
    {
      path: '/auth',
      name: 'auth',
      component: () => import('@/views/auth/AuthView.vue'),
      children: [
        {
          path: 'login',
          name: 'login',
          component: () => import('@/views/auth/LoginView.vue')
        },
        {
          path: 'register',
          name: 'register',
          component: () => import('@/views/auth/RegisterView.vue')
        }
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // 需要认证的页面
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // 保存目标路由，登录后跳转
    authStore.setRedirectPath(to.fullPath)
    next('/auth/login')
  } else {
    next()
  }
})

router.onError((error) => {
  console.error('Router error:', error)
})

export default router
