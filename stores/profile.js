import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api/config'

export const useProfileStore = defineStore('profile', () => {
  const stats = ref({
    listings: 0,
    jobs: 0,
    bottles: 0,
    applications: 0,
    lastActive: null
  })
  const loading = ref(false)
  const error = ref('')

  // 获取用户统计信息
  const fetchStats = async () => {
    try {
      loading.value = true
      error.value = ''
      const response = await api.get('/api/profile/stats')
      stats.value = response.data
    } catch (err) {
      console.error('Failed to fetch stats:', err)
      error.value = '获取统计信息失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    stats,
    loading,
    error,
    fetchStats
  }
}) 