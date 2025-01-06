<template>
  <div class="job-card" @click="$emit('click')">
    <div class="job-header">
      <h3 class="job-title">{{ job.title }}</h3>
      <span class="job-salary">{{ formatSalary }}</span>
    </div>
    <div class="job-info">
      <span>{{ job.company_name }}</span>
      <span>{{ job.location }}</span>
      <span>{{ job.type }}</span>
    </div>
    <div class="job-tags">
      <el-tag v-if="job.experience" size="small">{{ job.experience }}</el-tag>
      <el-tag v-if="job.education" size="small">{{ job.education }}</el-tag>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  job: {
    type: Object,
    required: true
  }
})

const formatSalary = computed(() => {
  if (!props.job.salary_min && !props.job.salary_max) return '面议'
  if (!props.job.salary_max) return `${props.job.salary_min}k+`
  return `${props.job.salary_min}k-${props.job.salary_max}k`
})
</script>

<style scoped>
.job-card {
  padding: 20px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.job-card:hover {
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}

.job-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.job-title {
  margin: 0;
  font-size: 16px;
  color: #303133;
}

.job-salary {
  color: #f56c6c;
  font-weight: bold;
}

.job-info {
  display: flex;
  gap: 16px;
  color: #606266;
  margin-bottom: 10px;
}

.job-tags {
  display: flex;
  gap: 8px;
}
</style> 