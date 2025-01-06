<template>
  <div class="accessibility-settings" :class="{ 'high-contrast': settings.high_contrast }">
    <h2>无障碍设置</h2>
    
    <el-form :model="form" label-width="120px">
      <!-- 无障碍模式开关 -->
      <el-form-item label="无障碍模式">
        <el-switch
          v-model="form.accessibility_mode"
          @change="handleChange"
        />
      </el-form-item>

      <!-- 字体大小选择 -->
      <el-form-item label="字体大小">
        <el-select
          v-model="form.font_size"
          @change="handleChange"
        >
          <el-option label="小" value="small" />
          <el-option label="正常" value="normal" />
          <el-option label="大" value="large" />
          <el-option label="超大" value="x-large" />
        </el-select>
      </el-form-item>

      <!-- 高对比度模式 -->
      <el-form-item label="高对比度">
        <el-switch
          v-model="form.high_contrast"
          @change="handleChange"
        />
      </el-form-item>

      <!-- 文字转语音 -->
      <el-form-item label="文字转语音">
        <el-switch
          v-model="form.text_to_speech"
          @change="handleChange"
        />
      </el-form-item>
    </el-form>

    <!-- 预览区域 -->
    <div class="preview-area">
      <h3>预览效果</h3>
      <p ref="previewText" class="preview-text" :style="previewStyle">
        这是一段示例文字，用于预览无障碍设置的效果。
      </p>
      <el-button v-if="form.text_to_speech" @click="speakPreviewText">
        朗读文本
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import { useSpeechSynthesis } from '@vueuse/core'
import { ElMessage } from 'element-plus'

const settingsStore = useSettingsStore()
const settings = computed(() => settingsStore.settings)

const form = ref({
  accessibility_mode: settings.value.accessibility_mode,
  font_size: settings.value.font_size,
  high_contrast: settings.value.high_contrast,
  text_to_speech: settings.value.text_to_speech
})

const previewText = ref(null)
const { speak } = useSpeechSynthesis()

// 计算预览样式
const previewStyle = computed(() => ({
  fontSize: {
    'small': '14px',
    'normal': '16px',
    'large': '18px',
    'x-large': '20px'
  }[form.value.font_size],
  backgroundColor: form.value.high_contrast ? '#000' : '#fff',
  color: form.value.high_contrast ? '#fff' : '#333'
}))

// 处理设置变更
const handleChange = async () => {
  try {
    await settingsStore.updateSettings(form.value)
    ElMessage.success('设置更新成功')
  } catch (err) {
    console.error('更新设置失败:', err)
    ElMessage.error(err.message || '更新设置失败')
    // 恢复原值
    form.value = { ...settings.value }
  }
}

// 朗读文本
const speakPreviewText = () => {
  if (previewText.value) {
    speak(previewText.value.textContent)
  }
}
</script>

<style scoped>
.accessibility-settings {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
}

.preview-area {
  margin-top: 40px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.preview-text {
  margin: 20px 0;
  line-height: 1.6;
}

.high-contrast {
  background: #000;
  color: #fff;
}
</style> 