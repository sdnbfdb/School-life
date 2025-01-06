<script setup>
import { useAuthStore } from '@/stores/auth'
import { useBottleStore } from '@/stores/bottle'
import { computed } from 'vue'

const props = defineProps({
  bottle: {
    type: Object,
    required: true
  }
})

const authStore = useAuthStore()
const bottleStore = useBottleStore()

const isOwner = computed(() => {
  return props.bottle.user_id === authStore.user?.id
})

const formattedDate = computed(() => {
  return new Date(props.bottle.created_at).toLocaleString()
})

const handleReply = async (content) => {
  try {
    await bottleStore.replyBottle(props.bottle.id, content)
  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <div class="bottle-card">
    <div class="header">
      <div class="user-info">
        <img :src="bottle.user.avatar" alt="avatar">
        <span class="username">{{ bottle.user.name }}</span>
      </div>
      <span class="date">{{ formattedDate }}</span>
    </div>

    <div class="content">
      {{ bottle.content }}
    </div>

    <div class="footer">
      <div class="stats">
        <span class="replies">
          {{ bottle.replies_count }} 回复
        </span>
        <span class="likes">
          {{ bottle.likes_count }} 喜欢
        </span>
      </div>

      <div class="actions">
        <button 
          v-if="!isOwner" 
          class="reply-btn"
          @click="$emit('reply')"
        >
          回复
        </button>
        <button 
          v-if="isOwner" 
          class="delete-btn"
          @click="$emit('delete')"
        >
          删除
        </button>
      </div>
    </div>

    <!-- 回复列表 -->
    <div v-if="bottle.replies?.length" class="replies-list">
      <div 
        v-for="reply in bottle.replies"
        :key="reply.id"
        class="reply-item"
      >
        <img :src="reply.user.avatar" alt="avatar">
        <div class="reply-content">
          <div class="reply-header">
            <span class="username">{{ reply.user.name }}</span>
            <span class="date">{{ new Date(reply.created_at).toLocaleString() }}</span>
          </div>
          <p>{{ reply.content }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bottle-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-info img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.username {
  font-weight: 500;
}

.date {
  color: #666;
  font-size: 0.9em;
}

.content {
  margin-bottom: 15px;
  line-height: 1.5;
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 15px;
  border-top: 1px solid #eee;
}

.stats {
  display: flex;
  gap: 15px;
  color: #666;
  font-size: 0.9em;
}

.actions {
  display: flex;
  gap: 10px;
}

.actions button {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.reply-btn {
  background: #2196F3;
  color: white;
}

.delete-btn {
  background: #f44336;
  color: white;
}

.replies-list {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #eee;
}

.reply-item {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.reply-item img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.reply-content {
  flex: 1;
}

.reply-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

.reply-header .username {
  font-weight: 500;
}

.reply-header .date {
  color: #666;
  font-size: 0.9em;
}

.reply-content p {
  margin: 0;
  color: #333;
}
</style> 