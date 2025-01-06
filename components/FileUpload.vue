<script setup>
import { ref } from 'vue'
import { useUploadStore } from '@/stores/upload'

const props = defineProps({
  accept: {
    type: String,
    default: '*/*'
  },
  maxSize: {
    type: Number,
    default: 10 * 1024 * 1024 // 10MB
  },
  type: {
    type: String,
    default: 'common'
  }
})

const emit = defineEmits(['success', 'error'])
const uploadStore = useUploadStore()
const fileInput = ref(null)

const handleFileSelect = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  // 检查文件大小
  if (file.size > props.maxSize) {
    emit('error', `文件大小不能超过${props.maxSize / 1024 / 1024}MB`)
    return
  }

  try {
    const url = await uploadStore.uploadFile(file, props.type)
    emit('success', url)
  } catch (error) {
    emit('error', error.message)
  } finally {
    // 清空input，允许上传相同文件
    fileInput.value.value = ''
  }
}

const triggerFileSelect = () => {
  fileInput.value.click()
}
</script>

<template>
  <div class="file-upload">
    <input
      ref="fileInput"
      type="file"
      :accept="accept"
      class="file-input"
      @change="handleFileSelect"
    >
    
    <div 
      class="upload-trigger"
      :class="{ disabled: uploadStore.uploading }"
      @click="triggerFileSelect"
    >
      <slot name="trigger">
        <button class="upload-btn" :disabled="uploadStore.uploading">
          <i class="icon-upload"></i>
          {{ uploadStore.uploading ? '上传中...' : '选择文件' }}
        </button>
      </slot>
    </div>

    <div v-if="uploadStore.uploading" class="progress-bar">
      <div 
        class="progress"
        :style="{ width: uploadStore.progress + '%' }"
      ></div>
      <span class="progress-text">{{ uploadStore.progress }}%</span>
    </div>

    <div v-if="uploadStore.error" class="error-message">
      {{ uploadStore.error }}
    </div>
  </div>
</template>

<style scoped>
.file-upload {
  display: inline-block;
}

.file-input {
  display: none;
}

.upload-trigger {
  display: inline-block;
  cursor: pointer;
}

.upload-trigger.disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.upload-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: #2196F3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.upload-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.progress-bar {
  margin-top: 10px;
  height: 4px;
  background-color: #f5f5f5;
  border-radius: 2px;
  overflow: hidden;
  position: relative;
}

.progress {
  height: 100%;
  background-color: #2196F3;
  transition: width 0.3s ease;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 12px;
  color: #666;
}

.error-message {
  margin-top: 10px;
  color: #f44336;
  font-size: 0.9em;
}
</style> 