<script setup>
import { onMounted } from 'vue'
import { useContentStore } from '@/stores/content'

const contentStore = useContentStore()

onMounted(() => {
  contentStore.fetchPendingContent()
})

const handleReview = async (type, id, action) => {
  try {
    await contentStore.reviewContent(type, id, action)
  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <div class="content-review">
    <h2>内容审核 ({{ contentStore.pendingCount }})</h2>

    <div v-if="contentStore.loading" class="loading">
      加载中...
    </div>

    <template v-else>
      <!-- 待审核文章 -->
      <section v-if="contentStore.pendingPosts.length > 0" class="review-section">
        <h3>待审核文章 ({{ contentStore.pendingPosts.length }})</h3>
        <div class="review-list">
          <div 
            v-for="post in contentStore.pendingPosts"
            :key="post.id"
            class="review-item"
          >
            <div class="review-content">
              <h4>{{ post.title }}</h4>
              <div class="meta">
                <span>作者: {{ post.author.name }}</span>
                <span>分类: {{ post.category }}</span>
                <span>提交时间: {{ new Date(post.created_at).toLocaleString() }}</span>
              </div>
              <p class="preview">{{ post.content.substring(0, 200) }}...</p>
            </div>
            <div class="review-actions">
              <button 
                class="approve-btn"
                @click="handleReview('posts', post.id, 'approve')"
              >
                通过
              </button>
              <button 
                class="reject-btn"
                @click="handleReview('posts', post.id, 'reject')"
              >
                拒绝
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- 待审核评论 -->
      <section v-if="contentStore.pendingComments.length > 0" class="review-section">
        <h3>待审核评论 ({{ contentStore.pendingComments.length }})</h3>
        <div class="review-list">
          <div 
            v-for="comment in contentStore.pendingComments"
            :key="comment.id"
            class="review-item"
          >
            <div class="review-content">
              <div class="meta">
                <span>评论者: {{ comment.author.name }}</span>
                <span>文章: {{ comment.post.title }}</span>
                <span>提交时间: {{ new Date(comment.created_at).toLocaleString() }}</span>
              </div>
              <p>{{ comment.content }}</p>
            </div>
            <div class="review-actions">
              <button 
                class="approve-btn"
                @click="handleReview('comments', comment.id, 'approve')"
              >
                通过
              </button>
              <button 
                class="reject-btn"
                @click="handleReview('comments', comment.id, 'reject')"
              >
                拒绝
              </button>
            </div>
          </div>
        </div>
      </section>

      <div v-if="contentStore.pendingCount === 0" class="empty">
        暂无待审核内容
      </div>
    </template>
  </div>
</template>

<style scoped>
.content-review {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.review-section {
  margin-bottom: 40px;
}

.review-section h3 {
  margin-bottom: 20px;
  color: #333;
}

.review-list {
  display: grid;
  gap: 20px;
}

.review-item {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  gap: 20px;
}

.review-content {
  flex: 1;
}

.review-content h4 {
  margin: 0 0 10px;
  color: #333;
}

.meta {
  display: flex;
  gap: 20px;
  color: #666;
  font-size: 0.9em;
  margin-bottom: 10px;
}

.preview {
  color: #666;
  line-height: 1.5;
}

.review-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.approve-btn,
.reject-btn {
  padding: 8px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.approve-btn {
  background-color: #4caf50;
  color: white;
}

.reject-btn {
  background-color: #f44336;
  color: white;
}

.loading,
.empty {
  text-align: center;
  padding: 40px;
  color: #666;
}
</style> 