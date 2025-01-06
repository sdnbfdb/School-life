<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useChatStore } from '@/stores/chat'
import { useAuthStore } from '@/stores/auth'
import MessageBubble from './MessageBubble.vue'

const props = defineProps({
  userId: {
    type: [Number, String],
    required: true
  }
})

const chatStore = useChatStore()
const authStore = useAuthStore()
const messageInput = ref('')
const messagesContainer = ref(null)

// 初始化聊天
const initChat = async () => {
  try {
    // 获取或创建会话
    const conversation = chatStore.conversations.find(
      c => c.participants.some(p => p.id === props.userId)
    )
    
    if (conversation) {
      await chatStore.setActiveConversation(conversation)
    } else {
      await chatStore.createConversation(props.userId)
    }
  } catch (error) {
    console.error(error)
  }
}

// 发送消息
const sendMessage = async () => {
  if (!messageInput.value.trim()) return
  
  await chatStore.sendMessage(messageInput.value)
  messageInput.value = ''
  scrollToBottom()
}

// 滚动到底部
const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

onMounted(() => {
  initChat()
})

// 监听新消息
watch(() => chatStore.messages, () => {
  scrollToBottom()
}, { deep: true })
</script>

<template>
  <div class="chat-window">
    <div class="chat-header">
      <div v-if="chatStore.activeConversation" class="chat-title">
        {{ chatStore.activeConversation.participants.find(p => p.id !== authStore.user.id).name }}
      </div>
    </div>

    <div ref="messagesContainer" class="messages-container">
      <div v-if="chatStore.loading" class="loading">
        加载中...
      </div>

      <template v-else>
        <div 
          v-for="message in chatStore.messages"
          :key="message.id"
          class="message-wrapper"
          :class="{ 'message-self': message.sender_id === authStore.user.id }"
        >
          <MessageBubble
            :message="message"
            :is-self="message.sender_id === authStore.user.id"
          />
        </div>
      </template>
    </div>

    <div class="chat-input">
      <textarea
        v-model="messageInput"
        placeholder="输入消息..."
        @keydown.enter.prevent="sendMessage"
      ></textarea>
      <button 
        class="send-btn"
        :disabled="!messageInput.trim()"
        @click="sendMessage"
      >
        发送
      </button>
    </div>
  </div>
</template>

<style scoped>
.chat-window {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: white;
  border-radius: 8px;
  overflow: hidden;
}

.chat-header {
  padding: 15px;
  border-bottom: 1px solid #eee;
}

.chat-title {
  font-weight: 500;
  color: #333;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.message-wrapper {
  margin-bottom: 15px;
  display: flex;
}

.message-self {
  justify-content: flex-end;
}

.chat-input {
  padding: 15px;
  border-top: 1px solid #eee;
  display: flex;
  gap: 10px;
}

textarea {
  flex: 1;
  height: 40px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: none;
}

.send-btn {
  padding: 0 20px;
  background-color: #2196F3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.send-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.loading {
  text-align: center;
  color: #666;
  padding: 20px;
}
</style> 