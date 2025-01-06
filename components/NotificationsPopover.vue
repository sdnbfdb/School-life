<script setup>
import { computed } from 'vue'
import { useWebSocketStore } from '@/stores/websocket'
import { useRouter } from 'vue-router'

const router = useRouter()
const wsStore = useWebSocketStore()

const unreadCount = computed(() => {
  return wsStore.notifications.filter(n => !n.read).length
})

const formatTime = (date) => {
  return new Date(date).toLocaleString('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  })
}

const handleClick = (notification) => {
  wsStore.markAsRead(notification.id)
  
  // 根据通知类型跳转到相应页面
  switch (notification.type) {
    case 'application':
      router.push('/profile/applications')
      break
    case 'interview':
      router.push('/profile/interviews')
      break
    case 'new_application':
      router.push('/company/applications')
      break
  }
}
</script>

<template>
  <div class="notifications-popover">
    <div class="notifications-header">
      <h3>通知</h3>
      <div class="actions">
        <button 
          v-if="unreadCount"
          class="read-all-btn"
          @click="wsStore.markAllAsRead"
        >
          全部已读
        </button>
        <button 
          v-if="wsStore.notifications.length"
          class="clear-btn"
          @click="wsStore.clearNotifications"
        >
          清空
        </button>
      </div>
    </div>

    <div v-if="!wsStore.notifications.length" class="empty">
      暂无通知
    </div>

    <div v-else class="notifications-list">
      <div 
        v-for="notification in wsStore.notifications"
        :key="notification.id"
        class="notification-item"
        :class="{ unread: !notification.read }"
        @click="handleClick(notification)"
      >
        <div class="notification-icon" :class="notification.type">
          <i class="icon" :class="`icon-${notification.type}`"></i>
        </div>
        <div class="notification-content">
          <div class="notification-title">{{ notification.title }}</div>
          <div class="notification-message">{{ notification.message }}</div>
          <div class="notification-time">
            {{ formatTime(notification.created_at) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.notifications-popover {
  width: 360px;
  max-height: 480px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.notifications-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #eee;
}

.notifications-header h3 {
  margin: 0;
  font-size: 1.1em;
}

.actions {
  display: flex;
  gap: 10px;
}

.read-all-btn,
.clear-btn {
  padding: 4px 8px;
  border: none;
  border-radius: 4px;
  font-size: 0.9em;
  cursor: pointer;
}

.read-all-btn {
  background-color: #E3F2FD;
  color: #2196F3;
}

.clear-btn {
  background-color: #f5f5f5;
  color: #666;
}

.notifications-list {
  overflow-y: auto;
  max-height: 400px;
}

.notification-item {
  display: flex;
  padding: 15px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.notification-item:hover {
  background-color: #f9f9f9;
}

.notification-item.unread {
  background-color: #F3F8FF;
}

.notification-icon {
  width: 40px;
  height: 40px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
}

.notification-icon.application {
  background-color: #E3F2FD;
  color: #2196F3;
}

.notification-icon.interview {
  background-color: #E8F5E9;
  color: #4CAF50;
}

.notification-icon.new_application {
  background-color: #FFF3E0;
  color: #FF9800;
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
  font-size: 0.9em;
  margin-bottom: 5px;
}

.notification-time {
  color: #999;
  font-size: 0.8em;
}

.empty {
  padding: 40px;
  text-align: center;
  color: #666;
}
</style> 