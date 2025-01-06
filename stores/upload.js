import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api/config'

export const useUploadStore = defineStore('upload', () => {
  const uploading = ref(false)
  const progress = ref(0)
  const error = ref('')

  const uploadFile = async (file, type = 'common') => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)

    try {
      uploading.value = true
      progress.value = 0
      error.value = ''

      const response = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          progress.value = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          )
        }
      })

      return response.data.url
    } catch (err) {
      error.value = '文件上传失败：' + err.message
      throw err
    } finally {
      uploading.value = false
      progress.value = 0
    }
  }

  const uploadImage = async (file) => {
    return uploadFile(file, 'image')
  }

  const uploadResume = async (file) => {
    return uploadFile(file, 'resume')
  }

  return {
    uploading,
    progress,
    error,
    uploadFile,
    uploadImage,
    uploadResume
  }
}) 