import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'

// 创建应用实例
const app = createApp(App)

// 配置全局错误处理
app.config.errorHandler = (err, vm, info) => {
  console.group('Vue Error Details')
  console.log('Error:', err)
  console.log('Component Stack:', err.stack)
  console.log('Component:', vm)
  console.log('Error Info:', info)
  console.log('Component Data:', vm.$data)
  console.log('Component Props:', vm.$props)
  console.log('Current Route:', router.currentRoute.value)
  console.groupEnd()
}

// 配置警告处理
app.config.warnHandler = (msg, vm, trace) => {
  if (import.meta.env.DEV) {
    console.group('Vue Warning')
    console.warn('Warning:', msg)
    console.warn('Component:', {
      name: vm?.$options?.name || 'Anonymous',
      props: vm?.$props,
      data: vm?.$data
    })
    console.warn('Trace:', trace)
    console.groupEnd()
  }
}

// 性能追踪
app.config.performance = import.meta.env.DEV

app.use(createPinia())
app.use(router)
app.use(ElementPlus)

// 添加未捕获的 Promise 错误处理
window.addEventListener('unhandledrejection', event => {
  console.group('Unhandled Promise Rejection')
  console.log('Error:', event.reason)
  console.log('Promise:', event.promise)
  console.groupEnd()
})

app.mount('#app')
