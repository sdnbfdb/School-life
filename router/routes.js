import { useAuthStore } from '@/stores/auth'

export const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: {
      guest: true
    }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/RegisterView.vue'),
    meta: {
      guest: true
    }
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('@/views/SearchView.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/ProfileView.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/notifications',
    name: 'notifications',
    component: () => import('@/views/NotificationsView.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/chat',
    name: 'chat',
    component: () => import('@/views/ChatView.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/files',
    name: 'files',
    component: () => import('@/views/FileManagerView.vue'),
    meta: {
      requiresAuth: true
    }
  },
  // 管理员路由
  {
    path: '/admin',
    component: () => import('@/views/admin/AdminLayout.vue'),
    meta: {
      requiresAuth: true,
      permission: 'system:access'
    },
    children: [
      {
        path: '',
        name: 'admin-dashboard',
        component: () => import('@/views/admin/DashboardView.vue')
      },
      {
        path: 'users',
        name: 'admin-users',
        component: () => import('@/views/admin/UsersView.vue'),
        meta: {
          permission: 'user:manage'
        }
      },
      {
        path: 'permissions',
        name: 'admin-permissions',
        component: () => import('@/views/admin/PermissionsView.vue'),
        meta: {
          permission: 'system:manage'
        }
      },
      {
        path: 'monitor',
        name: 'admin-monitor',
        component: () => import('@/views/admin/MonitorView.vue'),
        meta: {
          permission: 'system:monitor'
        }
      }
    ]
  },
  // 企业用户路由
  {
    path: '/company',
    component: () => import('@/views/company/CompanyLayout.vue'),
    meta: {
      requiresAuth: true,
      permission: 'company:access'
    },
    children: [
      {
        path: '',
        name: 'company-dashboard',
        component: () => import('@/views/company/DashboardView.vue')
      },
      {
        path: 'jobs',
        name: 'company-jobs',
        component: () => import('@/views/company/JobsView.vue')
      },
      {
        path: 'applications',
        name: 'company-applications',
        component: () => import('@/views/company/ApplicationsView.vue')
      },
      {
        path: 'profile',
        name: 'company-profile',
        component: () => import('@/views/company/ProfileView.vue')
      }
    ]
  },
  // 求职者路由
  {
    path: '/jobs',
    component: () => import('@/views/jobs/JobsLayout.vue'),
    children: [
      {
        path: '',
        name: 'jobs-list',
        component: () => import('@/views/jobs/JobListView.vue')
      },
      {
        path: ':id',
        name: 'job-detail',
        component: () => import('@/views/jobs/JobDetailView.vue')
      },
      {
        path: 'applications',
        name: 'my-applications',
        component: () => import('@/views/jobs/MyApplicationsView.vue'),
        meta: {
          requiresAuth: true
        }
      }
    ]
  },
  // 错误页面
  {
    path: '/403',
    name: 'forbidden',
    component: () => import('@/views/error/403.vue')
  },
  {
    path: '/404',
    name: 'not-found',
    component: () => import('@/views/error/404.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404'
  }
]

// 路由守卫
export function setupRouteGuards(router) {
  router.beforeEach((to, from, next) => {
    const authStore = useAuthStore()
    
    // 检查是否需要登录
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
      next({ name: 'login', query: { redirect: to.fullPath } })
      return
    }

    // 检查是否是游客专属页面
    if (to.meta.guest && authStore.isAuthenticated) {
      next({ name: 'home' })
      return
    }

    // 检查权限
    if (to.meta.permission && !authStore.hasPermission(to.meta.permission)) {
      next({ name: 'forbidden' })
      return
    }

    next()
  })
} 