<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  job: {
    type: Object,
    required: true
  }
})

const router = useRouter()

// 格式化薪资
const formatSalary = computed(() => {
  const { salary_min, salary_max } = props.job
  if (!salary_min && !salary_max) return '面议'
  if (!salary_max) return `${salary_min}k+`
  return `${salary_min}k-${salary_max}k`
})

// 跳转到详情页
const goToDetail = () => {
  router.push(`/jobs/${props.job.id}`)
}
</script>

<template>
  <div class="job-card" @click="goToDetail">
    <div class="job-info">
      <div class="title-row">
        <h3 class="title">{{ job.title }}</h3>
        <span class="salary">{{ formatSalary }}</span>
      </div>
      
      <div class="company-row">
        <div class="company">
          <img
            v-if="job.company_logo"
            :src="job.company_logo"
            :alt="job.company_name"
            class="company-logo"
          >
          <span class="company-name">{{ job.company_name }}</span>
        </div>
      </div>
      
      <div class="tags">
        <span class="tag">{{ job.location }}</span>
        <span class="tag">{{ job.experience }}</span>
        <span class="tag">{{ job.education }}</span>
        <span class="tag">{{ job.type }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.job-card {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.job-card:hover {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.title {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.salary {
  color: #f44336;
  font-weight: bold;
}

.company-row {
  margin-bottom: 15px;
}

.company {
  display: flex;
  align-items: center;
  gap: 10px;
}

.company-logo {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  object-fit: cover;
}

.company-name {
  color: #666;
}

.tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag {
  padding: 4px 8px;
  background: #f5f5f5;
  border-radius: 4px;
  font-size: 14px;
  color: #666;
}
</style> 