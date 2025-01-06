<script setup>
import { onMounted } from 'vue'
import { useRecommendationStore } from '@/stores/recommendation'
import { useAuthStore } from '@/stores/auth'
import JobCard from './JobCard.vue'

const recommendationStore = useRecommendationStore()
const authStore = useAuthStore()

onMounted(() => {
  if (authStore.user) {
    recommendationStore.fetchRecommendedJobs(authStore.user.id)
  }
})

const handleJobClick = (jobId) => {
  // 记录用户点击行为
  recommendationStore.trackUserAction({
    type: 'job_click',
    job_id: jobId,
    user_id: authStore.user.id,
    timestamp: new Date().toISOString()
  })
}
</script>

<template>
  <div class="recommended-jobs">
    <h3>推荐职位</h3>
    
    <div v-if="recommendationStore.loading" class="loading">
      加载中...
    </div>
    
    <div v-else-if="recommendationStore.error" class="error">
      {{ recommendationStore.error }}
    </div>
    
    <div v-else class="jobs-grid">
      <JobCard
        v-for="job in recommendationStore.recommendedJobs"
        :key="job.id"
        :job="job"
        @click="handleJobClick(job.id)"
      />
    </div>
  </div>
</template>

<style scoped>
.recommended-jobs {
  padding: 20px;
}

.jobs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.loading,
.error {
  text-align: center;
  padding: 40px;
  color: #666;
}

.error {
  color: #f44336;
}
</style> 