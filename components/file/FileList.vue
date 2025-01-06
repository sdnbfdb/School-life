<script setup>
import { computed } from 'vue'
import { useFileStore } from '@/stores/file'

const props = defineProps({
  files: {
    type: Array,
    required: true
  },
  currentPath: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['path-change'])
const fileStore = useFileStore()

// 计算面包屑导航
const breadcrumbs = computed(() => {
  const paths = props.currentPath.split('/').filter(Boolean)
  return [
    { name: '根目录', path: '/' },
    ...paths.map((name, index) => ({
      name,
      path: '/' + paths.slice(0, index + 1).join('/')
    }))
  ]
})

// 格式化文件大小
const formatSize = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
}

// 格式化日期
const formatDate = (date) => {
  return new Date(date).toLocaleString('zh-CN')
}

// 处理文件/文件夹点击
const handleItemClick = (file) => {
  if (file.type === 'folder') {
    emit('path-change', `${props.currentPath}${file.name}/`)
  }
}

// 删除文件/文件夹
const handleDelete = async (file) => {
  if (!confirm(`确定要删除${file.type === 'folder' ? '文件夹' : '文件'} "${file.name}" 吗？`)) {
    return
  }
  
  try {
    await fileStore.deleteFile(file.id)
  } catch (error) {
    console.error(error)
  }
}

// 重命名文件/文件夹
const handleRename = async (file) => {
  const newName = prompt('请输入新名称:', file.name)
  if (!newName || newName === file.name) return
  
  try {
    await fileStore.rename(file.id, newName)
  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <div class="file-list">
    <!-- 面包屑导航 -->
    <div class="breadcrumbs">
      <template v-for="(crumb, index) in breadcrumbs" :key="crumb.path">
        <span 
          class="breadcrumb-item"
          :class="{ active: index === breadcrumbs.length - 1 }"
          @click="emit('path-change', crumb.path)"
        >
          {{ crumb.name }}
        </span>
        <span v-if="index < breadcrumbs.length - 1" class="separator">/</span>
      </template>
    </div>

    <!-- 文件列表 -->
    <div class="list-container">
      <table v-if="files.length > 0">
        <thead>
          <tr>
            <th>名称</th>
            <th>大小</th>
            <th>修改日期</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="file in files" :key="file.id">
            <td>
              <div class="file-name" @click="handleItemClick(file)">
                <i :class="file.type === 'folder' ? 'icon-folder' : 'icon-file'"></i>
                {{ file.name }}
              </div>
            </td>
            <td>{{ file.type === 'folder' ? '-' : formatSize(file.size) }}</td>
            <td>{{ formatDate(file.updated_at) }}</td>
            <td>
              <div class="actions">
                <button class="action-btn" @click="handleRename(file)">重命名</button>
                <button class="action-btn delete" @click="handleDelete(file)">删除</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else class="empty">
        当前文件夹为空
      </div>
    </div>
  </div>
</template>

<style scoped>
.file-list {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.breadcrumbs {
  margin-bottom: 20px;
  padding: 10px;
  background: #f5f5f5;
  border-radius: 4px;
}

.breadcrumb-item {
  color: #2196F3;
  cursor: pointer;
}

.breadcrumb-item.active {
  color: #666;
  cursor: default;
}

.separator {
  margin: 0 8px;
  color: #999;
}

.list-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

th {
  font-weight: 500;
  color: #666;
}

.file-name {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.file-name:hover {
  color: #2196F3;
}

.actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  padding: 4px 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9em;
}

.action-btn.delete {
  background-color: #ffebee;
  color: #f44336;
}

.empty {
  text-align: center;
  padding: 40px;
  color: #666;
}
</style> 