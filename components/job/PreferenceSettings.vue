<script setup>
import { ref } from 'vue'
import { useRecommendationStore } from '@/stores/recommendation'

const recommendationStore = useRecommendationStore()

const preferences = ref({
  jobTypes: [],
  salary: {
    min: 0,
    max: 50000
  },
  locations: [],
  skills: [],
  industries: [],
  workExperience: null,
  education: null,
  companySize: null
})

const saving = ref(false)

const handleSave = async () => {
  try {
    saving.value = true
    await recommendationStore.updatePreferences(preferences.value)
    // 重新获取推荐职位
    await recommendationStore.fetchRecommendedJobs()
  } catch (error) {
    console.error(error)
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="preference-settings">
    <h3>求职偏好设置</h3>
    
    <form @submit.prevent="handleSave">
      <div class="form-group">
        <label>工作类型</label>
        <div class="checkbox-group">
          <label v-for="type in jobTypes" :key="type.value">
            <input
              type="checkbox"
              v-model="preferences.jobTypes"
              :value="type.value"
            >
            {{ type.label }}
          </label>
        </div>
      </div>
      
      <div class="form-group">
        <label>期望薪资</label>
        <div class="salary-range">
          <input
            type="number"
            v-model="preferences.salary.min"
            placeholder="最低"
          >
          <span>-</span>
          <input
            type="number"
            v-model="preferences.salary.max"
            placeholder="最高"
          >
        </div>
      </div>
      
      <div class="form-group">
        <label>工作地点</label>
        <select multiple v-model="preferences.locations">
          <option value="beijing">北京</option>
          <option value="shanghai">上海</option>
          <option value="guangzhou">广州</option>
          <option value="shenzhen">深圳</option>
        </select>
      </div>
      
      <div class="form-group">
        <label>技能要求</label>
        <div class="skills-input">
          <input
            type="text"
            v-model="newSkill"
            @keyup.enter="addSkill"
            placeholder="输入技能按回车添加"
          >
          <div class="skills-tags">
            <span
              v-for="skill in preferences.skills"
              :key="skill"
              class="skill-tag"
            >
              {{ skill }}
              <button @click="removeSkill(skill)">&times;</button>
            </span>
          </div>
        </div>
      </div>
      
      <button type="submit" :disabled="saving">
        {{ saving ? '保存中...' : '保存' }}
      </button>
    </form>
  </div>
</template>

<style scoped>
.preference-settings {
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

.checkbox-group {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 10px;
}

.salary-range {
  display: flex;
  align-items: center;
  gap: 10px;
}

.salary-range input {
  width: 120px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.skills-input input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 10px;
}

.skills-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.skill-tag {
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  background: #e3f2fd;
  border-radius: 4px;
  font-size: 0.9em;
}

.skill-tag button {
  margin-left: 4px;
  border: none;
  background: none;
  color: #666;
  cursor: pointer;
}

button[type="submit"] {
  width: 100%;
  padding: 12px;
  background: #2196F3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button[type="submit"]:disabled {
  background: #ccc;
  cursor: not-allowed;
}
</style> 