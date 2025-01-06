import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api/config'

export const useFriendStore = defineStore('friend', () => {
  const loading = ref(false)
  const error = ref('')
  const friends = ref([])
  const requests = ref([])

  // 获取好友列表
  const fetchFriends = async () => {
    try {
      loading.value = true
      const response = await api.get('/friends')
      friends.value = response.data
    } catch (err) {
      console.error('获取好友列表失败:', err)
      error.value = '获取好友列表失败'
    } finally {
      loading.value = false
    }
  }

  // 获取好友请求
  const fetchRequests = async () => {
    try {
      loading.value = true
      const response = await api.get('/friends/requests')
      requests.value = response.data
    } catch (err) {
      console.error('获取好友请求失败:', err)
      error.value = '获取好友请求失败'
    } finally {
      loading.value = false
    }
  }

  // 发送好友请求
  const sendRequest = async (userId) => {
    try {
      loading.value = true
      await api.post('/friends/requests', { userId })
    } catch (err) {
      console.error('发送好友请求失败:', err)
      error.value = '发送好友请求失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  // 接受好友请求
  const acceptRequest = async (requestId) => {
    try {
      loading.value = true
      await api.post(`/friends/requests/${requestId}/accept`)
      requests.value = requests.value.filter(r => r.id !== requestId)
      await fetchFriends()
    } catch (err) {
      console.error('接受好友请求失败:', err)
      error.value = '接受好友请求失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  // 拒绝好友请求
  const rejectRequest = async (requestId) => {
    try {
      loading.value = true
      await api.post(`/friends/requests/${requestId}/reject`)
      requests.value = requests.value.filter(r => r.id !== requestId)
    } catch (err) {
      console.error('拒绝好友请求失败:', err)
      error.value = '拒绝好友请求失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  // 删除好友
  const removeFriend = async (friendId) => {
    try {
      loading.value = true
      await api.delete(`/friends/${friendId}`)
      friends.value = friends.value.filter(f => f.id !== friendId)
    } catch (err) {
      console.error('删除好友失败:', err)
      error.value = '删除好友失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    friends,
    requests,
    fetchFriends,
    fetchRequests,
    sendRequest,
    acceptRequest,
    rejectRequest,
    removeFriend
  }
}) 