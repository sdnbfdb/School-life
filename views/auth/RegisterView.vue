<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ElMessage } from 'element-plus'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  username: '',
  password: '',
  confirmPassword: ''
})

const loading = ref(false)
const error = ref('')

const handleSubmit = async () => {
  try {
    // 验证密码
    if (form.value.password !== form.value.confirmPassword) {
      error.value = '两次输入的密码不一致'
      return
    }

    loading.value = true
    error.value = ''
    
    // 移除 confirmPassword，只发送需要的数据
    const { confirmPassword, ...registerData } = form.value
    await authStore.register(registerData)
    ElMessage.success('注册成功')
    router.push('/auth/login')
  } catch (err) {
    console.error('Registration failed:', err)
    error.value = err.response?.data?.message || '注册失败'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="register">
    <h2>注册</h2>
    
    <form @submit.prevent="handleSubmit" class="register-form">
      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <div class="form-group">
        <label>用户名</label>
        <input 
          v-model="form.username"
          type="text"
          required
          placeholder="请输入用户名"
        >
      </div>

      <div class="form-group">
        <label>密码</label>
        <input 
          v-model="form.password"
          type="password"
          required
          placeholder="请输入密码"
        >
      </div>

      <div class="form-group">
        <label>确认密码</label>
        <input 
          v-model="form.confirmPassword"
          type="password"
          required
          placeholder="请再次输入密码"
        >
      </div>

      <button 
        type="submit"
        class="submit-btn"
        :disabled="loading"
      >
        {{ loading ? '注册中...' : '注册' }}
      </button>

      <div class="links">
        <router-link to="/auth/login">已有账号？立即登录</router-link>
      </div>
    </form>
  </div>
</template>

<style scoped>
.register {
  max-width: 400px;
  margin: 40px auto;
  padding: 20px;
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
}

.register-form {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #333;
}

.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.error-message {
  color: #f44336;
  margin-bottom: 20px;
  padding: 10px;
  background: #fdecea;
  border-radius: 4px;
}

.submit-btn {
  width: 100%;
  padding: 12px;
  background: #409EFF;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 20px;
}

.submit-btn:disabled {
  background: #a0cfff;
  cursor: not-allowed;
}

.links {
  text-align: center;
  font-size: 14px;
}

.links a {
  color: #409EFF;
  text-decoration: none;
}

.links a:hover {
  text-decoration: underline;
}
</style> 