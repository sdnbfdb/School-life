<script setup>
import { ref } from 'vue'

const props = defineProps({
  logs: {
    type: Array,
    required: true
  },
  total: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['clear'])

const formatTime = (date) => {
  return new Date(date).toLocaleString('zh-CN')
}

const currentPage = ref(1)
const pageSize = 10

const handleClear = async () => {
  if (!confirm('确定要清除所有错误日志吗？')) return
  try {
    await emit('clear')
  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <div class="error-log-panel panel">
    <div class="panel-header">
      <h3>错误日志 ({{ total }})</h3>
      <button 
        v-if="total > 0"
        class="clear-btn"
        @click="handleClear"
      >
        清除全部
      </button>
    </div>

    <div v-if="logs.length === 0" class="empty">
      暂无错误日志
    </div>

    <div v-else class="logs">
      <div 
        v-for="log in logs"
        :key="log.id"
        class="log-item"
        :class="log.level"
      >
        <div class="log-header">
          <span class="log-level">{{ log.level }}</span>
          <span class="log-time">{{ formatTime(log.timestamp) }}</span>
        </div>
        <div class="log-message">{{ log.message }}</div>
        <div v-if="log.stack" class="log-stack">
          {{ log.stack }}
        </div>
      </div>

      <div class="pagination">
        <button 
          :disabled="currentPage === 1"
          @click="currentPage--"
        >
          上一页
        </button>
        <span>{{ currentPage }}</span>
        <button 
          :disabled="currentPage * pageSize >= total"
          @click="currentPage++"
        >
          下一页
        </button>
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

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.clear-btn {
  padding: 4px 12px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.logs {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.log-item {
  padding: 10px;
  border-radius: 4px;
  background-color: #f5f5f5;
}

.log-item.error {
  background-color: #ffebee;
}

.log-item.warning {
  background-color: #fff3e0;
}

.log-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  font-size: 0.9em;
}

.log-level {
  text-transform: uppercase;
  font-weight: 500;
}

.log-time {
  color: #666;
}

.log-message {
  margin-bottom: 5px;
}

.log-stack {
  font-family: monospace;
  font-size: 0.9em;
  color: #666;
  white-space: pre-wrap;
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
}

.pagination button {
  padding: 4px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
}

.pagination button:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.empty {
  text-align: center;
  padding: 40px;
  color: #666;
}
</style> 