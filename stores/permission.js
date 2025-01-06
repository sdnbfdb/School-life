import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api/config'

export const usePermissionStore = defineStore('permission', () => {
  const loading = ref(false)
  const error = ref('')
  const roles = ref([])
  const permissions = ref([])
  const userRoles = ref(new Map()) // 用户-角色映射

  // 获取所有角色
  const fetchRoles = async () => {
    try {
      loading.value = true
      const response = await api.get('/admin/roles')
      roles.value = response.data
    } catch (err) {
      console.error('获取角色列表失败:', err)
      error.value = '获取角色列表失败'
    } finally {
      loading.value = false
    }
  }

  // 获取所有权限
  const fetchPermissions = async () => {
    try {
      loading.value = true
      const response = await api.get('/admin/permissions')
      permissions.value = response.data
    } catch (err) {
      console.error('获取权限列表失败:', err)
      error.value = '获取权限列表失败'
    } finally {
      loading.value = false
    }
  }

  // 创建角色
  const createRole = async (roleData) => {
    try {
      const response = await api.post('/admin/roles', roleData)
      roles.value.push(response.data)
    } catch (err) {
      console.error('创建角色失败:', err)
      throw err
    }
  }

  // 更新角色
  const updateRole = async (roleData) => {
    try {
      await api.put(`/admin/roles/${roleData.id}`, roleData)
      const index = roles.value.findIndex(r => r.id === roleData.id)
      if (index !== -1) {
        roles.value[index] = roleData
      }
    } catch (err) {
      console.error('更新角色失败:', err)
      throw err
    }
  }

  // 删除角色
  const deleteRole = async (roleId) => {
    try {
      await api.delete(`/admin/roles/${roleId}`)
      roles.value = roles.value.filter(r => r.id !== roleId)
    } catch (err) {
      console.error('删除角色失败:', err)
      throw err
    }
  }

  // 分配用户角色
  const assignUserRoles = async (userId, roleIds) => {
    try {
      await api.post(`/admin/users/${userId}/roles`, { roleIds })
      userRoles.value.set(userId, roleIds)
    } catch (err) {
      console.error('分配用户角色失败:', err)
      throw err
    }
  }

  // 获取用户角色
  const fetchUserRoles = async (userId) => {
    try {
      const response = await api.get(`/admin/users/${userId}/roles`)
      userRoles.value.set(userId, response.data)
    } catch (err) {
      console.error('获取用户角色失败:', err)
      throw err
    }
  }

  return {
    loading,
    error,
    roles,
    permissions,
    userRoles,
    fetchRoles,
    fetchPermissions,
    createRole,
    updateRole,
    deleteRole,
    assignUserRoles,
    fetchUserRoles
  }
}) 