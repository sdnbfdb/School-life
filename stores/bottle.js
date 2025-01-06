import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api/config'

/**
 * @typedef {Object} Bottle
 * @property {number} id - 漂流瓶ID
 * @property {string} content - 漂流瓶内容
 * @property {string} created_at - 创建时间
 * @property {string} author_name - 作者名称
 * @property {string} avatar - 作者头像
 * @property {number} replies_count - 回复数量
 * @property {number} likes_count - 点赞数量
 */

const DEFAULT_BOTTLE = {
  id: 0,
  content: '',
  created_at: new Date().toISOString(),
  author_name: '匿名用户',
  avatar: '/default-avatar.png',
  replies_count: 0,
  likes_count: 0
}

/**
 * 检查是否为有效的 API 响应
 * @param {any} response - API 响应对象
 * @returns {boolean} - 是否为有效响应
 */
const isApiResponse = (response) => {
  return response && 
         typeof response === 'object' && 
         'data' in response
}

export const useBottleStore = defineStore('bottle', () => {
  /** @type {import('vue').Ref<Bottle[]>} */
  const bottles = ref([])
  const loading = ref(false)
  const error = ref(null)

  /**
   * 将原始数据转换为标准的 Bottle 对象
   * @param {any} data - 原始数据
   * @returns {Bottle}
   */
  const normalizeBottle = (data) => {
    return {
      id: data?.id ?? DEFAULT_BOTTLE.id,
      content: data?.content ?? DEFAULT_BOTTLE.content,
      created_at: data?.created_at ?? DEFAULT_BOTTLE.created_at,
      author_name: data?.author_name ?? DEFAULT_BOTTLE.author_name,
      avatar: data?.avatar ?? DEFAULT_BOTTLE.avatar,
      replies_count: data?.replies_count ?? DEFAULT_BOTTLE.replies_count,
      likes_count: data?.likes_count ?? DEFAULT_BOTTLE.likes_count
    }
  }

  /**
   * 获取漂流瓶列表
   */
  const fetchBottles = async () => {
    try {
      loading.value = true
      error.value = ''
      const response = await api.get('/api/bottles')
      bottles.value = response.data
    } catch (err) {
      console.error('获取漂流瓶列表失败:', err)
      error.value = '获取漂流瓶列表失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * 获取单个漂流瓶
   * @param {number} id - 漂流瓶ID
   * @returns {Promise<Bottle>}
   */
  const fetchBottleById = async (id) => {
    try {
      loading.value = true
      error.value = null
      const response = await api.get(`/bottles/${id}`)
      return response.data
    } catch (err) {
      console.error('获取漂流瓶详情失败:', err)
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * 投放漂流瓶
   * @param {Bottle} bottleData - 漂流瓶数据
   * @returns {Promise<Bottle>}
   */
  const createBottle = async (bottleData) => {
    try {
      loading.value = true
      error.value = null
      const response = await api.post('/bottles', bottleData)
      bottles.value.unshift(response.data)
      return response.data
    } catch (err) {
      console.error('投放漂流瓶失败:', err)
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * 回复漂流瓶
   * @param {number} bottleId - 漂流瓶ID
   * @param {string} content - 回复内容
   * @returns {Promise<any>}
   */
  const replyBottle = async (bottleId, content) => {
    try {
      loading.value = true
      const response = await api.post(`/api/bottles/${bottleId}/replies`, { content })
      if (!isApiResponse(response)) {
        throw new Error('Invalid response format')
      }
      return response.data
    } catch (/** @type {unknown} */ error) {
      console.error('回复漂流瓶失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  /**
   * 点赞漂流瓶
   * @param {number} bottleId - 漂流瓶ID
   * @returns {Promise<any>}
   */
  const likeBottle = async (bottleId) => {
    try {
      loading.value = true
      const response = await api.post(`/api/bottles/${bottleId}/likes`)
      if (!isApiResponse(response)) {
        throw new Error('Invalid response format')
      }
      return response.data
    } catch (/** @type {unknown} */ error) {
      console.error('点赞漂流瓶失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    bottles,
    loading,
    error,
    fetchBottles,
    fetchBottleById,
    createBottle,
    replyBottle,
    likeBottle
  }
}) 