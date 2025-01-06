import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api/config'

export const useSearchStore = defineStore('search', () => {
  const loading = ref(false)
  const error = ref('')
  const results = ref([])
  const totalResults = ref(0)
  const pageSize = ref(20)
  const searchHistory = ref([])

  // 执行搜索
  const search = async (query, options = {}) => {
    try {
      loading.value = true
      const response = await api.get('/search', {
        params: {
          q: query,
          type: options.type || 'all',
          page: options.page || 1,
          limit: pageSize.value
        }
      })
      
      results.value = response.data.items
      totalResults.value = response.data.total

      // 添加到搜索历史
      if (!searchHistory.value.includes(query)) {
        searchHistory.value.unshift(query)
        if (searchHistory.value.length > 10) {
          searchHistory.value.pop()
        }
        // 保存到本地存储
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory.value))
      }
    } catch (err) {
      console.error('搜索失败:', err)
      error.value = '搜索失败'
    } finally {
      loading.value = false
    }
  }

  // 加载搜索历史
  const loadHistory = () => {
    const history = localStorage.getItem('searchHistory')
    if (history) {
      searchHistory.value = JSON.parse(history)
    }
  }

  // 清除搜索历史
  const clearHistory = () => {
    searchHistory.value = []
    localStorage.removeItem('searchHistory')
  }

  return {
    loading,
    error,
    results,
    totalResults,
    pageSize,
    searchHistory,
    search,
    loadHistory,
    clearHistory
  }
}) 