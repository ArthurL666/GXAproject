<template>
  <div class="app-layout">
    <aside class="sidebar">
      <div class="sidebar-header">
        <span class="sidebar-logo">✈️</span>
        <div class="sidebar-title">AI 旅游助手</div>
      </div>
      <nav class="sidebar-nav">
        <button
          v-for="item in navItems" :key="item.path"
          class="nav-item" :class="{ active: $route.path === item.path }"
          @click="$router.push(item.path)"
        >
          <span class="nav-icon">{{ item.icon }}</span>
          {{ item.label }}
        </button>
      </nav>
      <div class="sidebar-footer">
        <div class="user-info">
          <div class="user-avatar">{{ auth.avatarChar }}</div>
          <div class="user-name">{{ auth.displayName }}</div>
          <button class="btn btn-text btn-sm" @click="handleLogout" title="退出">🚪</button>
        </div>
      </div>
    </aside>
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

const navItems = [
  { path: '/chat', icon: '💬', label: 'AI 对话' },
  { path: '/history', icon: '📋', label: '历史记录' },
  { path: '/plans', icon: '🗺️', label: '我的行程' },
  { path: '/profile', icon: '👤', label: '个人中心' }
]

function handleLogout() {
  auth.logout()
  router.push('/login')
}
</script>