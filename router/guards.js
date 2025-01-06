import { useAuthStore } from '@/stores/auth'

/**
 * 设置路由守卫
 * @param {import('vue-router').Router} router - Vue Router 实例
 * @returns {Promise<void>}
 */
export async function setupAuthGuard(router) {
  let navigationInProgress = false

  router.beforeEach(async (to, from, next) => {
    if (navigationInProgress) {
      next(false)
      return
    }

    navigationInProgress = true
    const authStore = useAuthStore()

    try {
      if (authStore.token && !authStore.user) {
        try {
          await authStore.fetchUserInfo()
        } catch (error) {
          console.error('Failed to fetch user info:', error)
          authStore.logout()
          if (to.path !== '/auth/login') {
            navigationInProgress = false
            return next('/auth/login')
          }
        }
      }

      if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        navigationInProgress = false
        return next('/auth/login')
      }

      if (authStore.isAuthenticated && to.meta.guestOnly) {
        navigationInProgress = false
        return next('/')
      }

      navigationInProgress = false
      next()
    } catch (error) {
      console.error('Route guard error:', error)
      authStore.logout()
      navigationInProgress = false
      next('/auth/login')
    }
  })

  router.afterEach(() => {
    navigationInProgress = false
  })
} 