import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api/config'

export const useJobStore = defineStore('job', () => {
  const jobs = ref([])
  const loading = ref(false)
  const error = ref(null)

  // 获取职位列表
  const fetchJobs = async (params = {}) => {
    try {
      loading.value = true
      error.value = ''
      const response = await api.get('/api/jobs', { params })
      jobs.value = response.data
    } catch (err) {
      console.error('获取职位列表失败:', err)
      error.value = '获取职位列表失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  // 获取单个职位详情
  const fetchJobById = async (id) => {
    try {
      loading.value = true
      error.value = null
      const response = await api.get(`/jobs/${id}`)
      return response.data
    } catch (err) {
      console.error('获取职位详情失败:', err)
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // 创建新职位
  const createJob = async (jobData) => {
    try {
      loading.value = true
      error.value = null
      const response = await api.post('/jobs', jobData)
      jobs.value.unshift(response.data)
      return response.data
    } catch (err) {
      console.error('创建职位失败:', err)
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // 获取工作详情
  const getJobDetails = async (id) => {
    try {
      loading.value = true
      error.value = null
      const response = await api.get(`/jobs/${id}`)
      return response.data
    } catch (err) {
      console.error('Failed to get job details:', err)
      error.value = err.response?.data?.message || '获取工作详情失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  // 申请工作
  const applyJob = async (id) => {
    try {
      loading.value = true
      error.value = null
      await api.post(`/jobs/${id}/apply`)
    } catch (err) {
      console.error('Failed to apply job:', err)
      error.value = err.response?.data?.message || '申请工作失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  // 删除工作
  const deleteJob = async (id) => {
    try {
      loading.value = true
      error.value = null
      await api.delete(`/jobs/${id}`)
    } catch (err) {
      console.error('Failed to delete job:', err)
      error.value = err.response?.data?.message || '删除工作失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    jobs,
    loading,
    error,
    fetchJobs,
    fetchJobById,
    createJob,
    getJobDetails,
    applyJob,
    deleteJob
  }
}) 