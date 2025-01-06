<template>
  <div class="job-card">
    <router-link :to="`/jobs/${job.id}`" class="job-link">
      <h3>{{ job.title }}</h3>
      <div class="job-info">
        <span class="company">{{ job.company }}</span>
        <span class="location">{{ job.location }}</span>
        <span class="salary">{{ job.salary }}</span>
      </div>
      <p class="description">{{ job.description }}</p>
    </router-link>
  </div>
</template>

<script setup>
defineProps({
  job: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
.job-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.job-card:hover {
  transform: translateY(-2px);
}

.job-link {
  display: block;
  padding: 20px;
  text-decoration: none;
  color: inherit;
}

.job-info {
  display: flex;
  gap: 16px;
  margin: 8px 0;
  color: #666;
  font-size: 0.9em;
}

.description {
  color: #666;
  margin-top: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 