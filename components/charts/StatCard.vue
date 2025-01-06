<script setup>
defineProps({
  title: String,
  value: [Number, String],
  subtitle: String,
  trend: {
    type: Number,
    default: 0
  },
  loading: Boolean
})
</script>

<template>
  <div class="stat-card">
    <div class="stat-header">
      <h3>{{ title }}</h3>
      <div 
        v-if="trend !== 0"
        class="trend"
        :class="trend > 0 ? 'trend-up' : 'trend-down'"
      >
        {{ Math.abs(trend) }}%
      </div>
    </div>
    
    <div class="stat-content">
      <div v-if="loading" class="loading">
        加载中...
      </div>
      <template v-else>
        <div class="stat-value">{{ value }}</div>
        <div class="stat-subtitle">{{ subtitle }}</div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.stat-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.stat-header h3 {
  margin: 0;
  font-size: 1em;
  color: #666;
}

.trend {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.9em;
}

.trend-up {
  background-color: #E8F5E9;
  color: #4CAF50;
}

.trend-down {
  background-color: #FFEBEE;
  color: #F44336;
}

.stat-value {
  font-size: 2em;
  font-weight: bold;
  color: #2196F3;
  margin-bottom: 5px;
}

.stat-subtitle {
  font-size: 0.9em;
  color: #666;
}

.loading {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
}
</style> 