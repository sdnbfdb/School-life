<script setup>
defineProps({
  stats: {
    type: Object,
    required: true
  }
})

const successRate = computed(() => {
  if (props.stats.total === 0) return 0
  return ((props.stats.success / props.stats.total) * 100).toFixed(2)
})
</script>

<template>
  <div class="api-stats-panel panel">
    <h3>API请求统计</h3>

    <div class="stats-container">
      <div class="stat-row">
        <div class="stat-label">总请求数</div>
        <div class="stat-value">{{ stats.total }}</div>
      </div>

      <div class="stat-row">
        <div class="stat-label">成功请求</div>
        <div class="stat-value success">{{ stats.success }}</div>
      </div>

      <div class="stat-row">
        <div class="stat-label">失败请求</div>
        <div class="stat-value error">{{ stats.failed }}</div>
      </div>

      <div class="stat-row">
        <div class="stat-label">平均响应时间</div>
        <div class="stat-value">{{ stats.avgTime }}ms</div>
      </div>

      <div class="stat-row">
        <div class="stat-label">成功率</div>
        <div class="stat-value">
          <div class="progress-bar">
            <div 
              class="progress"
              :style="{ width: `${successRate}%` }"
              :class="{ warning: successRate < 90 }"
            ></div>
          </div>
          <span>{{ successRate }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.panel {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.stats-container {
  margin-top: 20px;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.stat-row:last-child {
  border-bottom: none;
}

.stat-label {
  color: #666;
}

.stat-value {
  font-weight: 500;
}

.stat-value.success {
  color: #4CAF50;
}

.stat-value.error {
  color: #f44336;
}

.progress-bar {
  width: 100px;
  height: 8px;
  background-color: #f5f5f5;
  border-radius: 4px;
  overflow: hidden;
  margin-right: 10px;
  display: inline-block;
  vertical-align: middle;
}

.progress {
  height: 100%;
  background-color: #4CAF50;
  transition: width 0.3s ease;
}

.progress.warning {
  background-color: #f44336;
}
</style> 