import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api/config'

export const useApplicationStore = defineStore('application', () => {
  const applications = ref([])
  const loading = ref(false)
  const error = ref('')

  // 获取申请列表
  const fetchApplications = async (filters = {}) => {
    try {
      loading.value = true
      const response = await api.get('/applications', { params: filters })
      applications.value = response.data
    } catch (err) {
      console.error('获取申请列表失败:', err)
      error.value = '获取申请列表失败'
    } finally {
      loading.value = false
    }
  }

  // 更新申请状态
  const updateStatus = async (applicationId, status) => {
    try {
      await api.put(`/applications/${applicationId}/status`, { status })
      const application = applications.value.find(a => a.id === applicationId)
      if (application) {
        application.status = status
      }
    } catch (err) {
      console.error('更新申请状态失败:', err)
      throw err
    }
  }

  // 添加面试评价
  const addInterviewFeedback = async (applicationId, feedback) => {
    try {
      await api.post(`/applications/${applicationId}/feedback`, feedback)
      const application = applications.value.find(a => a.id === applicationId)
      if (application) {
        application.feedback = feedback
      }
    } catch (err) {
      console.error('添加面试评价失败:', err)
      throw err
    }
  }

  return {
    applications,
    loading,
    error,
    fetchApplications,
    updateStatus,
    addInterviewFeedback
  }
}) 