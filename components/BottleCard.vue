<template>
  <div class="bottle-card" v-if="isValidBottle">
    <div class="user-info">
      <img 
        :src="authorAvatar" 
        :alt="authorName"
        class="avatar"
        @error="handleImageError"
      />
      <span class="author-name">{{ authorName }}</span>
    </div>
    <div class="content">
      {{ bottleContent }}
    </div>
    <div class="actions">
      <span class="time">{{ formatTime(bottleCreatedAt) }}</span>
      <span class="replies">{{ repliesCount }} 回复</span>
      <span class="likes">{{ likesCount }} 点赞</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { formatTime } from '@/utils/time'

/** @typedef {import('@/stores/bottle').Bottle} Bottle */

const props = defineProps({
  /** @type {import('vue').PropType<Bottle>} */
  bottle: {
    type: Object,
    required: true
  }
})

const isValidBottle = computed(() => {
  return props.bottle && 
         typeof props.bottle === 'object' &&
         'id' in props.bottle &&
         'content' in props.bottle &&
         'created_at' in props.bottle &&
         'avatar' in props.bottle
})

const bottleContent = computed(() => isValidBottle.value ? props.bottle.content : '')
const bottleCreatedAt = computed(() => isValidBottle.value ? props.bottle.created_at : '')
const authorName = computed(() => isValidBottle.value ? props.bottle.author_name : '匿名用户')
const authorAvatar = computed(() => isValidBottle.value ? props.bottle.avatar : '/default-avatar.png')
const repliesCount = computed(() => isValidBottle.value ? props.bottle.replies_count : 0)
const likesCount = computed(() => isValidBottle.value ? props.bottle.likes_count : 0)

const handleImageError = (e) => {
  const imgElement = /** @type {HTMLImageElement} */ (e.target)
  imgElement.src = '/default-avatar.png'
}
</script>

<style scoped>
.bottle-card {
  background: white;
  border: 1px solid #eee;
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.user-info {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 10px;
  object-fit: cover;
  background-color: #f5f5f5;
}

.author-name {
  font-weight: 500;
  color: #333;
}

.content {
  margin: 10px 0;
  color: #666;
  white-space: pre-wrap;
  word-break: break-word;
}

.actions {
  display: flex;
  gap: 15px;
  color: #999;
  font-size: 0.9em;
}

.time {
  color: #999;
}

.replies, .likes {
  cursor: pointer;
}

.replies:hover, .likes:hover {
  color: #1976d2;
}
</style> 