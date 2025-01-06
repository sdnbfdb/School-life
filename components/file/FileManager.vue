<script setup>
import { ref, onMounted } from 'vue'
import { useFileStore } from '@/stores/file'
import FileList from './FileList.vue'
import FileUpload from './FileUpload.vue'
import FolderDialog from './FolderDialog.vue'

const fileStore = useFileStore()
const currentPath = ref('/')
const folderDialog = ref(false)

onMounted(() => {
  fileStore.fetchFiles(currentPath.value)
})

const handlePathChange = (path) => {
  currentPath.value = path
  fileStore.fetchFiles(path)
}

const handleUploadSuccess = () => {
  fileStore.fetchFiles(currentPath.value)
}

const handleCreateFolder = async (name) => {
  try {
    await fileStore.createFolder(name, currentPath.value)
    folderDialog.value = false
  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <div class="file-manager">
    <div class="file-header">
      <h2>文件管理</h2>
      <div class="actions">
        <button class="upload-btn" @click="$refs.fileUpload.openUploader()">
          上传文件
        </button>
        <button class="folder-btn" @click="folderDialog = true">
          新建文件夹
        </button>
      </div>
    </div>

    <div class="storage-info">
      <div class="storage-bar">
        <div 
          class="storage-used"
          :style="{ width: `${(fileStore.usedSpace / fileStore.totalSize) * 100}%` }"
        ></div>
      </div>
      <div class="storage-text">
        已使用 {{ (fileStore.usedSpace / 1024 / 1024).toFixed(2) }}MB / 
        {{ (fileStore.totalSize / 1024 / 1024).toFixed(2) }}MB
      </div>
    </div>

    <FileList
      :files="fileStore.files"
      :current-path="currentPath"
      @path-change="handlePathChange"
    />

    <FileUpload
      ref="fileUpload"
      :path="currentPath"
      @upload-success="handleUploadSuccess"
    />

    <FolderDialog
      v-if="folderDialog"
      @close="folderDialog = false"
      @create="handleCreateFolder"
    />
  </div>
</template>

<style scoped>
.file-manager {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.file-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.actions {
  display: flex;
  gap: 10px;
}

.upload-btn,
.folder-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.upload-btn {
  background-color: #2196F3;
  color: white;
}

.folder-btn {
  background-color: #4CAF50;
  color: white;
}

.storage-info {
  margin-bottom: 20px;
}

.storage-bar {
  height: 4px;
  background-color: #f5f5f5;
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 5px;
}

.storage-used {
  height: 100%;
  background-color: #2196F3;
  transition: width 0.3s ease;
}

.storage-text {
  font-size: 0.9em;
  color: #666;
}
</style> 