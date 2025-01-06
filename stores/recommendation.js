import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api/config'

export const useRecommendationStore = defineStore('recommendation', () => {
  const recommendedJobs = ref([])
  const loading = ref(false)
  const error = ref('')

  // 获取推荐职位
  const fetchRecommendedJobs = async (userId) => {
    try {
      loading.value = true
      const response = await api.get(`/recommendations/jobs/${userId}`)
      recommendedJobs.value = response.data
    } catch (err) {
      console.error('获取推荐职位失败:', err)
      error.value = '获取推荐职位失败'
    } finally {
      loading.value = false
    }
  }

  // 更新用户偏好
  const updatePreferences = async (preferences) => {
    try {
      await api.put('/recommendations/preferences', preferences)
    } catch (err) {
      console.error('更新偏好失败:', err)
      throw err
    }
  }

  // 记录用户行为
  const trackUserAction = async (action) => {
    try {
      await api.post('/recommendations/track', action)
    } catch (err) {
      console.error('记录用户行为失败:', err)
    }
  }

  return {
    recommendedJobs,
    loading,
    error,
    fetchRecommendedJobs,
    updatePreferences,
    trackUserAction
  }
}) 