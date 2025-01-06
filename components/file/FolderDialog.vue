<script setup>
import { ref } from 'vue'

const emit = defineEmits(['close', 'create'])
const folderName = ref('')

const handleSubmit = () => {
  if (!folderName.value.trim()) return
  emit('create', folderName.value)
  folderName.value = ''
}
</script>

<template>
  <div class="dialog-overlay" @click="emit('close')">
    <div class="dialog" @click.stop>
      <h3>新建文件夹</h3>
      
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label>文件夹名称</label>
          <input
            v-model="folderName"
            type="text"
            placeholder="请输入文件夹名称"
            required
            autofocus
          >
        </div>

        <div class="dialog-actions">
          <button type="button" @click="emit('close')">取消</button>
          <button type="submit">创建</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.dialog {
  background: white;
  border-radius: 8px;
  padding: 20px;
  width: 90%;
  max-width: 400px;
}

.dialog h3 {
  margin: 0 0 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #666;
}

.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.dialog-actions button {
  padding: 8px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.dialog-actions button[type="button"] {
  background-color: #f5f5f5;
}

.dialog-actions button[type="submit"] {
  background-color: #2196F3;
  color: white;
}
</style> 