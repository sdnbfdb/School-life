<script setup>
defineProps({
  message: {
    type: Object,
    required: true
  },
  isSelf: {
    type: Boolean,
    default: false
  }
})

const formatTime = (date) => {
  return new Date(date).toLocaleString('zh-CN', {
    hour: 'numeric',
    minute: 'numeric'
  })
}
</script>

<template>
  <div class="message-bubble" :class="{ self: isSelf }">
    <div class="message-content">
      <template v-if="message.type === 'text'">
        {{ message.content }}
      </template>
      <template v-else-if="message.type === 'image'">
        <img :src="message.content" alt="图片消息">
      </template>
    </div>
    <div class="message-meta">
      <span class="message-time">{{ formatTime(message.created_at) }}</span>
      <span 
        v-if="isSelf"
        class="message-status"
        :class="message.status"
      >
        {{ message.status === 'failed' ? '发送失败' : '' }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.message-bubble {
  max-width: 70%;
  display: inline-block;
}

.message-content {
  background-color: #f5f5f5;
  padding: 10px 15px;
  border-radius: 12px;
  margin-bottom: 4px;
}

.message-bubble.self .message-content {
  background-color: #E3F2FD;
}

.message-meta {
  font-size: 0.8em;
  color: #999;
  text-align: right;
}

.message-status {
  margin-left: 5px;
}

.message-status.failed {
  color: #f44336;
}

img {
  max-width: 100%;
  border-radius: 8px;
}
</style> 