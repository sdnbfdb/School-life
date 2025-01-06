<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useMonitorStore } from '@/stores/monitor'
import PerformancePanel from './PerformancePanel.vue'
import ErrorLogPanel from './ErrorLogPanel.vue'
import UserStatsPanel from './UserStatsPanel.vue'
import ApiStatsPanel from './ApiStatsPanel.vue'

const monitorStore = useMonitorStore()
let refreshInterval

onMounted(() => {
  // 初始加载数据
  loadAllData()
  
  // 设置定时刷新
  refreshInterval = setInterval(() => {
    monitorStore.fetchPerformance()
    monitorStore.fetchUserStats()
    monitorStore.fetchApiStats()
  }, 30000) // 每30秒刷新一次
})

onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
  }
})

const loadAllData = async () => {
  try {
    await Promise.all([
      monitorStore.fetchPerformance(),
      monitorStore.fetchErrorLogs(),
      monitorStore.fetchUserStats(),
      monitorStore.fetchApiStats()
    ])
  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <div class="system-monitor">
    <h2>系统监控</h2>

    <div v-if="monitorStore.loading" class="loading">
      加载中...
    </div>

    <div v-else-if="monitorStore.error" class="error">
      {{ monitorStore.error }}
    </div>

    <template v-else>
      <div class="monitor-grid">
        <PerformancePanel :performance="monitorStore.performance" />
        <UserStatsPanel :stats="monitorStore.userStats" />
        <ApiStatsPanel :stats="monitorStore.apiStats" />
        <ErrorLogPanel 
          :logs="monitorStore.errorLogs"
          :total="monitorStore.totalErrors"
          @clear="monitorStore.clearErrorLogs"
        />
      </div>
    </template>
  </div>
</template>

<style scoped>
.system-monitor {
  padding: 20px;
}

.monitor-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
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