<script setup>
import { ref, onMounted } from 'vue'
import { useAnalyticsStore } from '@/stores/analytics'
import StatCard from '@/components/charts/StatCard.vue'
import LineChart from '@/components/charts/LineChart.vue'
import BarChart from '@/components/charts/BarChart.vue'
import PieChart from '@/components/charts/PieChart.vue'

const analyticsStore = useAnalyticsStore()
const dateRange = ref('week') // week, month, year

const handleDateRangeChange = () => {
  fetchData()
}

const fetchData = async () => {
  const filters = { period: dateRange.value }
  await Promise.all([
    analyticsStore.fetchJobStats(filters),
    analyticsStore.fetchApplicationStats(filters),
    analyticsStore.fetchUserStats(filters)
  ])
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <div class="analytics-dashboard">
    <div class="dashboard-header">
      <h2>数据分析</h2>
      <select v-model="dateRange" @change="handleDateRangeChange">
        <option value="week">最近一周</option>
        <option value="month">最近一月</option>
        <option value="year">最近一年</option>
      </select>
    </div>

    <!-- 职位统计 -->
    <section class="stats-section">
      <h3>职位统计</h3>
      <div class="stats-grid">
        <StatCard
          title="发布职位"
          :value="analyticsStore.jobStats.total"
          subtitle="个在招职位"
          :loading="analyticsStore.loading"
        />
        <StatCard
          title="职位浏览"
          :value="analyticsStore.jobStats.views"
          subtitle="次总浏览"
          :trend="15"
          :loading="analyticsStore.loading"
        />
        <StatCard
          title="收到简历"
          :value="analyticsStore.jobStats.applications"
          subtitle="份申请简历"
          :trend="-5"
          :loading="analyticsStore.loading"
        />
      </div>
      
      <div class="charts-grid">
        <div class="chart-card">
          <h4>职位类别分布</h4>
          <PieChart
            v-if="!analyticsStore.loading"
            :data="analyticsStore.jobStats.byCategory"
          />
        </div>
        <div class="chart-card">
          <h4>发布趋势</h4>
          <LineChart
            v-if="!analyticsStore.loading"
            :data="analyticsStore.jobStats.trend"
          />
        </div>
      </div>
    </section>

    <!-- 应聘统计 -->
    <section class="stats-section">
      <h3>应聘统计</h3>
      <div class="stats-grid">
        <StatCard
          title="总申请"
          :value="analyticsStore.applicationStats.total"
          subtitle="份申请"
          :loading="analyticsStore.loading"
        />
        <StatCard
          title="面试中"
          :value="analyticsStore.applicationStats.interviewing"
          subtitle="位候选人"
          :loading="analyticsStore.loading"
        />
        <StatCard
          title="转化率"
          :value="`${analyticsStore.applicationStats.conversionRate}%`"
          subtitle="申请转化率"
          :trend="8"
          :loading="analyticsStore.loading"
        />
      </div>

      <div class="charts-grid">
        <div class="chart-card">
          <h4>申请状态分布</h4>
          <PieChart
            v-if="!analyticsStore.loading"
            :data="[
              { name: '待处理', value: analyticsStore.applicationStats.pending },
              { name: '面试中', value: analyticsStore.applicationStats.interviewing },
              { name: '已通过', value: analyticsStore.applicationStats.accepted },
              { name: '已拒绝', value: analyticsStore.applicationStats.rejected }
            ]"
          />
        </div>
        <div class="chart-card">
          <h4>申请趋势</h4>
          <LineChart
            v-if="!analyticsStore.loading"
            :data="analyticsStore.applicationStats.byDate"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.analytics-dashboard {
  max-width: 1200px;
  margin: 40px auto;
  padding: 20px;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.stats-section {
  margin-bottom: 40px;
}

.stats-section h3 {
  margin-bottom: 20px;
  color: #333;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
}

.chart-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.chart-card h4 {
  margin: 0 0 20px;
  color: #666;
}

@media (max-width: 768px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }
}
</style> 