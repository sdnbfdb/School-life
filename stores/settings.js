import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api/config'

export const useSettingsStore = defineStore('settings', () => {
  const settings = ref({
    theme: 'light',
    language: 'zh-CN',
    notifications: {
      email: true,
      push: true
    },
    display: {
      compactMode: false,
      showAvatars: true
    }
  })
  const loading = ref(false)
  const error = ref('')

  // 获取设置
  const fetchSettings = async () => {
    try {
      loading.value = true
      error.value = ''
      const response = await api.get('/api/settings')
      settings.value = response.data
    } catch (err) {
      console.error('获取设置失败:', err)
      error.value = '获取设置失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  // 更新设置
  const updateSettings = async (newSettings) => {
    try {
      loading.value = true
      error.value = ''
      const response = await api.put('/api/settings', newSettings)
      settings.value = response.data
    } catch (err) {
      console.error('更新设置失败:', err)
      error.value = '更新设置失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    settings,
    loading,
    error,
    fetchSettings,
    updateSettings
  }
}) 