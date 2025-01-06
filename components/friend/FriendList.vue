<script setup>
import { onMounted } from 'vue'
import { useFriendStore } from '@/stores/friend'
import { useChatStore } from '@/stores/chat'

const friendStore = useFriendStore()
const chatStore = useChatStore()

onMounted(() => {
  friendStore.fetchFriends()
  friendStore.fetchRequests()
})

const startChat = async (friendId) => {
  try {
    const conversation = await chatStore.createConversation(friendId)
    // 导航到聊天页面
    router.push({
      name: 'chat',
      params: { id: conversation.id }
    })
  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <div class="friend-list">
    <!-- 好友请求 -->
    <div v-if="friendStore.requests.length > 0" class="friend-requests">
      <h4>好友请求</h4>
      <div 
        v-for="request in friendStore.requests"
        :key="request.id"
        class="request-item"
      >
        <img :src="request.sender.avatar" alt="avatar">
        <span>{{ request.sender.name }}</span>
        <div class="actions">
          <button @click="friendStore.acceptRequest(request.id)">接受</button>
          <button @click="friendStore.rejectRequest(request.id)">拒绝</button>
        </div>
      </div>
    </div>

    <!-- 好友列表 -->
    <div class="friends">
      <h4>我的好友</h4>
      <div 
        v-for="friend in friendStore.friends"
        :key="friend.id"
        class="friend-item"
      >
        <img :src="friend.avatar" alt="avatar">
        <div class="info">
          <span class="name">{{ friend.name }}</span>
          <span class="status" :class="{ online: friend.online }">
            {{ friend.online ? '在线' : '离线' }}
          </span>
        </div>
        <div class="actions">
          <button @click="startChat(friend.id)">发消息</button>
          <button @click="friendStore.removeFriend(friend.id)">删除</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.friend-list {
  padding: 20px;
}

.friend-requests {
  margin-bottom: 20px;
}

.request-item,
.friend-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.request-item img,
.friend-item img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}

.info {
  flex: 1;
}

.name {
  display: block;
  font-weight: 500;
}

.status {
  font-size: 0.9em;
  color: #666;
}

.status.online {
  color: #4CAF50;
}

.actions {
  display: flex;
  gap: 8px;
}

.actions button {
  padding: 4px 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.actions button:first-child {
  background: #2196F3;
  color: white;
}

.actions button:last-child {
  background: #f44336;
  color: white;
}
</style> 