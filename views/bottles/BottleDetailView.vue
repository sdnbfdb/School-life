<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useBottleStore } from '@/stores/bottle'
import BottleCard from '@/components/bottles/BottleCard.vue'

const route = useRoute()
const bottleStore = useBottleStore()

const loading = ref(false)
const error = ref('')
const bottle = ref(null)

onMounted(async () => {
  try {
    loading.value = true
    bottle.value = await bottleStore.fetchBottleById(route.params.id)
  } catch (err) {
    console.error('获取漂流瓶详情失败:', err)
    error.value = '获取漂流瓶详情失败'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="bottle-detail">
    <div v-if="loading" class="loading">
      加载中...
    </div>
    
    <div v-else-if="error" class="error">
      {{ error }}
    </div>
    
    <div v-else-if="bottle" class="content">
      <BottleCard :bottle="bottle" />
    </div>
    
    <div v-else class="not-found">
      漂流瓶不存在或已被删除
    </div>
  </div>
</template>

<style scoped>
.bottle-detail {
  max-width: 600px;
  margin: 0 auto;
}

.loading,
.error,
.not-found {
  text-align: center;
  padding: 40px;
  color: #666;
}

.error {
  color: #f44336;
}
</style> 