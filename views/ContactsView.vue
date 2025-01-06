<script setup>
import { ref } from 'vue'
import { useFriendStore } from '@/stores/friend'
import FriendList from '@/components/friend/FriendList.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const friendStore = useFriendStore()

const searchQuery = ref('')
const showAddFriend = ref(false)

const searchFriends = async () => {
  if (!searchQuery.value.trim()) return
  try {
    await friendStore.searchUsers(searchQuery.value)
  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <div class="contacts-view">
    <template v-if="authStore.isAuthenticated">
      <!-- 搜索框 -->
      <div class="search-bar">
        <input 
          v-model="searchQuery"
          placeholder="搜索用户"
          @keyup.enter="searchFriends"
        >
        <button @click="searchFriends">搜索</button>
      </div>

      <!-- 好友列表 -->
      <FriendList />

      <!-- 添加好友对话框 -->
      <div v-if="showAddFriend" class="add-friend-dialog">
        <!-- 搜索结果列表 -->
        <div 
          v-for="user in friendStore.searchResults"
          :key="user.id"
          class="user-item"
        >
          <img :src="user.avatar" alt="avatar">
          <div class="info">
            <span class="name">{{ user.name }}</span>
            <span class="bio">{{ user.bio }}</span>
          </div>
          <button @click="friendStore.sendRequest(user.id)">
            加为好友
          </button>
        </div>
      </div>
    </template>

    <div v-else class="login-tip">
      请先<router-link to="/my">登录</router-link>后查看通讯录
    </div>
  </div>
</template>

<style scoped>
.contacts-view {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.search-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.search-bar input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.search-bar button {
  padding: 8px 16px;
  background: #2196F3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.add-friend-dialog {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 500px;
}

.user-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.user-item img {
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

.bio {
  font-size: 0.9em;
  color: #666;
}

.login-tip {
  text-align: center;
  padding: 40px;
  color: #666;
}

.login-tip a {
  color: #2196F3;
  text-decoration: none;
}
</style> 