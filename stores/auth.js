import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/api/config'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('token'))
  const redirectPath = ref('/')
  
  const isAuthenticated = computed(() => !!token.value)

  // 设置重定向路径
  const setRedirectPath = (path) => {
    redirectPath.value = path
  }

  // 登录
  const login = async (credentials) => {
    try {
      console.log('Sending login request:', credentials)
      const response = await api.post('/api/auth/login', credentials)
      console.log('Login response:', response.data)
      
      if (!response?.data?.token) {
        throw new Error('登录失败：未收到有效的令牌')
      }

      token.value = response.data.token
      user.value = response.data.user
      localStorage.setItem('token', token.value)

      return response.data
    } catch (err) {
      console.error('Login failed:', err)
      throw err
    }
  }

  // 注册
  const register = async (userData) => {
    try {
      console.log('Sending register request:', userData)
      const response = await api.post('/api/auth/register', {
        username: userData.username,
        password: userData.password,
        email: userData.email || null
      })
      console.log('Register response:', response.data)
      return response.data
    } catch (err) {
      console.error('Registration failed:', err)
      throw err
    }
  }

  // 登出
  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
    delete api.defaults.headers.common['Authorization']
  }

  // 获取用户信息
  const fetchUserInfo = async () => {
    try {
      if (!token.value) return null

      const response = await api.get('/api/auth/me')
      user.value = response.data
      return response.data
    } catch (err) {
      console.error('Failed to fetch user info:', err)
      if (err.response?.status === 401) {
        logout()
      }
      throw err
    }
  }

  // 更新用户信息
  const updateUserInfo = async (userData) => {
    try {
      const response = await api.put('/auth/profile', userData)
      user.value = response.data
      return response.data
    } catch (err) {
      console.error('Failed to update user info:', err)
      throw err
    }
  }

  // 初始化认证状态
  const initAuth = async () => {
    if (token.value) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
      try {
        await fetchUserInfo()
      } catch (err) {
        console.error('Failed to initialize auth:', err)
        logout()
      }
    }
  }

  return {
    user,
    token,
    redirectPath,
    isAuthenticated,
    setRedirectPath,
    login,
    register,
    logout,
    fetchUserInfo,
    updateUserInfo,
    initAuth
  }
}) 