import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api/config'

export const useSchoolsStore = defineStore('schools', () => {
  const schools = ref([])
  const selectedSchools = ref([])
  const loading = ref(false)
  const error = ref('')

  const filters = ref({
    province: '',
    type: 'all',
    keyword: '',
    sort: 'rank'
  })

  const fetchSchools = async () => {
    try {
      loading.value = true
      const response = await api.get('/schools', { params: filters.value })
      schools.value = response.data
    } catch (error) {
      console.error('获取学校列表失败:', error)
      error.value = '获取学校列表失败'
    } finally {
      loading.value = false
    }
  }

  const addToCompare = (school) => {
    if (selectedSchools.value.length >= 3) {
      throw new Error('最多只能对比3所学校')
    }
    if (!selectedSchools.value.find(s => s.id === school.id)) {
      selectedSchools.value.push(school)
    }
  }

  const removeFromCompare = (schoolId) => {
    selectedSchools.value = selectedSchools.value.filter(s => s.id !== schoolId)
  }

  const clearCompare = () => {
    selectedSchools.value = []
  }

  return {
    schools,
    selectedSchools,
    loading,
    error,
    filters,
    fetchSchools,
    addToCompare,
    removeFromCompare,
    clearCompare
  }
}) 