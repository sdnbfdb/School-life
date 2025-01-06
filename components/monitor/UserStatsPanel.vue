<script setup>
defineProps({
  stats: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div class="user-stats-panel panel">
    <h3>用户访问统计</h3>

    <div class="stats-grid">
      <div class="stat-item">
        <div class="stat-value">{{ stats.online }}</div>
        <div class="stat-label">当前在线</div>
      </div>

      <div class="stat-item">
        <div class="stat-value">{{ stats.today }}</div>
        <div class="stat-label">今日访问</div>
      </div>

      <div class="stat-item">
        <div class="stat-value">{{ stats.week }}</div>
        <div class="stat-label">本周访问</div>
      </div>

      <div class="stat-item">
        <div class="stat-value">{{ stats.month }}</div>
        <div class="stat-label">本月访问</div>
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

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-top: 20px;
}

.stat-item {
  text-align: center;
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.stat-value {
  font-size: 24px;
  font-weight: 500;
  color: #2196F3;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 0.9em;
  color: #666;
}
</style> 