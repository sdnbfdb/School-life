<script setup>
import { ref } from 'vue'
import { useApplicationStore } from '@/stores/application'
import { useNotificationStore } from '@/stores/notification'

const props = defineProps({
  application: {
    type: Object,
    required: true
  }
})

const applicationStore = useApplicationStore()
const notificationStore = useNotificationStore()

const interviewDate = ref('')
const interviewTime = ref('')
const location = ref('')
const notes = ref('')

const scheduleInterview = async () => {
  try {
    await applicationStore.updateStatus(props.application.id, 'interviewing')
    await notificationStore.handleNewNotification({
      title: '面试安排',
      message: `您的面试已安排在 ${interviewDate.value} ${interviewTime.value}`,
      type: 'interview'
    })
  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <div class="interview-scheduler">
    <h3>安排面试</h3>
    <form @submit.prevent="scheduleInterview">
      <div class="form-group">
        <label>面试日期</label>
        <input type="date" v-model="interviewDate" required>
      </div>
      
      <div class="form-group">
        <label>面试时间</label>
        <input type="time" v-model="interviewTime" required>
      </div>
      
      <div class="form-group">
        <label>面试地点</label>
        <input type="text" v-model="location" required>
      </div>
      
      <div class="form-group">
        <label>备注</label>
        <textarea v-model="notes"></textarea>
      </div>
      
      <button type="submit">确认安排</button>
    </form>
  </div>
</template>

<style scoped>
.interview-scheduler {
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  padding: 8px 16px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style> 