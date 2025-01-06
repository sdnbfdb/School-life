<script setup>
import { ref } from 'vue'
import { useContentStore } from '@/stores/content'
import { useAuthStore } from '@/stores/auth'
import MarkdownEditor from './MarkdownEditor.vue'

const props = defineProps({
  post: {
    type: Object,
    default: () => ({
      title: '',
      content: '',
      tags: [],
      category: ''
    })
  }
})

const emit = defineEmits(['success', 'cancel'])
const contentStore = useContentStore()
const authStore = useAuthStore()

const form = ref({
  title: props.post.title,
  content: props.post.content,
  tags: props.post.tags,
  category: props.post.category
})

const tagInput = ref('')
const error = ref('')

const addTag = () => {
  if (!tagInput.value) return
  if (!form.value.tags.includes(tagInput.value)) {
    form.value.tags.push(tagInput.value)
  }
  tagInput.value = ''
}

const removeTag = (tag) => {
  form.value.tags = form.value.tags.filter(t => t !== tag)
}

const handleSubmit = async () => {
  try {
    if (props.post.id) {
      await contentStore.updatePost(props.post.id, form.value)
    } else {
      await contentStore.createPost(form.value)
    }
    emit('success')
  } catch (err) {
    error.value = err.message
  }
}
</script>

<template>
  <div class="post-editor">
    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label>标题</label>
        <input
          v-model="form.title"
          type="text"
          required
          placeholder="请输入文章标题"
        >
      </div>

      <div class="form-group">
        <label>分类</label>
        <select v-model="form.category" required>
          <option value="">请选择分类</option>
          <option value="news">新闻资讯</option>
          <option value="guide">求职指南</option>
          <option value="experience">面试经验</option>
          <option value="other">其他</option>
        </select>
      </div>

      <div class="form-group">
        <label>标签</label>
        <div class="tags-input">
          <div class="tags-list">
            <span 
              v-for="tag in form.tags"
              :key="tag"
              class="tag"
            >
              {{ tag }}
              <button type="button" @click="removeTag(tag)">&times;</button>
            </span>
          </div>
          <div class="tag-add">
            <input
              v-model="tagInput"
              type="text"
              placeholder="输入标签"
              @keydown.enter.prevent="addTag"
            >
            <button type="button" @click="addTag">添加</button>
          </div>
        </div>
      </div>

      <div class="form-group">
        <label>内容</label>
        <MarkdownEditor v-model="form.content" />
      </div>

      <div class="form-actions">
        <button type="button" class="cancel-btn" @click="emit('cancel')">
          取消
        </button>
        <button type="submit" class="submit-btn">
          {{ props.post.id ? '更新' : '发布' }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.post-editor {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: 500;
}

input[type="text"],
select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1em;
}

.tags-input {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 8px;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 8px;
}

.tag {
  background-color: #e3f2fd;
  padding: 4px 8px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.tag button {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 0 4px;
}

.tag-add {
  display: flex;
  gap: 8px;
}

.tag-add input {
  flex: 1;
}

.tag-add button {
  padding: 4px 12px;
  background-color: #2196F3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 30px;
}

.cancel-btn,
.submit-btn {
  padding: 8px 24px;
  border-radius: 4px;
  cursor: pointer;
}

.cancel-btn {
  background: none;
  border: 1px solid #ddd;
}

.submit-btn {
  background-color: #2196F3;
  color: white;
  border: none;
}

.error-message {
  color: #f44336;
  margin-bottom: 20px;
  padding: 10px;
  background-color: #ffebee;
  border-radius: 4px;
}
</style> 