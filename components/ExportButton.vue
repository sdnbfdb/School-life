<script setup>
import { ref } from 'vue'
import { useExportStore } from '@/stores/export'

const props = defineProps({
  type: {
    type: String,
    required: true
  },
  filters: {
    type: Object,
    default: () => ({})
  },
  format: {
    type: String,
    default: 'excel'
  }
})

const emit = defineEmits(['success', 'error'])
const exportStore = useExportStore()
const showFormatSelect = ref(false)

const handleExport = async (selectedFormat = props.format) => {
  try {
    await exportStore.exportData(props.type, props.filters, selectedFormat)
    emit('success')
  } catch (error) {
    emit('error', error.message)
  }
}
</script>

<template>
  <div class="export-button">
    <div v-if="showFormatSelect" class="format-select">
      <button 
        class="format-option"
        @click="handleExport('excel')"
      >
        Excel格式
      </button>
      <button 
        class="format-option"
        @click="handleExport('pdf')"
      >
        PDF格式
      </button>
    </div>

    <button
      v-else
      class="export-btn"
      :class="{ loading: exportStore.exporting }"
      @click="showFormatSelect = true"
      :disabled="exportStore.exporting"
    >
      <i class="icon-download"></i>
      {{ exportStore.exporting ? '导出中...' : '导出数据' }}
    </button>

    <div v-if="exportStore.exporting" class="progress-bar">
      <div 
        class="progress"
        :style="{ width: exportStore.progress + '%' }"
      ></div>
      <span class="progress-text">{{ exportStore.progress }}%</span>
    </div>

    <div v-if="exportStore.error" class="error-message">
      {{ exportStore.error }}
    </div>
  </div>
</template>

<style scoped>
.export-button {
  position: relative;
  display: inline-block;
}

.export-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9em;
}

.export-btn.loading {
  background-color: #ccc;
  cursor: not-allowed;
}

.format-select {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 5px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.format-option {
  display: block;
  width: 100%;
  padding: 8px 16px;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
}

.format-option:hover {
  background-color: #f5f5f5;
}

.progress-bar {
  margin-top: 10px;
  height: 4px;
  background-color: #f5f5f5;
  border-radius: 2px;
  overflow: hidden;
  position: relative;
}

.progress {
  height: 100%;
  background-color: #4CAF50;
  transition: width 0.3s ease;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 12px;
  color: #666;
}

.error-message {
  margin-top: 10px;
  color: #f44336;
  font-size: 0.9em;
}
</style> 