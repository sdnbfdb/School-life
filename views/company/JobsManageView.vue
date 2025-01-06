<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCompanyStore } from '@/stores/company'

const router = useRouter()
const companyStore = useCompanyStore()

onMounted(() => {
  companyStore.fetchJobs()
})

const viewApplications = (jobId) => {
  router.push(`/company/jobs/${jobId}/applications`)
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<template>
  <div class="jobs-manage-container">
    <div class="header">
      <h2>职位管理</h2>
      <RouterLink to="/jobs/post" class="post-btn">
        发布新职位
      </RouterLink>
    </div>

    <div v-if="companyStore.loading" class="loading">
      加载中...
    </div>

    <div v-else-if="companyStore.error" class="error">
      {{ companyStore.error }}
    </div>

    <div v-else-if="!companyStore.jobs.length" class="empty">
      暂无发布的职位
    </div>

    <div v-else class="jobs-list">
      <div 
        v-for="job in companyStore.jobs"
        :key="job.id"
        class="job-card"
      >
        <div class="job-info">
          <h3>{{ job.title }}</h3>
          <div class="job-meta">
            <span>{{ job.type }}</span>
            <span>{{ job.location }}</span>
            <span>{{ job.salary_range }}</span>
          </div>
          <div class="job-stats">
            <div class="stat">
              <span class="label">收到简历</span>
              <span class="value">{{ job.applications_count }}</span>
            </div>
            <div class="stat">
              <span class="label">浏览量</span>
              <span class="value">{{ job.views }}</span>
            </div>
            <div class="stat">
              <span class="label">发布时间</span>
              <span class="value">{{ formatDate(job.created_at) }}</span>
            </div>
          </div>
        </div>

        <div class="actions">
          <button 
            class="action-btn view-btn"
            @click="viewApplications(job.id)"
          >
            查看申请
          </button>
          <RouterLink 
            :to="`/jobs/${job.id}/edit`"
            class="action-btn edit-btn"
          >
            编辑职位
          </RouterLink>
          <button 
            class="action-btn status-btn"
            :class="{ 'status-active': job.status === 'active' }"
            @click="toggleJobStatus(job.id)"
          >
            {{ job.status === 'active' ? '关闭招聘' : '开启招聘' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.jobs-manage-container {
  max-width: 1200px;
  margin: 40px auto;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.post-btn {
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  text-decoration: none;
  border-radius: 4px;
}

.job-card {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.job-info h3 {
  margin: 0 0 10px;
  font-size: 1.2em;
}

.job-meta {
  display: flex;
  gap: 15px;
  color: #666;
  margin-bottom: 15px;
}

.job-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  padding: 15px 0;
  border-top: 1px solid #eee;
}

.stat {
  text-align: center;
}

.stat .label {
  display: block;
  color: #666;
  font-size: 0.9em;
  margin-bottom: 5px;
}

.stat .value {
  font-size: 1.2em;
  font-weight: 500;
}

.actions {
  display: flex;
  gap: 15px;
  margin-top: 20px;
}

.action-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9em;
  text-decoration: none;
}

.view-btn {
  background-color: #2196F3;
  color: white;
}

.edit-btn {
  background-color: #FFA000;
  color: white;
}

.status-btn {
  background-color: #f5f5f5;
  color: #333;
}

.status-active {
  background-color: #F44336;
  color: white;
}

.empty {
  text-align: center;
  padding: 40px;
  background-color: white;
  border-radius: 8px;
}

.loading,
.error {
  text-align: center;
  padding: 40px;
}

.error {
  color: red;
}

@media (max-width: 768px) {
  .job-stats {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .actions {
    flex-direction: column;
  }

  .action-btn {
    width: 100%;
    text-align: center;
  }
}
</style> 