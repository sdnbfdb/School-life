import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api/config'

export const useMarketplaceStore = defineStore('marketplace', () => {
  const items = ref([])
  const loading = ref(false)
  const error = ref('')

  const fetchItems = async () => {
    try {
      loading.value = true
      error.value = ''
      const response = await api.get('/api/marketplace')
      items.value = response.data
    } catch (err) {
      console.error('Failed to fetch items:', err)
      error.value = '获取商品列表失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  const createItem = async (itemData) => {
    return createListing(itemData)
  }

  const initTestData = async () => {
    try {
      loading.value = true
      error.value = ''
      
      const testItems = [
        {
          title: '二手笔记本电脑',
          price: 2999,
          description: '联想ThinkPad X1 Carbon，95新',
          images: ['/images/laptop.jpg'],
          category: '电子产品',
          item_condition: '九成新',
          status: 'active'
        },
        {
          title: '自行车',
          price: 599,
          description: '捷安特山地车，骑行不到100公里',
          images: ['/images/bike.jpg'],
          category: '运动户外',
          item_condition: '良好',
          status: 'active'
        },
        {
          title: '课本教材',
          price: 50,
          description: '计算机专业教材一套，含笔记',
          images: ['/images/books.jpg'],
          category: '图书教材',
          item_condition: '良好',
          status: 'active'
        }
      ]

      // 批量创建测试数据
      await Promise.all(testItems.map(item => createItem(item)))

      // 重新获取商品列表
      await fetchItems()

      console.log('Marketplace test data initialized')
    } catch (err) {
      console.error('Failed to init marketplace test data:', err)
      error.value = '初始化测试数据失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  const createListing = async (listingData) => {
    try {
      // 确保所有字段都有值或为 null
      const formData = {
        title: listingData.title || '',
        description: listingData.description || '',
        price: Number(listingData.price) || 0,
        category: listingData.category || 'other',
        condition_status: listingData.condition_status || 'good',
        images: listingData.images || null,
        status: 'active'
      }

      console.log('Creating listing with data:', formData)
      const response = await api.post('/api/marketplace', formData)
      console.log('Create listing response:', response.data)

      // 更新商品列表
      items.value.unshift(response.data.listing)
      return response.data
    } catch (err) {
      console.error('Failed to create listing:', err)
      throw err
    }
  }

  return {
    items,
    loading,
    error,
    fetchItems,
    createItem,
    initTestData,
    createListing
  }
}) 