<template>
  <div class="bottles-view">
    <!-- 漂流瓶列表 -->
    <el-card class="bottles-list" v-loading="loading">
      <template #header>
        <div class="card-header">
          <span>漂流瓶</span>
          <el-button-group>
            <el-button type="primary" @click="handleThrow" :disabled="!isAuthenticated">
              扔一个
            </el-button>
            <el-button @click="handlePickup" :disabled="!isAuthenticated || loading">
              捡一个
            </el-button>
          </el-button-group>
        </div>
      </template>

      <div v-if="bottles && bottles.length > 0" class="bottles-grid">
        <bottle-card
          v-for="bottle in bottles"
          :key="bottle.id"
          :bottle="bottle"
          @reply="handleReply"
          @delete="handleDelete"
        />
      </div>
      <el-empty v-else description="暂无漂流瓶" />

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 30, 50]"
          layout="total, sizes, prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 扔漂流瓶对话框 -->
    <el-dialog
      v-model="showThrowDialog"
      title="扔漂流瓶"
      width="500px"
      :close-on-click-modal="false"
    >
      <bottle-form @submit="handleBottleSubmit" @cancel="showThrowDialog = false" />
    </el-dialog>

    <!-- 回复漂流瓶对话框 -->
    <el-dialog
      v-model="showReplyDialog"
      title="回复漂流瓶"
      width="500px"
      :close-on-click-modal="false"
    >
      <reply-form 
        :bottle="selectedBottle" 
        @submit="handleReplySubmit" 
        @cancel="showReplyDialog = false" 
      />
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useAuthStore } from '@/stores/auth'
import api from '@/api/config'
import BottleCard from '@/components/bottle/BottleCard.vue'
import BottleForm from '@/components/bottle/BottleForm.vue'
import ReplyForm from '@/components/bottle/ReplyForm.vue'

const authStore = useAuthStore()
const isAuthenticated = computed(() => authStore.isAuthenticated)

// 数据
const bottles = ref([])
const loading = ref(false)
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const showThrowDialog = ref(false)
const showReplyDialog = ref(false)
const selectedBottle = ref(null)

// 获取漂流瓶列表
const fetchBottles = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      limit: pageSize.value
    }
    const response = await api.get('/bottles', { params })
    bottles.value = response.items || []
    total.value = response.total || 0
  } catch (err) {
    console.error('获取漂流瓶列表失败:', err)
    ElMessage.error('获取漂流瓶列表失败')
  } finally {
    loading.value = false
  }
}

// 处理分页
const handleSizeChange = (val) => {
  pageSize.value = val
  fetchBottles()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  fetchBottles()
}

// 扔漂流瓶
const handleThrow = () => {
  if (!isAuthenticated.value) {
    ElMessage.warning('请先登录')
    return
  }
  showThrowDialog.value = true
}

// 捡漂流瓶
const handlePickup = async () => {
  if (!isAuthenticated.value) {
    ElMessage.warning('请先登录')
    return
  }

  try {
    loading.value = true
    const response = await api.post('/bottles/pickup')
    bottles.value.unshift(response)
    ElMessage.success('捡到一个漂流瓶')
  } catch (err) {
    console.error('捡漂流瓶失败:', err)
    ElMessage.error(err.message || '捡漂流瓶失败')
  } finally {
    loading.value = false
  }
}

// 提交漂流瓶
const handleBottleSubmit = async (bottleData) => {
  try {
    await api.post('/bottles', bottleData)
    showThrowDialog.value = false
    ElMessage.success('漂流瓶已扔出')
    fetchBottles()
  } catch (err) {
    console.error('扔漂流瓶失败:', err)
    ElMessage.error(err.message || '扔漂流瓶失败')
  }
}

// 回复漂流瓶
const handleReply = (bottle) => {
  if (!isAuthenticated.value) {
    ElMessage.warning('请先登录')
    return
  }
  selectedBottle.value = bottle
  showReplyDialog.value = true
}

// 提交回复
const handleReplySubmit = async (replyData) => {
  try {
    await api.post(`/bottles/${selectedBottle.value.id}/replies`, replyData)
    showReplyDialog.value = false
    ElMessage.success('回复成功')
    fetchBottles()
  } catch (err) {
    console.error('回复失败:', err)
    ElMessage.error(err.message || '回复失败')
  }
}

// 删除漂流瓶
const handleDelete = async (bottle) => {
  try {
    await ElMessageBox.confirm('确定要删除这个漂流瓶吗？', '提示', {
      type: 'warning'
    })
    
    await api.delete(`/bottles/${bottle.id}`)
    ElMessage.success('删除成功')
    fetchBottles()
  } catch (err) {
    if (err !== 'cancel') {
      console.error('删除失败:', err)
      ElMessage.error(err.message || '删除失败')
    }
  }
}

// 初始化
onMounted(() => {
  fetchBottles()
})
</script>

<style scoped>
.bottles-view {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.bottles-grid {
  display: grid;
  gap: 20px;
  margin-bottom: 20px;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style> 