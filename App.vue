<script setup>
import { useAuthStore } from '@/stores/auth'
import { useSettingsStore } from '@/stores/settings'
import { onMounted, computed } from 'vue'
import NavBar from '@/components/layout/NavBar.vue'

const authStore = useAuthStore()
const settingsStore = useSettingsStore()
const settings = computed(() => settingsStore.settings)

onMounted(async () => {
  try {
    // 初始化认证状态
    await authStore.initAuth()
    
    // 获取系统设置
    if (authStore.isAuthenticated) {
      await settingsStore.fetchSettings()
    }
  } catch (err) {
    console.error('初始化失败:', err)
  }
})
</script>

<template>
  <div 
    id="app" 
    :class="{
      'accessibility-mode': settings.accessibility_mode,
      'high-contrast': settings.high_contrast,
      [`font-size-${settings.font_size}`]: true
    }"
  >
    <NavBar />
    <RouterView />
  </div>
</template>

<style>
#app {
  min-height: 100vh;
}

/* 无障碍模式样式 */
.accessibility-mode {
  line-height: 1.8;
}

/* 高对比度模式样式 */
.high-contrast {
  background: #000;
  color: #fff;
}

/* 字体大小样式 */
.font-size-small { font-size: 14px; }
.font-size-normal { font-size: 16px; }
.font-size-large { font-size: 18px; }
.font-size-x-large { font-size: 20px; }

/* 焦点样式 */
.accessibility-mode *:focus {
  outline: 3px solid #2196F3;
  outline-offset: 2px;
}
</style>
