<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ElMessage } from 'element-plus'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  username: '',
  password: ''
})

const loading = ref(false)
const error = ref('')

const handleSubmit = async () => {
  try {
    loading.value = true
    error.value = ''
    
    await authStore.login(form.value)
    ElMessage.success('登录成功')
    router.push(authStore.redirectPath || '/')
  } catch (err) {
    console.error('Login failed:', err)
    error.value = err.response?.data?.message || '登录失败'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login">
    <h2>登录</h2>
    
    <form @submit.prevent="handleSubmit" class="login-form">
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

      <button 
        type="submit"
        class="submit-btn"
        :disabled="loading"
      >
        {{ loading ? '登录中...' : '登录' }}
      </button>

      <div class="links">
        <router-link to="/auth/register">没有账号？立即注册</router-link>
        <router-link to="/auth/forgot-password">忘记密码？</router-link>
      </div>
    </form>
  </div>
</template>

<style scoped>
.login {
  max-width: 400px;
  margin: 40px auto;
  padding: 20px;
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
}

.login-form {
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
  display: flex;
  justify-content: space-between;
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