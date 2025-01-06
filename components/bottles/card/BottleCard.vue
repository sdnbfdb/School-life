<template>
  <div class="bottle-card">
    <div class="bottle-content">
      <div class="bottle-header">
        <div class="user-info">
          <el-avatar :size="32" :src="bottle.user?.avatar || '/default-avatar.png'" />
          <span class="username">{{ bottle.user?.username || '匿名用户' }}</span>
        </div>
        <span class="time">{{ formatTime(bottle.created_at) }}</span>
      </div>
      
      <p class="message">{{ bottle.message }}</p>
      
      <div class="bottle-footer">
        <div class="actions">
          <el-button 
            type="text" 
            size="small"
            @click="handleReply"
          >
            <el-icon><ChatLineRound /></el-icon>
            回复 ({{ bottle.reply_count || 0 }})
          </el-button>
          
          <el-button 
            type="text" 
            size="small"
            @click="handleLike"
            :class="{ 'liked': bottle.is_liked }"
          >
            <el-icon><Star /></el-icon>
            收藏 ({{ bottle.like_count || 0 }})
          </el-button>
        </div>
        
        <el-button 
          v-if="isOwner"
          type="text" 
          size="small"
          @click="handleDelete"
        >
          <el-icon><Delete /></el-icon>
          删除
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useBottleStore } from '@/stores/bottle'
import { ElMessageBox } from 'element-plus'
import { formatTime } from '@/utils/time'

const props = defineProps({
  bottle: {
    type: Object,
    required: true
  }
})

const authStore = useAuthStore()
const bottleStore = useBottleStore()

// 检查是否是漂流瓶的发布者
const isOwner = computed(() => {
  return authStore.user?.id === props.bottle.user_id
})

// 处理回复
const handleReply = () => {
  // TODO: 实现回复功能
}

// 处理收藏
const handleLike = async () => {
  try {
    if (!authStore.isAuthenticated) {
      ElMessageBox.alert('请先登录', '提示', {
        confirmButtonText: '确定'
      })
      return
    }
    
    await bottleStore.likeBottle(props.bottle.id)
  } catch (err) {
    console.error('收藏失败:', err)
  }
}

// 处理删除
const handleDelete = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要删除这个漂流瓶吗？',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    await bottleStore.deleteBottle(props.bottle.id)
  } catch (err) {
    if (err !== 'cancel') {
      console.error('删除失败:', err)
    }
  }
}
</script>

<style scoped>
.bottle-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.bottle-card:hover {
  transform: translateY(-2px);
}

.bottle-content {
  padding: 20px;
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
  gap: 8px;
}

.username {
  font-weight: 500;
}

.time {
  color: #999;
  font-size: 0.9em;
}

.message {
  margin: 12px 0;
  line-height: 1.5;
  white-space: pre-wrap;
}

.bottle-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #eee;
}

.actions {
  display: flex;
  gap: 16px;
}

.el-button.liked {
  color: #e6a23c;
}
</style> 