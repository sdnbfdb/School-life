<script setup>
import { onMounted } from 'vue'
import { useNotificationStore } from '@/stores/notification'
import NotificationItem from './NotificationItem.vue'

const notificationStore = useNotificationStore()

onMounted(() => {
  notificationStore.fetchNotifications()
})

const handleMarkAsRead = async (id) => {
  try {
    await notificationStore.markAsRead(id)
  } catch (error) {
    console.error(error)
  }
}

const handleDelete = async (id) => {
  try {
    await notificationStore.deleteNotification(id)
  } catch (error) {
    console.error(error)
  }
}

const handleMarkAllAsRead = async () => {
  try {
    await notificationStore.markAllAsRead()
  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <div class="notification-list">
    <div class="notification-header">
      <h3>通知中心 ({{ notificationStore.unreadCount }})</h3>
      <button 
        v-if="notificationStore.unreadCount > 0"
        class="mark-all-btn"
        @click="handleMarkAllAsRead"
      >
        全部标记为已读
      </button>
    </div>

    <div v-if="notificationStore.loading" class="loading">
      加载中...
    </div>

    <div v-else-if="notificationStore.notifications.length === 0" class="empty">
      暂无通知
    </div>

    <template v-else>
      <NotificationItem
        v-for="notification in notificationStore.notifications"
        :key="notification.id"
        :notification="notification"
        @mark-as-read="handleMarkAsRead"
        @delete="handleDelete"
      />
    </template>
  </div>
</template>

<style scoped>
.notification-list {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.mark-all-btn {
  padding: 8px 16px;
  background-color: #2196F3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.loading,
.empty {
  text-align: center;
  padding: 40px;
  color: #666;
}
</style> 