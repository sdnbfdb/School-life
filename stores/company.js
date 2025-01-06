import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api/config'

export const useCompanyStore = defineStore('company', () => {
  const jobs = ref([])
  const applications = ref([])
  const statistics = ref(null)
  const loading = ref(false)
  const error = ref('')

  // 获取公司发布的职位列表
  const fetchJobs = async () => {
    try {
      loading.value = true
      const response = await api.get('/company/jobs')
      jobs.value = response.data
    } catch (error) {
      console.error('获取职位列表失败:', error)
      error.value = '获取职位列表失败'
    } finally {
      loading.value = false
    }
  }

  // 获取职位的申请列表
  const fetchApplications = async (jobId) => {
    try {
      loading.value = true
      const response = await api.get(`/company/jobs/${jobId}/applications`)
      applications.value = response.data
    } catch (error) {
      console.error('获取申请列表失败:', error)
      error.value = '获取申请列表失败'
    } finally {
      loading.value = false
    }
  }

  // 更新申请状态
  const updateApplicationStatus = async (applicationId, status, feedback = '') => {
    try {
      await api.patch(`/company/applications/${applicationId}`, {
        status,
        feedback
      })
      
      // 更新本地状态
      const application = applications.value.find(a => a.id === applicationId)
      if (application) {
        application.status = status
        application.feedback = feedback
      }
    } catch (error) {
      console.error('更新申请状态失败:', error)
      throw error
    }
  }

  // 获取统计数据
  const fetchStatistics = async () => {
    try {
      loading.value = true
      const response = await api.get('/company/statistics')
      statistics.value = response.data
    } catch (error) {
      console.error('获取统计数据失败:', error)
      error.value = '获取统计数据失败'
    } finally {
      loading.value = false
    }
  }

  return {
    jobs,
    applications,
    statistics,
    loading,
    error,
    fetchJobs,
    fetchApplications,
    updateApplicationStatus,
    fetchStatistics
  }
}) 