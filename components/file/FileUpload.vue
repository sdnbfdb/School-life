<script setup>
import { ref } from 'vue'
import { useFileStore } from '@/stores/file'

const props = defineProps({
  path: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['upload-success'])
const fileStore = useFileStore()
const fileInput = ref(null)
const dragover = ref(false)

const openUploader = () => {
  fileInput.value.click()
}

const handleFiles = async (files) => {
  for (const file of files) {
    try {
      await fileStore.uploadFile(file, props.path)
    } catch (error) {
      console.error(error)
    }
  }
  emit('upload-success')
}

const handleFileSelect = (event) => {
  const files = event.target.files
  if (files.length > 0) {
    handleFiles(files)
  }
  event.target.value = null // 重置input以允许上传相同文件
}

const handleDrop = (event) => {
  event.preventDefault()
  dragover.value = false
  const files = event.dataTransfer.files
  if (files.length > 0) {
    handleFiles(files)
  }
}

const handleDragOver = (event) => {
  event.preventDefault()
  dragover.value = true
}

const handleDragLeave = () => {
  dragover.value = false
}

defineExpose({
  openUploader
})
</script>

<template>
  <div 
    class="file-upload"
    :class="{ dragover }"
    @drop="handleDrop"
    @dragover="handleDragOver"
    @dragleave="handleDragLeave"
  >
    <input
      ref="fileInput"
      type="file"
      multiple
      class="file-input"
      @change="handleFileSelect"
    >
    
    <div v-if="fileStore.uploadProgress > 0" class="upload-progress">
      <div class="progress-bar">
        <div 
          class="progress"
          :style="{ width: fileStore.uploadProgress + '%' }"
        ></div>
      </div>
      <span class="progress-text">{{ fileStore.uploadProgress }}%</span>
    </div>

    <div v-else class="upload-placeholder">
      <i class="icon-upload"></i>
      <p>拖拽文件到此处或点击上传</p>
    </div>
  </div>
</template>

<style scoped>
.file-upload {
  position: relative;
  border: 2px dashed #ddd;
  border-radius: 8px;
  padding: 40px;
  text-align: center;
  transition: all 0.3s ease;
}

.file-upload.dragover {
  border-color: #2196F3;
  background-color: #E3F2FD;
}

.file-input {
  display: none;
}

.upload-placeholder {
  color: #666;
}

.icon-upload {
  font-size: 48px;
  color: #999;
  margin-bottom: 10px;
}

.upload-progress {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.9);
}

.progress-bar {
  width: 80%;
  height: 4px;
  background-color: #f5f5f5;
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 10px;
}

.progress {
  height: 100%;
  background-color: #2196F3;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.9em;
  color: #666;
}
</style> 