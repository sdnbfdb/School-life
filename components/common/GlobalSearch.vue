<template>
  <div class="global-search" :class="{ 'high-contrast': settings.high_contrast }">
    <el-input
      v-model="keyword"
      placeholder="搜索帖子、学校、工作..."
      :size="settings.font_size"
      @keyup.enter="handleSearch"
    >
      <template #prefix>
        <el-icon><Search /></el-icon>
      </template>
      <template #append>
        <el-select v-model="type" style="width: 100px">
          <el-option label="全部" value="" />
          <el-option label="帖子" value="post" />
          <el-option label="学校" value="school" />
          <el-option label="工作" value="job" />
          <el-option label="商品" value="marketplace" />
        </el-select>
      </template>
    </el-input>

    <!-- 热门搜索 -->
    <div v-if="showHotSearches" class="hot-searches">
      <h4>热门搜索</h4>
      <el-tag
        v-for="item in hotSearches"
        :key="item.keyword"
        :type="getTagType(item.type)"
        @click="handleHotSearch(item)"
      >
        {{ item.keyword }}
        <span class="count">({{ item.count }})</span>
      </el-tag>
    </div>

    <!-- 搜索结果 -->
    <div v-if="showResults" class="search-results">
      <div v-for="result in results" :key="result.id">
        <component 
          :is="getResultComponent(result.type)"
          :item="result"
          @select="handleSelect"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Search } from '@element-plus/icons-vue'
import { useSettingsStore } from '@/stores/settings'
import PostSearchResult from './search/PostSearchResult.vue'
import SchoolSearchResult from './search/SchoolSearchResult.vue'
import JobSearchResult from './search/JobSearchResult.vue'
import MarketplaceSearchResult from './search/MarketplaceSearchResult.vue'

const router = useRouter()
const settingsStore = useSettingsStore()
const settings = computed(() => settingsStore.settings)

const keyword = ref('')
const type = ref('')
const results = ref([])
const hotSearches = ref([])
const loading = ref(false)
const showResults = computed(() => results.value.length > 0)
const showHotSearches = computed(() => !showResults.value && hotSearches.value.length > 0)

// 获取热门搜索
const fetchHotSearches = async () => {
  try {
    const response = await fetch('/api/search/hot')
    hotSearches.value = await response.json()
  } catch (err) {
    console.error('获取热门搜索失败:', err)
  }
}

// 执行搜索
const handleSearch = async () => {
  if (!keyword.value) return
  
  loading.value = true
  try {
    const response = await fetch(`/api/search?keyword=${keyword.value}&type=${type.value}`)
    results.value = await response.json()
  } catch (err) {
    console.error('搜索失败:', err)
  } finally {
    loading.value = false
  }
}

// 根据类型获取不同的结果组件
const getResultComponent = (type) => {
  switch (type) {
    case 'post': return PostSearchResult
    case 'school': return SchoolSearchResult
    case 'job': return JobSearchResult
    case 'marketplace': return MarketplaceSearchResult
    default: return PostSearchResult
  }
}

// 处理结果选择
const handleSelect = (item) => {
  router.push({
    name: `${item.type}-detail`,
    params: { id: item.id }
  })
}

// 获取标签类型
const getTagType = (type) => {
  switch (type) {
    case 'post': return ''
    case 'school': return 'success'
    case 'job': return 'warning'
    case 'marketplace': return 'danger'
    default: return ''
  }
}

// 点击热门搜索
const handleHotSearch = (item) => {
  keyword.value = item.keyword
  type.value = item.type
  handleSearch()
}

onMounted(() => {
  fetchHotSearches()
})
</script>

<style scoped>
.global-search {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.high-contrast {
  background: #000;
  color: #fff;
}

.hot-searches {
  margin-top: 20px;
}

.el-tag {
  margin: 5px;
  cursor: pointer;
}

.count {
  font-size: 12px;
  margin-left: 4px;
}

.search-results {
  margin-top: 20px;
  max-height: 600px;
  overflow-y: auto;
}
</style> 