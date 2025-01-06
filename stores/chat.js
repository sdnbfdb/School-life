import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/api/config'
import { useWebSocketStore } from './websocket'

export const useChatStore = defineStore('chat', () => {
  const conversations = ref([])
  const currentConversation = ref(null)
  const messages = ref([])
  const loading = ref(false)
  const error = ref('')

  const wsStore = useWebSocketStore()

  // 获取会话列表
  const fetchConversations = async () => {
    try {
      loading.value = true
      const response = await api.get('/chat/conversations')
      conversations.value = response.data
    } catch (err) {
      console.error('获取会话列表失败:', err)
      error.value = '获取会话列表失败'
    } finally {
      loading.value = false
    }
  }

  // 获取会话消息
  const fetchMessages = async (conversationId) => {
    try {
      loading.value = true
      const response = await api.get(`/chat/conversations/${conversationId}/messages`)
      messages.value = response.data
      currentConversation.value = conversations.value.find(c => c.id === conversationId)
    } catch (err) {
      console.error('获取消息失败:', err)
      error.value = '获取消息失败'
    } finally {
      loading.value = false
    }
  }

  // 发送消息
  const sendMessage = async (content) => {
    if (!currentConversation.value) return

    try {
      const message = {
        conversation_id: currentConversation.value.id,
        content,
        type: 'text'
      }

      wsStore.send({
        type: 'chat_message',
        data: message
      })

      // 乐观更新UI
      messages.value.push({
        ...message,
        sender_id: 'current_user',
        created_at: new Date().toISOString()
      })
    } catch (err) {
      console.error('发送消息失败:', err)
      error.value = '发送消息失败'
    }
  }

  // 创建新会话
  const createConversation = async (userId) => {
    try {
      const response = await api.post('/chat/conversations', {
        user_id: userId
      })
      conversations.value.unshift(response.data)
      return response.data
    } catch (err) {
      console.error('创建会话失败:', err)
      throw err
    }
  }

  // 处理新消息
  const handleNewMessage = (message) => {
    if (message.conversation_id === currentConversation.value?.id) {
      messages.value.push(message)
    }
    // 更新会话列表中的最后一条消息
    const conversation = conversations.value.find(c => c.id === message.conversation_id)
    if (conversation) {
      conversation.last_message = message
      conversation.unread_count++
    }
  }

  return {
    conversations,
    currentConversation,
    messages,
    loading,
    error,
    fetchConversations,
    fetchMessages,
    sendMessage,
    createConversation,
    handleNewMessage
  }
}) 