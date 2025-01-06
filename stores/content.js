import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuthStore } from './auth'
import api from '@/api/config'

export const useContentStore = defineStore('content', () => {
  const authStore = useAuthStore()
  const loading = ref(false)
  const error = ref('')

  // 文章列表
  const posts = ref([])
  const totalPosts = ref(0)
  const currentPage = ref(1)
  const pageSize = ref(10)

  // 评论列表
  const comments = ref([])
  const totalComments = ref(0)

  // 待审核内容
  const pendingPosts = ref([])
  const pendingComments = ref([])

  // 获取文章列表
  const fetchPosts = async (filters = {}) => {
    try {
      loading.value = true
      const response = await api.get('/posts', {
        params: {
          page: currentPage.value,
          per_page: pageSize.value,
          ...filters
        }
      })
      posts.value = response.data.items
      totalPosts.value = response.data.total
    } catch (err) {
      console.error('获取文章列表失败:', err)
      error.value = '获取文章失败'
    } finally {
      loading.value = false
    }
  }

  // 创建文章
  const createPost = async (postData) => {
    try {
      loading.value = true
      const response = await api.post('/posts', postData)
      posts.value.unshift(response.data)
      totalPosts.value++
      return response.data
    } catch (err) {
      console.error('创建文章失败:', err)
      error.value = '创建文章失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  // 更新文章
  const updatePost = async (postId, postData) => {
    try {
      loading.value = true
      const response = await api.put(`/posts/${postId}`, postData)
      const index = posts.value.findIndex(p => p.id === postId)
      if (index !== -1) {
        posts.value[index] = response.data
      }
      return response.data
    } catch (err) {
      console.error('更新文章失败:', err)
      error.value = '更新文章失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  // 删除文章
  const deletePost = async (postId) => {
    try {
      loading.value = true
      await api.delete(`/posts/${postId}`)
      posts.value = posts.value.filter(p => p.id !== postId)
      totalPosts.value--
    } catch (err) {
      console.error('删除文章失败:', err)
      error.value = '删除文章失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  // 获取评论列表
  const fetchComments = async (postId = null, filters = {}) => {
    try {
      loading.value = true
      const response = await api.get('/comments', {
        params: {
          post_id: postId,
          ...filters
        }
      })
      comments.value = response.data.items
      totalComments.value = response.data.total
    } catch (err) {
      console.error('获取评论失败:', err)
      error.value = '获取评论失败'
    } finally {
      loading.value = false
    }
  }

  // 添加评论
  const addComment = async (postId, content) => {
    try {
      loading.value = true
      const response = await api.post('/comments', {
        post_id: postId,
        content
      })
      comments.value.unshift(response.data)
      totalComments.value++
      return response.data
    } catch (err) {
      console.error('添加评论失败:', err)
      error.value = '添加评论失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  // 删除评论
  const deleteComment = async (commentId) => {
    try {
      loading.value = true
      await api.delete(`/comments/${commentId}`)
      comments.value = comments.value.filter(c => c.id !== commentId)
      totalComments.value--
    } catch (err) {
      console.error('删除评论失败:', err)
      error.value = '删除评论失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  // 获取待审核内容
  const fetchPendingContent = async () => {
    if (authStore.user?.role !== 'admin') return

    try {
      loading.value = true
      const [postsRes, commentsRes] = await Promise.all([
        api.get('/posts/pending'),
        api.get('/comments/pending')
      ])
      pendingPosts.value = postsRes.data
      pendingComments.value = commentsRes.data
    } catch (err) {
      console.error('获取待审核内容失败:', err)
      error.value = '获取待审核内容失败'
    } finally {
      loading.value = false
    }
  }

  // 审核内容
  const reviewContent = async (type, id, action) => {
    try {
      loading.value = true
      await api.post(`/${type}/${id}/review`, { action })
      
      if (type === 'posts') {
        pendingPosts.value = pendingPosts.value.filter(p => p.id !== id)
        if (action === 'approve') {
          const response = await api.get(`/posts/${id}`)
          posts.value.unshift(response.data)
          totalPosts.value++
        }
      } else {
        pendingComments.value = pendingComments.value.filter(c => c.id !== id)
        if (action === 'approve') {
          const response = await api.get(`/comments/${id}`)
          comments.value.unshift(response.data)
          totalComments.value++
        }
      }
    } catch (err) {
      console.error('审核内容失败:', err)
      error.value = '审核失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  // 计算属性
  const pendingCount = computed(() => {
    return pendingPosts.value.length + pendingComments.value.length
  })

  return {
    posts,
    comments,
    totalPosts,
    totalComments,
    currentPage,
    pageSize,
    loading,
    error,
    pendingPosts,
    pendingComments,
    pendingCount,
    fetchPosts,
    createPost,
    updatePost,
    deletePost,
    fetchComments,
    addComment,
    deleteComment,
    fetchPendingContent,
    reviewContent
  }
}) 