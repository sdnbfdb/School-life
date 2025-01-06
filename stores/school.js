import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api/config'

export const useSchoolStore = defineStore('school', () => {
  const schools = ref([])
  const loading = ref(false)
  const error = ref(null)

  // 获取学校列表
  const fetchSchools = async () => {
    try {
      loading.value = true
      error.value = null
      const response = await api.get('/schools')
      schools.value = response.data
    } catch (err) {
      console.error('Failed to fetch schools:', err)
      error.value = err.response?.data?.message || '获取学校列表失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  // 搜索学校
  const searchSchools = async ({ query = '', province = '', city = '', majorId = null }) => {
    try {
      loading.value = true
      error.value = null
      const params = new URLSearchParams()
      if (query) params.append('query', query)
      if (province) params.append('province', province)
      if (city) params.append('city', city)
      if (majorId) params.append('majorId', majorId)
      
      const response = await api.get('/schools/search?' + params.toString())
      return response.data
    } catch (err) {
      console.error('Failed to search schools:', err)
      error.value = err.response?.data?.message || '搜索学校失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  // 获取学校详情
  const getSchoolDetails = async (id) => {
    try {
      loading.value = true
      error.value = null
      const response = await api.get(`/schools/${id}`)
      return response.data
    } catch (err) {
      console.error('Failed to get school details:', err)
      error.value = err.response?.data?.message || '获取学校详情失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  // 获取专业分类
  const fetchMajorCategories = async () => {
    try {
      loading.value = true
      error.value = ''
      const response = await api.get('/api/major-categories')
      return response.data
    } catch (err) {
      console.error('Failed to fetch major categories:', err)
      error.value = '获取专业分类失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    schools,
    loading,
    error,
    fetchSchools,
    searchSchools,
    getSchoolDetails,
    fetchMajorCategories
  }
}) 