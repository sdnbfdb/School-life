import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/api/config'

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref([])
  const loading = ref(false)
  const error = ref('')

  // 未读通知数量
  const unreadCount = computed(() => 
    notifications.value.filter(n => !n.read).length
  )

  // 获取通知列表
  const fetchNotifications = async () => {
    try {
      loading.value = true
      const response = await api.get('/notifications')
      notifications.value = response.data
    } catch (err) {
      console.error('获取通知失败:', err)
      error.value = '获取通知失败'
    } finally {
      loading.value = false
    }
  }

  // 标记通知为已读
  const markAsRead = async (notificationId) => {
    try {
      await api.put(`/notifications/${notificationId}/read`)
      const notification = notifications.value.find(n => n.id === notificationId)
      if (notification) {
        notification.read = true
      }
    } catch (err) {
      console.error('标记通知已读失败:', err)
      throw err
    }
  }

  // 标记所有通知为已读
  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all')
      notifications.value.forEach(n => n.read = true)
    } catch (err) {
      console.error('标记所有通知已读失败:', err)
      throw err
    }
  }

  // 删除通知
  const deleteNotification = async (notificationId) => {
    try {
      await api.delete(`/notifications/${notificationId}`)
      notifications.value = notifications.value.filter(n => n.id !== notificationId)
    } catch (err) {
      console.error('删除通知失败:', err)
      throw err
    }
  }

  // 处理新通知
  const handleNewNotification = (notification) => {
    notifications.value.unshift(notification)
    // 发送浏览器通知
    if (Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/notification-icon.png'
      })
    }
  }

  return {
    notifications,
    loading,
    error,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    handleNewNotification
  }
}) 