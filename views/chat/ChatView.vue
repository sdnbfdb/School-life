<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useChatStore } from '@/stores/chat'

const route = useRoute()
const authStore = useAuthStore()
const chatStore = useChatStore()

const messageInput = ref('')
const chatContainer = ref(null)

onMounted(async () => {
  // 初始化WebSocket连接
  chatStore.initWebSocket(authStore.token)
  
  // 获取会话列表
  await chatStore.fetchConversations()
  
  // 如果URL中有用户ID，则加载该用户的聊天记录
  if (route.query.userId) {
    await chatStore.fetchMessages(route.query.userId)
  }
})

onUnmounted(() => {
  // 清理WebSocket连接
  if (chatStore.ws) {
    chatStore.ws.close()
  }
})

const sendMessage = async () => {
  if (!messageInput.value.trim() || !chatStore.currentChat) return
  
  try {
    await chatStore.sendMessage(chatStore.currentChat.userId, messageInput.value)
    messageInput.value = ''
    
    // 滚动到最新消息
    setTimeout(() => {
      chatContainer.value?.scrollTo({
        top: chatContainer.value.scrollHeight,
        behavior: 'smooth'
      })
    }, 100)
  } catch (error) {
    console.error('发送消息失败:', error)
  }
}

const selectConversation = async (userId) => {
  await chatStore.fetchMessages(userId)
}
</script>

<template>
  <div class="chat-container">
    <!-- 会话列表 -->
    <div class="conversations">
      <div class="conversations-header">
        <h2>消息列表</h2>
      </div>
      <div class="conversations-list">
        <div
          v-for="conversation in chatStore.conversations"
          :key="conversation.userId"
          class="conversation-item"
          :class="{ active: chatStore.currentChat?.userId === conversation.userId }"
          @click="selectConversation(conversation.userId)"
        >
          <img :src="conversation.avatar" :alt="conversation.username" class="avatar">
          <div class="conversation-info">
            <div class="username">{{ conversation.username }}</div>
            <div class="last-message">{{ conversation.lastMessage }}</div>
          </div>
          <div class="conversation-meta">
            <span class="time">{{ conversation.lastMessageTime }}</span>
            <span v-if="conversation.unreadCount" class="unread-count">
              {{ conversation.unreadCount }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 聊天区域 -->
    <div class="chat-main">
      <template v-if="chatStore.currentChat">
        <div class="chat-header">
          <h3>{{ chatStore.currentChat.username }}</h3>
        </div>

        <div ref="chatContainer" class="messages-container">
          <div
            v-for="message in chatStore.messages"
            :key="message.id"
            class="message"
            :class="{ 'message-self': message.senderId === authStore.user.id }"
          >
            <img
              :src="message.senderId === authStore.user.id ? authStore.user.avatar : chatStore.currentChat.avatar"
              :alt="message.senderId === authStore.user.id ? '我' : chatStore.currentChat.username"
              class="avatar"
            >
            <div class="message-content">
              <div class="message-text">{{ message.content }}</div>
              <div class="message-time">
                {{ new Date(message.created_at).toLocaleTimeString() }}
              </div>
            </div>
          </div>
        </div>

        <div class="chat-input">
          <textarea
            v-model="messageInput"
            @keyup.enter.prevent="sendMessage"
            placeholder="输入消息..."
            rows="3"
          ></textarea>
          <button @click="sendMessage" :disabled="!messageInput.trim()">
            发送
          </button>
        </div>
      </template>

      <div v-else class="no-chat-selected">
        <p>选择一个联系人开始聊天</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chat-container {
  display: grid;
  grid-template-columns: 300px 1fr;
  height: calc(100vh - 60px);
  background-color: #f5f5f5;
}

.conversations {
  background-color: white;
  border-right: 1px solid #ddd;
}

.conversations-header {
  padding: 20px;
  border-bottom: 1px solid #ddd;
}

.conversations-list {
  overflow-y: auto;
}

.conversation-item {
  display: flex;
  align-items: center;
  padding: 15px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.conversation-item:hover,
.conversation-item.active {
  background-color: #f0f0f0;
}

.conversation-info {
  flex: 1;
  margin: 0 10px;
}

.username {
  font-weight: bold;
}

.last-message {
  color: #666;
  font-size: 0.9em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.conversation-meta {
  text-align: right;
}

.time {
  color: #999;
  font-size: 0.8em;
}

.unread-count {
  display: inline-block;
  background-color: #e74c3c;
  color: white;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 0.8em;
  margin-top: 5px;
}

.chat-main {
  display: flex;
  flex-direction: column;
}

.chat-header {
  padding: 20px;
  background-color: white;
  border-bottom: 1px solid #ddd;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.message {
  display: flex;
  align-items: flex-start;
  margin-bottom: 20px;
}

.message-self {
  flex-direction: row-reverse;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.message-content {
  margin: 0 10px;
  max-width: 60%;
}

.message-text {
  padding: 10px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.message-self .message-text {
  background-color: #4CAF50;
  color: white;
}

.message-time {
  font-size: 0.8em;
  color: #999;
  margin-top: 5px;
}

.chat-input {
  padding: 20px;
  background-color: white;
  border-top: 1px solid #ddd;
}

textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: none;
  margin-bottom: 10px;
}

button {
  float: right;
  padding: 8px 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background-color: #cccccc;
}

.no-chat-selected {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #666;
}
</style> 