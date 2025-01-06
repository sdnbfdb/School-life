<script setup>
import { ref } from 'vue'
import { usePermissionStore } from '@/stores/permission'

const permissionStore = usePermissionStore()
const editingRole = ref(null)
const showDialog = ref(false)

const handleEdit = (role) => {
  editingRole.value = { ...role }
  showDialog.value = true
}

const handleDelete = async (roleId) => {
  if (!confirm('确定要删除该角色吗？')) return
  try {
    await permissionStore.deleteRole(roleId)
  } catch (error) {
    console.error(error)
  }
}

const handleCreate = () => {
  editingRole.value = { name: '', description: '', permissions: [] }
  showDialog.value = true
}

const handleSave = async () => {
  try {
    if (editingRole.value.id) {
      await permissionStore.updateRole(editingRole.value)
    } else {
      await permissionStore.createRole(editingRole.value)
    }
    showDialog.value = false
  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <div class="role-list">
    <div class="header">
      <h3>角色管理</h3>
      <button class="create-btn" @click="handleCreate">新建角色</button>
    </div>

    <table>
      <thead>
        <tr>
          <th>角色名称</th>
          <th>描述</th>
          <th>权限数量</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="role in permissionStore.roles" :key="role.id">
          <td>{{ role.name }}</td>
          <td>{{ role.description }}</td>
          <td>{{ role.permissions.length }}</td>
          <td>
            <button class="edit-btn" @click="handleEdit(role)">编辑</button>
            <button class="delete-btn" @click="handleDelete(role.id)">删除</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- 角色编辑对话框 -->
    <div v-if="showDialog" class="dialog-overlay">
      <div class="dialog">
        <h3>{{ editingRole.id ? '编辑角色' : '新建角色' }}</h3>
        <form @submit.prevent="handleSave">
          <div class="form-group">
            <label>角色名称</label>
            <input v-model="editingRole.name" required>
          </div>
          <div class="form-group">
            <label>描述</label>
            <textarea v-model="editingRole.description"></textarea>
          </div>
          <div class="form-group">
            <label>权限</label>
            <div class="permissions-list">
              <label v-for="perm in permissionStore.permissions" :key="perm.id">
                <input 
                  type="checkbox"
                  v-model="editingRole.permissions"
                  :value="perm.id"
                >
                {{ perm.name }}
              </label>
            </div>
          </div>
          <div class="dialog-actions">
            <button type="button" @click="showDialog = false">取消</button>
            <button type="submit">保存</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.role-list {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.edit-btn,
.delete-btn {
  padding: 4px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 8px;
}

.edit-btn {
  background-color: #2196F3;
  color: white;
}

.delete-btn {
  background-color: #f44336;
  color: white;
}

.create-btn {
  padding: 8px 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

/* 对话框样式 */
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.dialog {
  background: white;
  border-radius: 8px;
  padding: 20px;
  width: 90%;
  max-width: 500px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.permissions-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 10px;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style> 