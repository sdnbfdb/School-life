import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useWebSocketStore = defineStore('websocket', () => {
  const ws = ref(null)
  const connected = ref(false)
  const reconnectAttempts = ref(0)
  const maxReconnectAttempts = 5

  const connect = (token) => {
    const wsUrl = `${import.meta.env.VITE_WS_URL}?token=${token}`
    ws.value = new WebSocket(wsUrl)

    ws.value.onopen = () => {
      connected.value = true
      reconnectAttempts.value = 0
    }

    ws.value.onclose = () => {
      connected.value = false
      if (reconnectAttempts.value < maxReconnectAttempts) {
        setTimeout(() => {
          reconnectAttempts.value++
          connect(token)
        }, 1000 * Math.pow(2, reconnectAttempts.value))
      }
    }

    ws.value.onerror = (error) => {
      console.error('WebSocket错误:', error)
    }
  }

  const disconnect = () => {
    if (ws.value) {
      ws.value.close()
      ws.value = null
    }
    connected.value = false
  }

  const send = (message) => {
    if (ws.value && connected.value) {
      ws.value.send(JSON.stringify(message))
    }
  }

  return {
    connected,
    connect,
    disconnect,
    send
  }
}) 