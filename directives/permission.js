import { useAuthStore } from '@/stores/auth'

// 权限指令
export default {
  mounted(el, binding) {
    const authStore = useAuthStore()
    const { value } = binding

    if (value && !authStore.hasPermission(value)) {
      el.parentNode?.removeChild(el)
    }
  }
}

// 注册指令的辅助函数
export function setupPermission(app) {
  app.directive('permission', {
    mounted(el, binding) {
      const authStore = useAuthStore()
      const { value } = binding

      if (value && !authStore.hasPermission(value)) {
        el.parentNode?.removeChild(el)
      }
    }
  })
} 