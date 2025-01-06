<template>
  <div class="listing-card">
    <div class="image">
      <img :src="firstImage" :alt="listing.title">
    </div>
    <div class="content">
      <h3 class="title">{{ listing.title }}</h3>
      <p class="price">¥{{ formattedPrice }}</p>
      <p class="description">{{ truncatedDescription }}</p>
      <div class="meta">
        <span class="condition">{{ conditionText }}</span>
        <span class="time">{{ formatTime(listing.created_at) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { formatTime } from '@/utils/time'

const props = defineProps({
  listing: {
    type: Object,
    required: true,
    default: () => ({
      title: '',
      price: 0,
      description: '',
      condition_type: 'good',
      images: '[]',
      created_at: new Date()
    })
  }
})

const formattedPrice = computed(() => {
  const price = Number(props.listing.price)
  return isNaN(price) ? '0.00' : price.toFixed(2)
})

const firstImage = computed(() => {
  try {
    const images = JSON.parse(props.listing.images || '[]')
    return images[0] || '/placeholder-image.png'
  } catch {
    return '/placeholder-image.png'
  }
})

const truncatedDescription = computed(() => {
  return props.listing.description?.slice(0, 100) + (props.listing.description?.length > 100 ? '...' : '') || ''
})

const conditionMap = {
  new: '全新',
  like_new: '几乎全新',
  good: '良好',
  fair: '一般',
  poor: '较差'
}

const conditionText = computed(() => {
  return conditionMap[props.listing.condition_type] || '未知'
})
</script>

<style scoped>
.listing-card {
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s;
  background: white;
}

.listing-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
}

.image {
  aspect-ratio: 4/3;
  overflow: hidden;
}

.image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.content {
  padding: 12px;
}

.title {
  margin: 0 0 8px;
  font-size: 1.1em;
  font-weight: 500;
}

.price {
  color: #f56c6c;
  font-size: 1.2em;
  font-weight: bold;
  margin: 8px 0;
}

.description {
  color: #666;
  font-size: 0.9em;
  margin: 8px 0;
  line-height: 1.4;
}

.meta {
  display: flex;
  justify-content: space-between;
  color: #999;
  font-size: 0.8em;
  margin-top: 8px;
}

.condition {
  padding: 2px 6px;
  background: #f5f7fa;
  border-radius: 4px;
}
</style> 