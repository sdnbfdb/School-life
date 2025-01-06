import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api/config'

export const useAnalyticsStore = defineStore('analytics', () => {
  const loading = ref(false)
  const error = ref('')
  
  // 职位数据
  const jobStats = ref({
    total: 0,
    active: 0,
    views: 0,
    applications: 0,
    byCategory: [],
    byLocation: [],
    trend: []
  })

  // 应聘数据
  const applicationStats = ref({
    total: 0,
    pending: 0,
    interviewing: 0,
    accepted: 0,
    rejected: 0,
    byJob: [],
    byDate: [],
    conversionRate: 0
  })

  // 用户行为数据
  const userStats = ref({
    activeUsers: 0,
    newUsers: 0,
    pageViews: 0,
    searchQueries: [],
    popularJobs: [],
    userActions: []
  })

  // 获取职位统计数据
  const fetchJobStats = async (filters = {}) => {
    try {
      loading.value = true
      const response = await api.get('/analytics/jobs', { params: filters })
      jobStats.value = response.data
    } catch (err) {
      console.error('获取职位统计失败:', err)
      error.value = '获取统计数据失败'
    } finally {
      loading.value = false
    }
  }

  // 获取应聘统计数据
  const fetchApplicationStats = async (filters = {}) => {
    try {
      loading.value = true
      const response = await api.get('/analytics/applications', { params: filters })
      applicationStats.value = response.data
    } catch (err) {
      console.error('获取应聘统计失败:', err)
      error.value = '获取统计数据失败'
    } finally {
      loading.value = false
    }
  }

  // 获取用户行为统计数据
  const fetchUserStats = async (filters = {}) => {
    try {
      loading.value = true
      const response = await api.get('/analytics/users', { params: filters })
      userStats.value = response.data
    } catch (err) {
      console.error('获取用户统计失败:', err)
      error.value = '获取统计数据失败'
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    jobStats,
    applicationStats,
    userStats,
    fetchJobStats,
    fetchApplicationStats,
    fetchUserStats
  }
}) 