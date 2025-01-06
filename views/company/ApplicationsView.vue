<script setup>
import { ref, onMounted } from 'vue'
import { useApplicationStore } from '@/stores/application'
import { useExportStore } from '@/stores/export'

const applicationStore = useApplicationStore()
const exportStore = useExportStore()

const currentTab = ref('pending')
const selectedIds = ref([])

onMounted(() => {
  applicationStore.fetchApplications({ status: currentTab.value })
})

const handleTabChange = (tab) => {
  currentTab.value = tab
  applicationStore.fetchApplications({ status: tab })
}

const handleStatusChange = async (applicationId, status) => {
  try {
    await applicationStore.updateStatus(applicationId, status)
  } catch (error) {
    console.error(error)
  }
}

const handleExport = async () => {
  try {
    await exportStore.exportData({
      type: 'applications',
      ids: selectedIds.value,
      filename: '申请记录.xlsx'
    })
  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <div class="applications-view">
    <div class="header">
      <h2>申请管理</h2>
      <button 
        class="export-btn"
        :disabled="selectedIds.length === 0"
        @click="handleExport"
      >
        导出选中
      </button>
    </div>

    <div class="tabs">
      <button 
        v-for="tab in ['pending', 'interviewing', 'accepted', 'rejected']"
        :key="tab"
        :class="{ active: currentTab === tab }"
        @click="handleTabChange(tab)"
      >
        {{ tab }}
      </button>
    </div>

    <div v-if="applicationStore.loading" class="loading">
      加载中...
    </div>

    <div v-else-if="applicationStore.error" class="error">
      {{ applicationStore.error }}
    </div>

    <div v-else>
      <table>
        <thead>
          <tr>
            <th>
              <input 
                type="checkbox"
                :checked="selectedIds.length === applicationStore.applications.length"
                @change="handleSelectAll"
              >
            </th>
            <th>申请人</th>
            <th>职位</th>
            <th>申请时间</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="app in applicationStore.applications" :key="app.id">
            <td>
              <input 
                type="checkbox"
                v-model="selectedIds"
                :value="app.id"
              >
            </td>
            <td>{{ app.applicant.name }}</td>
            <td>{{ app.job.title }}</td>
            <td>{{ formatDate(app.created_at) }}</td>
            <td>{{ app.status }}</td>
            <td>
              <select 
                v-model="app.status"
                @change="handleStatusChange(app.id, $event.target.value)"
              >
                <option value="pending">待处理</option>
                <option value="interviewing">面试中</option>
                <option value="accepted">通过</option>
                <option value="rejected">拒绝</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.applications-view {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.export-btn {
  padding: 8px 16px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.export-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.tabs button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background: #f5f5f5;
}

.tabs button.active {
  background: #2196F3;
  color: white;
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

select {
  padding: 4px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
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