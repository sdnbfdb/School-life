<script setup>
import { computed } from 'vue'

const props = defineProps({
  performance: {
    type: Object,
    required: true
  }
})

const formatNetworkSpeed = (bytes) => {
  if (bytes < 1024) return `${bytes}B/s`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)}KB/s`
  return `${(bytes / 1024 / 1024).toFixed(2)}MB/s`
}

const networkIn = computed(() => formatNetworkSpeed(props.performance.network.in))
const networkOut = computed(() => formatNetworkSpeed(props.performance.network.out))
</script>

<template>
  <div class="performance-panel panel">
    <h3>系统性能</h3>
    
    <div class="metrics">
      <div class="metric">
        <div class="metric-label">CPU使用率</div>
        <div class="metric-value">
          <div class="progress-bar">
            <div 
              class="progress"
              :style="{ width: `${performance.cpu}%` }"
              :class="{ warning: performance.cpu > 80 }"
            ></div>
          </div>
          <span>{{ performance.cpu }}%</span>
        </div>
      </div>

      <div class="metric">
        <div class="metric-label">内存使用率</div>
        <div class="metric-value">
          <div class="progress-bar">
            <div 
              class="progress"
              :style="{ width: `${performance.memory}%` }"
              :class="{ warning: performance.memory > 80 }"
            ></div>
          </div>
          <span>{{ performance.memory }}%</span>
        </div>
      </div>

      <div class="metric">
        <div class="metric-label">磁盘使用率</div>
        <div class="metric-value">
          <div class="progress-bar">
            <div 
              class="progress"
              :style="{ width: `${performance.disk}%` }"
              :class="{ warning: performance.disk > 90 }"
            ></div>
          </div>
          <span>{{ performance.disk }}%</span>
        </div>
      </div>

      <div class="metric">
        <div class="metric-label">网络流量</div>
        <div class="metric-value network">
          <div>↑ {{ networkOut }}</div>
          <div>↓ {{ networkIn }}</div>
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

.metrics {
  display: grid;
  gap: 20px;
  margin-top: 20px;
}

.metric {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.metric-label {
  color: #666;
  font-size: 0.9em;
}

.metric-value {
  display: flex;
  align-items: center;
  gap: 10px;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background-color: #f5f5f5;
  border-radius: 4px;
  overflow: hidden;
}

.progress {
  height: 100%;
  background-color: #4CAF50;
  transition: width 0.3s ease;
}

.progress.warning {
  background-color: #f44336;
}

.network {
  flex-direction: column;
  gap: 4px;
  font-size: 0.9em;
}
</style> 