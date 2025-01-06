import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api/config'

export const useJobsStore = defineStore('jobs', () => {
  const jobs = ref([])
  const loading = ref(false)
  const error = ref('')
  const job = ref(null)

  const filters = ref({
    type: 'all',
    location: '',
    salary: '',
    tags: [],
    sort: 'latest'
  })

  const fetchJobs = async (params = {}) => {
    try {
      loading.value = true
      error.value = ''
      const response = await api.get('/api/jobs', { params })
      jobs.value = response.data
    } catch (err) {
      console.error('Failed to fetch jobs:', err)
      error.value = '获取职位列表失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  const createJob = async (jobData) => {
    try {
      loading.value = true
      const response = await api.post('/api/jobs', jobData)
      return response.data
    } catch (error) {
      console.error('发布职位失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const applyJob = async (jobId) => {
    try {
      await api.post(`/api/jobs/${jobId}/apply`)
      return true
    } catch (error) {
      console.error('申请职位失败:', error)
      throw error
    }
  }

  const fetchJobDetail = async (jobId) => {
    console.group('Fetching Job Detail')
    console.log('Job ID:', jobId)

    try {
      if (!jobId || jobId === 'undefined') {
        throw new Error('Invalid job ID')
      }

      loading.value = true
      error.value = ''
      job.value = null

      // 先尝试从列表中查找
      const existingJob = jobs.value.find(j => j.id === parseInt(jobId))
      if (existingJob) {
        console.log('Job found in store:', existingJob)
        job.value = existingJob
        return existingJob
      }

      // 如果列表中没有，则从服务器获取
      const response = await api.get(`/api/jobs/${jobId}`)
      console.log('Job detail response:', response)

      if (!response?.data) {
        throw new Error('No data received from API')
      }

      job.value = response.data
      return job.value
    } catch (err) {
      console.error('Error fetching job detail:', err)
      error.value = err.response?.data?.message || '获取职位详情失败'
      throw err
    } finally {
      loading.value = false
      console.groupEnd()
    }
  }

  // 初始化测试数据
  const initTestData = async () => {
    try {
      loading.value = true
      error.value = ''
      
      const testJobs = [
        {
          title: '前端开发工程师',
          company_name: '科技有限公司',
          location: '北京',
          salary: '15k-25k',
          description: '负责公司核心产品的前端开发',
          requirements: '熟悉 Vue、React 等前端框架，3年以上开发经验',
          tags: ['全职', '经验3-5年', '本科及以上'],
          status: 'active'
        },
        {
          title: '后端开发工程师',
          company_name: '互联网科技',
          location: '上海',
          salary: '20k-35k',
          description: '负责服务端架构设计和开发',
          requirements: '精通 Node.js/Java，熟悉分布式系统',
          tags: ['全职', '经验5年以上', '本科及以上'],
          status: 'active'
        },
        {
          title: '产品经理',
          company_name: '创新科技',
          location: '深圳',
          salary: '18k-30k',
          description: '负责产品规划和用户体验设计',
          requirements: '有B端产品经验，熟悉互联网产品开发流程',
          tags: ['全职', '经验3-5年', '本科及以上'],
          status: 'active'
        },
        {
          title: 'UI设计师',
          company_name: '设计工作室',
          location: '广州',
          salary: '12k-20k',
          description: '负责产品界面视觉设计',
          requirements: '熟练使用设计软件，有移动端设计经验',
          tags: ['全职', '经验1-3年', '本科及以上'],
          status: 'active'
        },
        {
          title: '运维工程师',
          company_name: '云服务公司',
          location: '杭州',
          salary: '15k-25k',
          description: '负责系统运维和监控',
          requirements: '熟悉 Linux 系统，有云平台使用经验',
          tags: ['全职', '经验3-5年', '本科及以上'],
          status: 'active'
        }
      ]

      // 批量创建测试数据
      await Promise.all(testJobs.map(job => 
        api.post('/api/jobs', job)
      ))

      // 重新获取职位列表
      await fetchJobs()

      console.log('Jobs test data initialized')
    } catch (err) {
      console.error('Failed to init test data:', err)
      error.value = '初始化测试数据失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    jobs,
    loading,
    error,
    filters,
    fetchJobs,
    createJob,
    applyJob,
    job,
    fetchJobDetail,
    initTestData
  }
}) 