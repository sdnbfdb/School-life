<script setup>
import { ref, computed } from 'vue'
import { usePermissionStore } from '@/stores/permission'
import { useUserStore } from '@/stores/user'

const permissionStore = usePermissionStore()
const userStore = useUserStore()
const searchQuery = ref('')
const selectedUser = ref(null)

const searchUsers = async () => {
  if (!searchQuery.value.trim()) return
  try {
    await userStore.searchUsers(searchQuery.value)
  } catch (error) {
    console.error(error)
  }
}

const handleUserSelect = (user) => {
  selectedUser.value = user
  searchQuery.value = ''
}

const handleRoleChange = async (roleId) => {
  if (!selectedUser.value) return
  try {
    await permissionStore.assignUserRoles(
      selectedUser.value.id,
      permissionStore.userRoles.get(selectedUser.value.id) || []
    )
  } catch (error) {
    console.error(error)
  }
}

const userRoles = computed({
  get: () => permissionStore.userRoles.get(selectedUser.value?.id) || [],
  set: (newRoles) => {
    if (selectedUser.value) {
      permissionStore.userRoles.set(selectedUser.value.id, newRoles)
      handleRoleChange()
    }
  }
})
</script>

<template>
  <div class="user-role-assignment">
    <h3>用户角色分配</h3>

    <div class="search-section">
      <div class="search-box">
        <input 
          v-model="searchQuery"
          placeholder="搜索用户..."
          @keyup.enter="searchUsers"
        >
        <button @click="searchUsers">搜索</button>
      </div>

      <div v-if="userStore.searchResults.length > 0" class="search-results">
        <div 
          v-for="user in userStore.searchResults"
          :key="user.id"
          class="user-item"
          @click="handleUserSelect(user)"
        >
          {{ user.name }} ({{ user.email }})
        </div>
      </div>
    </div>

    <div v-if="selectedUser" class="role-assignment">
      <h4>为 {{ selectedUser.name }} 分配角色</h4>
      
      <div class="roles-list">
        <label v-for="role in permissionStore.roles" :key="role.id">
          <input 
            type="checkbox"
            v-model="userRoles"
            :value="role.id"
            @change="handleRoleChange"
          >
          {{ role.name }}
        </label>
      </div>
    </div>
  </div>
</template>

<style scoped>
.user-role-assignment {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.search-section {
  margin: 20px 0;
}

.search-box {
  display: flex;
  gap: 10px;
}

.search-box input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.search-box button {
  padding: 8px 16px;
  background: #2196F3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.search-results {
  margin-top: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  max-height: 200px;
  overflow-y: auto;
}

.user-item {
  padding: 8px;
  cursor: pointer;
  border-bottom: 1px solid #eee;
}

.user-item:hover {
  background: #f5f5f5;
}

.role-assignment {
  margin-top: 20px;
}

.roles-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 10px;
  margin-top: 10px;
}
</style> 