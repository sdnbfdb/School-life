<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const props = defineProps({
  bottle: {
    type: Object,
    required: true,
    default: () => ({
      content: '',
      user: {
        id: 0,
        username: '匿名用户',
        avatar: '/default-avatar.png'
      },
      createdAt: new Date().toISOString(),
      replyCount: 0,
      likeCount: 0
    })
  }
})

const authStore = useAuthStore()

// 计算属性：获取用户头像
const userAvatar = computed(() => {
  if (!props.bottle?.user) {
    console.warn('Bottle user is undefined:', props.bottle)
    return '/default-avatar.png'
  }
  return props.bottle.user.avatar || '/default-avatar.png'
})

// 计算属性：获取用户名
const username = computed(() => {
  if (!props.bottle?.user) {
    return '匿名用户'
  }
  return props.bottle.user.username || '匿名用户'
})

// 计算属性：格式化时间
const formattedDate = computed(() => {
  if (!props.bottle?.createdAt) return ''
  try {
    const date = new Date(props.bottle.createdAt)
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch (err) {
    console.error('Invalid date:', props.bottle.createdAt)
    return ''
  }
})

// 计算属性：是否是当前用户的漂流瓶
const isOwner = computed(() => {
  if (!authStore.isAuthenticated || !props.bottle?.user) {
    return false
  }
  return props.bottle.user.id === authStore.user?.id
})

// 计算属性：回复数量
const replyCount = computed(() => {
  return props.bottle?.replyCount || 0
})

// 计算属性：点赞数量
const likeCount = computed(() => {
  return props.bottle?.likeCount || 0
})
</script>

<template>
  <div class="bottle-card">
    <div class="bottle-header">
      <div class="user-info">
        <img :src="userAvatar" :alt="username" class="avatar">
        <div class="user-details">
          <span class="username">{{ username }}</span>
          <span class="date">{{ formattedDate }}</span>
        </div>
      </div>
      <div v-if="isOwner" class="actions">
        <button class="delete-btn">删除</button>
      </div>
    </div>
    
    <div class="bottle-content">
      {{ bottle?.content || '内容已被删除' }}
    </div>
    
    <div class="bottle-footer">
      <div class="stats">
        <span class="replies-count">
          {{ replyCount }} 回复
        </span>
        <span class="likes-count">
          {{ likeCount }} 点赞
        </span>
      </div>
      <div class="actions">
        <button class="action-btn">回复</button>
        <button class="action-btn">点赞</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bottle-card {
  background: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.bottle-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.username {
  font-weight: 500;
  color: #333;
}

.date {
  font-size: 0.9em;
  color: #666;
}

.bottle-content {
  margin: 12px 0;
  color: #333;
  line-height: 1.5;
}

.bottle-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #eee;
}

.stats {
  display: flex;
  gap: 16px;
  color: #666;
  font-size: 0.9em;
}

.actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  padding: 6px 12px;
  border: none;
  background: #f5f5f5;
  color: #666;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.action-btn:hover {
  background: #e0e0e0;
  color: #333;
}

.delete-btn {
  padding: 4px 8px;
  border: none;
  background: #fee;
  color: #f44336;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9em;
  transition: all 0.3s;
}

.delete-btn:hover {
  background: #f44336;
  color: white;
}
</style> 