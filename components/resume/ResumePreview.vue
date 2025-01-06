<script setup>
import { ref, onMounted } from 'vue'
import { useExportStore } from '@/stores/export'

const props = defineProps({
  resumeId: {
    type: String,
    required: true
  }
})

const exportStore = useExportStore()
const resumeData = ref(null)
const loading = ref(false)

onMounted(async () => {
  try {
    loading.value = true
    const response = await fetch(`/api/resumes/${props.resumeId}`)
    resumeData.value = await response.json()
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
})

const handleDownload = async () => {
  try {
    await exportStore.exportData({
      type: 'resume',
      id: props.resumeId,
      filename: `简历_${resumeData.value.name}.pdf`
    })
  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <div class="resume-preview">
    <div v-if="loading" class="loading">
      加载中...
    </div>
    
    <div v-else-if="resumeData" class="resume-content">
      <div class="header">
        <h2>{{ resumeData.name }}的简历</h2>
        <button @click="handleDownload">下载PDF</button>
      </div>
      
      <div class="section">
        <h3>基本信息</h3>
        <div class="info-grid">
          <div class="info-item">
            <span class="label">年龄:</span>
            <span>{{ resumeData.age }}</span>
          </div>
          <div class="info-item">
            <span class="label">学历:</span>
            <span>{{ resumeData.education }}</span>
          </div>
          <div class="info-item">
            <span class="label">工作年限:</span>
            <span>{{ resumeData.experience }}年</span>
          </div>
        </div>
      </div>
      
      <!-- 其他简历内容... -->
    </div>
  </div>
</template>

<style scoped>
.resume-preview {
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section {
  margin-bottom: 20px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.info-item {
  display: flex;
  gap: 10px;
}

.label {
  color: #666;
}

button {
  padding: 8px 16px;
  background: #2196F3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style> 