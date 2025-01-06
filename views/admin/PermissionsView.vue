<script setup>
import { onMounted } from 'vue'
import { usePermissionStore } from '@/stores/permission'
import RoleList from '@/components/admin/RoleList.vue'
import UserRoleAssignment from '@/components/admin/UserRoleAssignment.vue'

const permissionStore = usePermissionStore()

onMounted(() => {
  permissionStore.fetchRoles()
  permissionStore.fetchPermissions()
})
</script>

<template>
  <div class="permissions-view">
    <h2>权限管理</h2>

    <div v-if="permissionStore.loading" class="loading">
      加载中...
    </div>

    <div v-else-if="permissionStore.error" class="error">
      {{ permissionStore.error }}
    </div>

    <div v-else class="content">
      <!-- 角色管理 -->
      <RoleList />

      <!-- 用户角色分配 -->
      <UserRoleAssignment />
    </div>
  </div>
</template>

<style scoped>
.permissions-view {
  padding: 20px;
}

.content {
  display: grid;
  gap: 20px;
  margin-top: 20px;
}

.loading,
.error {
  text-align: center;
  padding: 40px;
  color: #666;
}

.error {
  color: #f44336;
}
</style> 