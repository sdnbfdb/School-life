<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const profileForm = ref({
  name: authStore.user?.name || '',
  avatar: authStore.user?.avatar || '',
  bio: authStore.user?.bio || '',
  interests: authStore.user?.interests || [],
  birthday: authStore.user?.birthday || '',
  gender: authStore.user?.gender || '',
  location: authStore.user?.location || ''
})

const saving = ref(false)
const error = ref('')

const handleSave = async () => {
  try {
    saving.value = true
    await authStore.updateProfile(profileForm.value)
  } catch (err) {
    error.value = '保存失败'
    console.error(err)
  } finally {
    saving.value = false
  }
}

const handleAvatarUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  try {
    const formData = new FormData()
    formData.append('avatar', file)
    await authStore.updateAvatar(formData)
  } catch (err) {
    error.value = '头像上传失败'
    console.error(err)
  }
}
</script>

<template>
  <div class="profile-editor">
    <h3>编辑个人资料</h3>
    
    <form @submit.prevent="handleSave">
      <div class="avatar-section">
        <img :src="authStore.user?.avatar" alt="avatar">
        <input 
          type="file" 
          accept="image/*"
          @change="handleAvatarUpload"
        >
      </div>

      <div class="form-group">
        <label>用户名</label>
        <input v-model="profileForm.name" required>
      </div>

      <div class="form-group">
        <label>个人简介</label>
        <textarea v-model="profileForm.bio"></textarea>
      </div>

      <div class="form-group">
        <label>兴趣爱好</label>
        <div class="interests-input">
          <input
            v-model="newInterest"
            @keyup.enter="addInterest"
            placeholder="输入兴趣按回车添加"
          >
          <div class="interests-tags">
            <span
              v-for="interest in profileForm.interests"
              :key="interest"
              class="interest-tag"
            >
              {{ interest }}
              <button @click="removeInterest(interest)">&times;</button>
            </span>
          </div>
        </div>
      </div>

      <div class="form-group">
        <label>生日</label>
        <input type="date" v-model="profileForm.birthday">
      </div>

      <div class="form-group">
        <label>性别</label>
        <select v-model="profileForm.gender">
          <option value="">保密</option>
          <option value="male">男</option>
          <option value="female">女</option>
          <option value="other">其他</option>
        </select>
      </div>

      <div class="form-group">
        <label>所在地</label>
        <input v-model="profileForm.location">
      </div>

      <div v-if="error" class="error">{{ error }}</div>

      <button type="submit" :disabled="saving">
        {{ saving ? '保存中...' : '保存' }}
      </button>
    </form>
  </div>
</template>

<style scoped>
.profile-editor {
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.avatar-section {
  text-align: center;
  margin-bottom: 20px;
}

.avatar-section img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-bottom: 10px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.interests-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.interest-tag {
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  background: #e3f2fd;
  border-radius: 4px;
  font-size: 0.9em;
}

.interest-tag button {
  margin-left: 4px;
  border: none;
  background: none;
  color: #666;
  cursor: pointer;
}

.error {
  color: #f44336;
  margin-bottom: 10px;
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