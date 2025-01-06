<script setup>
import { ref, watch } from 'vue'
import { useSearchStore } from '@/stores/search'
import { useRouter } from 'vue-router'
import { debounce } from '@/utils/helpers'

const props = defineProps({
  placeholder: {
    type: String,
    default: '搜索...'
  },
  showAdvanced: {
    type: Boolean,
    default: false
  }
})

const searchStore = useSearchStore()
const router = useRouter()
const query = ref('')
const showSuggestions = ref(false)
const showHistory = ref(false)
const advancedDialog = ref(false)

// 高级搜索表单
const advancedForm = ref({
  keywords: '',
  category: '',
  location: '',
  salary_min: '',
  salary_max: '',
  experience: '',
  education: '',
  company_type: '',
  company_size: '',
  date_range: 'all'
})

// 防抖处理搜索建议
const debouncedFetchSuggestions = debounce(async (value) => {
  if (value.trim()) {
    await searchStore.fetchSuggestions(value)
    showSuggestions.value = true
    showHistory.value = false
  } else {
    showSuggestions.value = false
  }
}, 300)

// 监听输入变化
watch(query, (value) => {
  debouncedFetchSuggestions(value)
})

// 处理搜索
const handleSearch = async (searchQuery = query.value) => {
  if (!searchQuery.trim()) return
  
  showSuggestions.value = false
  showHistory.value = false
  
  await searchStore.search(searchQuery)
  router.push({
    name: 'search-results',
    query: { q: searchQuery }
  })
}

// 处理高级搜索
const handleAdvancedSearch = async () => {
  advancedDialog.value = false
  await searchStore.advancedSearch(advancedForm.value)
  router.push({
    name: 'search-results',
    query: { ...advancedForm.value }
  })
}

// 选择建议
const selectSuggestion = (suggestion) => {
  query.value = suggestion
  handleSearch(suggestion)
}

// 选择历史记录
const selectHistory = (history) => {
  query.value = history
  handleSearch(history)
}

// 显示搜索历史
const showSearchHistory = () => {
  if (!query.value) {
    showHistory.value = true
    showSuggestions.value = false
  }
}

onMounted(() => {
  searchStore.loadHistory()
})
</script>

<template>
  <div class="search-bar">
    <div class="search-input-wrapper">
      <input
        v-model="query"
        type="text"
        :placeholder="placeholder"
        @focus="showSearchHistory"
        @keydown.enter="handleSearch"
      >
      <button class="search-btn" @click="handleSearch">
        <i class="icon-search"></i>
      </button>
      <button 
        v-if="showAdvanced"
        class="advanced-btn"
        @click="advancedDialog = true"
      >
        高级搜索
      </button>
    </div>

    <!-- 搜索建议 -->
    <div v-if="showSuggestions && searchStore.suggestions.length" class="suggestions">
      <div
        v-for="suggestion in searchStore.suggestions"
        :key="suggestion"
        class="suggestion-item"
        @click="selectSuggestion(suggestion)"
      >
        {{ suggestion }}
      </div>
    </div>

    <!-- 搜索历史 -->
    <div v-if="showHistory && searchStore.searchHistory.length" class="search-history">
      <div class="history-header">
        <span>搜索历史</span>
        <button @click="searchStore.clearHistory">清除</button>
      </div>
      <div
        v-for="history in searchStore.searchHistory"
        :key="history"
        class="history-item"
        @click="selectHistory(history)"
      >
        <i class="icon-history"></i>
        {{ history }}
      </div>
    </div>

    <!-- 高级搜索对话框 -->
    <dialog v-if="advancedDialog" class="advanced-dialog">
      <h3>高级搜索</h3>
      <form @submit.prevent="handleAdvancedSearch">
        <div class="form-group">
          <label>关键词</label>
          <input v-model="advancedForm.keywords" type="text">
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>分类</label>
            <select v-model="advancedForm.category">
              <option value="">全部</option>
              <option value="tech">技术</option>
              <option value="design">设计</option>
              <option value="product">产品</option>
              <option value="operation">运营</option>
            </select>
          </div>

          <div class="form-group">
            <label>地点</label>
            <input v-model="advancedForm.location" type="text">
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>最低薪资</label>
            <input v-model="advancedForm.salary_min" type="number">
          </div>

          <div class="form-group">
            <label>最高薪资</label>
            <input v-model="advancedForm.salary_max" type="number">
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>经验要求</label>
            <select v-model="advancedForm.experience">
              <option value="">不限</option>
              <option value="fresh">应届生</option>
              <option value="1-3">1-3年</option>
              <option value="3-5">3-5年</option>
              <option value="5-10">5-10年</option>
              <option value="10+">10年以上</option>
            </select>
          </div>

          <div class="form-group">
            <label>学历要求</label>
            <select v-model="advancedForm.education">
              <option value="">不限</option>
              <option value="college">大专</option>
              <option value="bachelor">本科</option>
              <option value="master">硕士</option>
              <option value="phd">博士</option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>发布时间</label>
            <select v-model="advancedForm.date_range">
              <option value="all">全部</option>
              <option value="today">今天</option>
              <option value="3days">3天内</option>
              <option value="week">一周内</option>
              <option value="month">一个月内</option>
            </select>
          </div>
        </div>

        <div class="dialog-actions">
          <button type="button" @click="advancedDialog = false">取消</button>
          <button type="submit">搜索</button>
        </div>
      </form>
    </dialog>
  </div>
</template>

<style scoped>
.search-bar {
  position: relative;
  width: 100%;
  max-width: 600px;
}

.search-input-wrapper {
  display: flex;
  gap: 10px;
}

input[type="text"] {
  flex: 1;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1em;
}

.search-btn,
.advanced-btn {
  padding: 0 20px;
  background-color: #2196F3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.advanced-btn {
  background-color: #666;
}

.suggestions,
.search-history {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-top: 5px;
  max-height: 300px;
  overflow-y: auto;
  z-index: 1000;
}

.suggestion-item,
.history-item {
  padding: 10px 15px;
  cursor: pointer;
}

.suggestion-item:hover,
.history-item:hover {
  background-color: #f5f5f5;
}

.history-header {
  display: flex;
  justify-content: space-between;
  padding: 10px 15px;
  border-bottom: 1px solid #eee;
}

.history-header button {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
}

.advanced-dialog {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 600px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  color: #666;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.dialog-actions button {
  padding: 8px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.dialog-actions button[type="submit"] {
  background-color: #2196F3;
  color: white;
}

.dialog-actions button[type="button"] {
  background-color: #f5f5f5;
}
</style> 