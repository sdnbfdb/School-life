<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useBottleStore } from '@/stores/bottle'

const router = useRouter()
const bottleStore = useBottleStore()

const form = ref({
  content: ''
})

const loading = ref(false)
const error = ref('')

const handleSubmit = async () => {
  if (!form.value.content.trim()) {
    error.value = '请输入内容'
    return
  }

  try {
    loading.value = true
    error.value = ''
    await bottleStore.createBottle(form.value)
    router.push('/bottles')
  } catch (err) {
    console.error('投放漂流瓶失败:', err)
    error.value = '投放失败，请稍后重试'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="new-bottle">
    <h2>投放漂流瓶</h2>
    
    <form @submit.prevent="handleSubmit" class="bottle-form">
      <div class="form-group">
        <label for="content">内容</label>
        <textarea
          id="content"
          v-model="form.content"
          rows="6"
          required
          placeholder="写下你想说的话..."
        ></textarea>
      </div>

      <div v-if="error" class="error">
        {{ error }}
      </div>

      <div class="actions">
        <button 
          type="button" 
          class="cancel-btn"
          @click="router.back()"
        >
          取消
        </button>
        <button 
          type="submit"
          class="submit-btn"
          :disabled="loading"
        >
          {{ loading ? '投放中...' : '投放漂流瓶' }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.new-bottle {
  max-width: 600px;
  margin: 0 auto;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}

.bottle-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

label {
  color: #666;
  font-size: 0.9em;
}

textarea {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  resize: vertical;
  min-height: 120px;
}

textarea:focus {
  outline: none;
  border-color: #2196F3;
}

.error {
  color: #f44336;
  font-size: 0.9em;
  text-align: center;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
}

.cancel-btn,
.submit-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.cancel-btn {
  background: #f5f5f5;
  color: #666;
}

.cancel-btn:hover {
  background: #e0e0e0;
}

.submit-btn {
  background: #4CAF50;
  color: white;
}

.submit-btn:hover {
  background: #388E3C;
}

.submit-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}
</style> 