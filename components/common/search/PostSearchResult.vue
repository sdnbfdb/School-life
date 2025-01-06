<template>
  <div class="search-result-item" @click="handleClick">
    <div class="title">{{ item.title }}</div>
    <div class="content">{{ item.content }}</div>
    <div class="meta">
      <span class="author">{{ item.author_name }}</span>
      <span class="time">{{ formatTime(item.created_at) }}</span>
    </div>
  </div>
</template>

<script setup>
import { formatTime } from '@/utils/time'

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['select'])

const handleClick = () => {
  emit('select', props.item)
}
</script>

<style scoped>
.search-result-item {
  padding: 12px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
}

.search-result-item:hover {
  background: #f5f5f5;
}

.title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 8px;
}

.content {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.meta {
  font-size: 12px;
  color: #999;
}

.author {
  margin-right: 12px;
}
</style> 