import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api/config'

export const useFileStore = defineStore('file', () => {
  const loading = ref(false)
  const error = ref('')
  const uploadProgress = ref(0)

  // 文件列表
  const files = ref([])
  const totalSize = ref(0)
  const usedSpace = ref(0)

  // 获取文件列表
  const fetchFiles = async (path = '/') => {
    try {
      loading.value = true
      const response = await api.get('/files', { params: { path } })
      files.value = response.data.items
      totalSize.value = response.data.total_size
      usedSpace.value = response.data.used_space
    } catch (err) {
      console.error('获取文件列表失败:', err)
      error.value = '获取文件失败'
    } finally {
      loading.value = false
    }
  }

  // 上传文件
  const uploadFile = async (file, path = '/') => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('path', path)

      const response = await api.post('/files/upload', formData, {
        onUploadProgress: (progressEvent) => {
          uploadProgress.value = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          )
        }
      })

      files.value.unshift(response.data)
      usedSpace.value += response.data.size
      return response.data
    } catch (err) {
      console.error('上传文件失败:', err)
      error.value = '上传失败'
      throw err
    } finally {
      uploadProgress.value = 0
    }
  }

  // 删除文件
  const deleteFile = async (fileId) => {
    try {
      loading.value = true
      await api.delete(`/files/${fileId}`)
      const file = files.value.find(f => f.id === fileId)
      if (file) {
        usedSpace.value -= file.size
      }
      files.value = files.value.filter(f => f.id !== fileId)
    } catch (err) {
      console.error('删除文件失败:', err)
      error.value = '删除失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  // 创建文件夹
  const createFolder = async (name, path = '/') => {
    try {
      loading.value = true
      const response = await api.post('/files/folders', { name, path })
      files.value.unshift(response.data)
      return response.data
    } catch (err) {
      console.error('创建文件夹失败:', err)
      error.value = '创建失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  // 重命名文件/文件夹
  const rename = async (fileId, newName) => {
    try {
      loading.value = true
      const response = await api.patch(`/files/${fileId}`, { name: newName })
      const index = files.value.findIndex(f => f.id === fileId)
      if (index !== -1) {
        files.value[index] = response.data
      }
      return response.data
    } catch (err) {
      console.error('重命名失败:', err)
      error.value = '重命名失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  // 移动文件/文件夹
  const move = async (fileId, newPath) => {
    try {
      loading.value = true
      const response = await api.patch(`/files/${fileId}/move`, { path: newPath })
      files.value = files.value.filter(f => f.id !== fileId)
      return response.data
    } catch (err) {
      console.error('移动失败:', err)
      error.value = '移动失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    files,
    totalSize,
    usedSpace,
    uploadProgress,
    fetchFiles,
    uploadFile,
    deleteFile,
    createFolder,
    rename,
    move
  }
}) 