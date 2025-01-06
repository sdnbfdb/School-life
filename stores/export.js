import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api/config'

export const useExportStore = defineStore('export', () => {
  const loading = ref(false)
  const progress = ref(0)
  const error = ref('')

  // 导出数据
  const exportData = async (options) => {
    try {
      loading.value = true
      progress.value = 0
      
      const response = await api.post('/export', options, {
        responseType: 'blob',
        onDownloadProgress: (progressEvent) => {
          progress.value = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          )
        }
      })

      // 创建下载链接
      const url = window.URL.createObjectURL(response.data)
      const link = document.createElement('a')
      link.href = url
      link.download = options.filename || 'export.xlsx'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

    } catch (err) {
      console.error('导出失败:', err)
      error.value = '导出失败'
      throw err
    } finally {
      loading.value = false
      progress.value = 0
    }
  }

  return {
    loading,
    progress,
    error,
    exportData
  }
}) 