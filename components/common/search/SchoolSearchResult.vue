<template>
  <div class="search-result-item" @click="handleClick">
    <div class="title">{{ item.name }}</div>
    <div class="content">{{ item.description }}</div>
    <div class="meta">
      <span class="location">{{ item.location }}</span>
      <span class="type">{{ item.type }}</span>
    </div>
  </div>
</template>

<script setup>
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

.location {
  margin-right: 12px;
}
</style> 