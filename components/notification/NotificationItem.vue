<script setup>
import { computed } from 'vue'

const props = defineProps({
  notification: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['mark-as-read', 'delete'])

const formatTime = (date) => {
  return new Date(date).toLocaleString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  })
}

const getIcon = computed(() => {
  switch (props.notification.type) {
    case 'jobUpdate': return 'icon-job'
    case 'applicationStatus': return 'icon-application'
    case 'interview': return 'icon-calendar'
    case 'message': return 'icon-message'
    default: return 'icon-notification'
  }
})
</script>

<template>
  <div 
    class="notification-item"
    :class="{ unread: !notification.read }"
  >
    <div class="notification-icon">
      <i :class="getIcon"></i>
    </div>
    
    <div class="notification-content">
      <div class="notification-title">{{ notification.title }}</div>
      <div class="notification-message">{{ notification.message }}</div>
      <div class="notification-meta">
        <span class="notification-time">{{ formatTime(notification.created_at) }}</span>
      </div>
    </div>

    <div class="notification-actions">
      <button 
        v-if="!notification.read"
        class="action-btn read-btn"
        @click="emit('mark-as-read', notification.id)"
      >
        标记已读
      </button>
      <button 
        class="action-btn delete-btn"
        @click="emit('delete', notification.id)"
      >
        删除
      </button>
    </div>
  </div>
</template>

<style scoped>
.notification-item {
  display: flex;
  gap: 20px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  margin-bottom: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.notification-item.unread {
  background-color: #E3F2FD;
}

.notification-icon {
  font-size: 24px;
  color: #2196F3;
}

.notification-content {
  flex: 1;
}

.notification-title {
  font-weight: 500;
  margin-bottom: 5px;
}

.notification-message {
  color: #666;
  margin-bottom: 10px;
}

.notification-meta {
  font-size: 0.9em;
  color: #999;
}

.notification-actions {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.action-btn {
  padding: 4px 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9em;
}

.read-btn {
  background-color: #2196F3;
  color: white;
}

.delete-btn {
  background-color: #f5f5f5;
  color: #666;
}
</style> 