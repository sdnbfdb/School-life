<template>
  <nav class="nav-bar" :class="{ 'high-contrast': settings.high_contrast }">
    <div class="nav-left">
      <router-link to="/" class="logo">
        <h1 class="logo-text">校园生活</h1>
      </router-link>
      <div class="nav-links">
        <router-link to="/schools">高校</router-link>
        <router-link to="/marketplace">二手市场</router-link>
        <router-link to="/jobs">招聘</router-link>
        <router-link to="/bottles">漂流瓶</router-link>
      </div>
    </div>

    <div class="nav-right">
      <!-- 搜索按钮 -->
      <el-tooltip content="全局搜索" placement="bottom">
        <el-button
          class="icon-btn"
          :size="buttonSize"
          @click="showSearch = true"
        >
          <el-icon><Search /></el-icon>
        </el-button>
      </el-tooltip>

      <!-- 无障碍设置按钮 -->
      <el-tooltip content="无障碍设置" placement="bottom">
        <el-button
          class="icon-btn"
          :size="buttonSize"
          @click="showAccessibility = true"
        >
          <el-icon><Setting /></el-icon>
        </el-button>
      </el-tooltip>

      <!-- 用户菜单 -->
      <template v-if="isAuthenticated">
        <el-dropdown trigger="click">
          <div class="user-avatar">
            <el-avatar :size="32" :src="user?.avatar || '/default-avatar.png'" />
            <span class="username">{{ user?.username }}</span>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="$router.push('/profile')">
                <el-icon><User /></el-icon>个人中心
              </el-dropdown-item>
              <el-dropdown-item @click="$router.push('/my/posts')">
                <el-icon><Document /></el-icon>我的帖子
              </el-dropdown-item>
              <el-dropdown-item @click="$router.push('/my/bottles')">
                <el-icon><Message /></el-icon>我的漂流瓶
              </el-dropdown-item>
              <el-dropdown-item @click="$router.push('/my/jobs')">
                <el-icon><Briefcase /></el-icon>我的招聘
              </el-dropdown-item>
              <el-dropdown-item @click="$router.push('/settings')">
                <el-icon><Setting /></el-icon>设置
              </el-dropdown-item>
              <el-dropdown-item divided @click="handleLogout">
                <el-icon><SwitchButton /></el-icon>退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>
      <template v-else>
        <el-button type="primary" @click="$router.push('/profile')">
          <el-icon><User /></el-icon>
          我的
        </el-button>
      </template>
    </div>

    <!-- 全局搜索对话框 -->
    <el-dialog
      v-model="showSearch"
      title="全局搜索"
      width="500px"
      :close-on-click-modal="false"
    >
      <global-search @close="showSearch = false" />
    </el-dialog>

    <!-- 无障碍设置对话框 -->
    <el-dialog
      v-model="showAccessibility"
      title="无障碍设置"
      width="500px"
      :close-on-click-modal="false"
    >
      <accessibility-settings @close="showAccessibility = false" />
    </el-dialog>
  </nav>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useSettingsStore } from '@/stores/settings'
import { 
  Search, 
  Setting, 
  User, 
  Document,
  Message,
  Briefcase,
  SwitchButton 
} from '@element-plus/icons-vue'
import GlobalSearch from '../common/GlobalSearch.vue'
import AccessibilitySettings from '../settings/AccessibilitySettings.vue'

const router = useRouter()
const authStore = useAuthStore()
const settingsStore = useSettingsStore()

const showSearch = ref(false)
const showAccessibility = ref(false)

const isAuthenticated = computed(() => authStore.isAuthenticated)
const user = computed(() => authStore.user)
const settings = computed(() => settingsStore.settings)

// 根据设置转换按钮大小
const buttonSize = computed(() => {
  switch (settings.value.font_size) {
    case 'small': return 'small'
    case 'normal': return 'default'
    case 'large': return 'large'
    case 'x-large': return 'large'
    default: return 'default'
  }
})

// 处理登出
const handleLogout = async () => {
  try {
    await authStore.logout()
    router.push('/login')
  } catch (err) {
    console.error('登出失败:', err)
  }
}
</script>

<style scoped>
.nav-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 60px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 40px;
}

.nav-links {
  display: flex;
  gap: 20px;
}

.nav-links a {
  text-decoration: none;
  color: #606266;
  padding: 8px 12px;
  border-radius: 4px;
  transition: all 0.3s;
}

.nav-links a:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.nav-links a.router-link-active {
  color: var(--el-color-primary);
  font-weight: 500;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.icon-btn {
  padding: 8px;
  border: none;
  background: transparent;
}

.icon-btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.user-avatar {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
}

.user-avatar:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.username {
  margin-left: 8px;
  font-size: 14px;
}

/* 高对比度模式下的样式调整 */
.high-contrast {
  background-color: #000;
  color: #fff;

  .nav-links a {
    color: #fff;
  }

  .nav-links a:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  .nav-links a.router-link-active {
    color: #fff;
  }

  .icon-btn {
    color: #fff;
  }

  .icon-btn:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  .user-avatar:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  .username {
    color: #fff;
  }

  .logo-text {
    color: #fff;
  }
}

.logo-text {
  font-size: 24px;
  font-weight: bold;
  color: var(--el-color-primary);
  margin: 0;
}
</style>