<script setup>
import { onMounted } from 'vue'
import { useCompanyStore } from '@/stores/company'
import { useExportStore } from '@/stores/export'

const companyStore = useCompanyStore()
const exportStore = useExportStore()

onMounted(() => {
  companyStore.fetchStatistics()
})

const exportData = async (type) => {
  try {
    const filters = {
      start_date: startDate.value,
      end_date: endDate.value
    }
    if (type === 'jobs') {
      await exportStore.exportJobs(filters)
    } else if (type === 'applications') {
      await exportStore.exportApplications(filters)
    }
  } catch (error) {
    console.error('导出失败:', error)
  }
}
</script>

<template>
  <div class="dashboard-container">
    <h2>企业中心</h2>

    <div v-if="companyStore.loading" class="loading">
      加载中...
    </div>

    <div v-else-if="companyStore.error" class="error">
      {{ companyStore.error }}
    </div>

    <template v-else>
      <div class="statistics-grid">
        <div class="stat-card">
          <h3>发布职位</h3>
          <div class="stat-value">{{ companyStore.statistics?.jobs_count || 0 }}</div>
          <div class="stat-label">个在招职位</div>
        </div>

        <div class="stat-card">
          <h3>收到简历</h3>
          <div class="stat-value">{{ companyStore.statistics?.applications_count || 0 }}</div>
          <div class="stat-label">份申请简历</div>
        </div>

        <div class="stat-card">
          <h3>面试中</h3>
          <div class="stat-value">{{ companyStore.statistics?.interviewing_count || 0 }}</div>
          <div class="stat-label">位候选人</div>
        </div>

        <div class="stat-card">
          <h3>职位浏览</h3>
          <div class="stat-value">{{ companyStore.statistics?.total_views || 0 }}</div>
          <div class="stat-label">次浏览量</div>
        </div>
      </div>

      <div class="quick-actions">
        <RouterLink to="/jobs/post" class="action-btn">
          发布新职位
        </RouterLink>
        <RouterLink to="/company/jobs" class="action-btn">
          职位管理
        </RouterLink>
        <RouterLink to="/company/applications" class="action-btn">
          简历管理
        </RouterLink>
      </div>

      <div class="export-actions">
        <button 
          class="export-btn"
          :disabled="exportStore.exporting"
          @click="exportData('jobs')"
        >
          导出职位数据
        </button>
        <button 
          class="export-btn"
          :disabled="exportStore.exporting"
          @click="exportData('applications')"
        >
          导出应聘数据
        </button>
      </div>

      <div v-if="exportStore.exporting" class="export-progress">
        <div class="progress-bar">
          <div 
            class="progress"
            :style="{ width: exportStore.progress + '%' }"
          ></div>
        </div>
        <span class="progress-text">{{ exportStore.progress }}%</span>
      </div>
    </template>
  </div>
</template>

<style scoped>
.dashboard-container {
  max-width: 1200px;
  margin: 40px auto;
  padding: 20px;
}

.statistics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.stat-card h3 {
  margin: 0 0 15px;
  color: #666;
  font-size: 1.1em;
}

.stat-value {
  font-size: 2.5em;
  font-weight: bold;
  color: #2196F3;
  margin-bottom: 5px;
}

.stat-label {
  color: #666;
  font-size: 0.9em;
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.action-btn {
  display: block;
  padding: 15px;
  background-color: #4CAF50;
  color: white;
  text-align: center;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.action-btn:hover {
  background-color: #45a049;
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
  .statistics-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .statistics-grid {
    grid-template-columns: 1fr;
  }
}

.export-actions {
  display: flex;
  gap: 10px;
}

.export-btn {
  padding: 8px 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.export-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.export-progress {
  margin: 20px 0;
}

.progress-bar {
  height: 4px;
  background-color: #f5f5f5;
  border-radius: 2px;
  overflow: hidden;
}

.progress {
  height: 100%;
  background-color: #4CAF50;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.9em;
  color: #666;
  margin-left: 10px;
}
</style> 