import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api/config'

export const useMonitorStore = defineStore('monitor', () => {
  const loading = ref(false)
  const error = ref('')

  // 系统性能指标
  const performance = ref({
    cpu: 0,
    memory: 0,
    disk: 0,
    network: {
      in: 0,
      out: 0
    }
  })

  // 错误日志
  const errorLogs = ref([])
  const totalErrors = ref(0)

  // 用户访问统计
  const userStats = ref({
    online: 0,
    today: 0,
    week: 0,
    month: 0
  })

  // API请求统计
  const apiStats = ref({
    total: 0,
    success: 0,
    failed: 0,
    avgTime: 0
  })

  // 获取系统性能指标
  const fetchPerformance = async () => {
    try {
      loading.value = true
      const response = await api.get('/monitor/performance')
      performance.value = response.data
    } catch (err) {
      console.error('获取性能指标失败:', err)
      error.value = '获取性能指标失败'
    } finally {
      loading.value = false
    }
  }

  // 获取错误日志
  const fetchErrorLogs = async (page = 1, limit = 20) => {
    try {
      loading.value = true
      const response = await api.get('/monitor/errors', {
        params: { page, limit }
      })
      errorLogs.value = response.data.items
      totalErrors.value = response.data.total
    } catch (err) {
      console.error('获取错误日志失败:', err)
      error.value = '获取错误日志失败'
    } finally {
      loading.value = false
    }
  }

  // 获取用户访问统计
  const fetchUserStats = async () => {
    try {
      loading.value = true
      const response = await api.get('/monitor/users')
      userStats.value = response.data
    } catch (err) {
      console.error('获取用户统计失败:', err)
      error.value = '获取用户统计失败'
    } finally {
      loading.value = false
    }
  }

  // 获取API请求统计
  const fetchApiStats = async () => {
    try {
      loading.value = true
      const response = await api.get('/monitor/api')
      apiStats.value = response.data
    } catch (err) {
      console.error('获取API统计失败:', err)
      error.value = '获取API统计失败'
    } finally {
      loading.value = false
    }
  }

  // 清除错误日志
  const clearErrorLogs = async () => {
    try {
      await api.delete('/monitor/errors')
      errorLogs.value = []
      totalErrors.value = 0
    } catch (err) {
      console.error('清除错误日志失败:', err)
      throw err
    }
  }

  return {
    loading,
    error,
    performance,
    errorLogs,
    totalErrors,
    userStats,
    apiStats,
    fetchPerformance,
    fetchErrorLogs,
    fetchUserStats,
    fetchApiStats,
    clearErrorLogs
  }
}) 