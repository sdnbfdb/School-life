<script setup>
import { ref, onMounted } from 'vue'
import { useBottleStore } from '@/stores/bottle'
import { useAuthStore } from '@/stores/auth'
import BottleCard from '@/components/bottles/card/BottleCard.vue'

const bottleStore = useBottleStore()
const authStore = useAuthStore()

const loading = ref(false)
const error = ref('')

onMounted(async () => {
  await fetchBottles()
})

const fetchBottles = async () => {
  try {
    loading.value = true
    await bottleStore.fetchBottles()
  } catch (err) {
    console.error('获取漂流瓶失败:', err)
    error.value = '获取漂流瓶失败'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="bottles">
    <div class="header">
      <h2>漂流瓶</h2>
      <button 
        v-if="authStore.isAuthenticated"
        class="throw-btn"
        @click="$router.push('/bottles/new')"
      >
        扔一个漂流瓶
      </button>
    </div>

    <div v-if="loading" class="loading">
      加载中...
    </div>
    
    <div v-else-if="error" class="error">
      {{ error }}
    </div>
    
    <div v-else-if="bottleStore.bottles.length" class="bottles-grid">
      <BottleCard
        v-for="bottle in bottleStore.bottles"
        :key="bottle.id"
        :bottle="bottle"
      />
    </div>
    
    <div v-else class="empty">
      还没有漂流瓶，快来扔一个吧！
    </div>
  </div>
</template>

<style scoped>
.bottles {
  width: 100%;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

h2 {
  margin: 0;
  color: #333;
}

.throw-btn {
  padding: 8px 16px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.throw-btn:hover {
  background: #388E3C;
}

.bottles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.loading,
.error,
.empty {
  text-align: center;
  padding: 40px;
  color: #666;
}

.error {
  color: #f44336;
}
</style> 