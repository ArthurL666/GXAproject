<template>
  <div class="app-layout">
    <aside class="sidebar">
      <div class="sidebar-header">
        <span class="sidebar-logo">
          <svg viewBox="0 0 64 64" width="36" height="36" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="2" width="60" height="60" rx="14" fill="#DBEAFE" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
            <path d="M32 8 L44 36 L32 31 L20 36Z" fill="white" opacity="0.92"/>
            <rect x="30" y="14" width="4" height="18" rx="2" fill="rgba(0,0,0,0.35)"/>
            <circle cx="32" cy="46" r="4" fill="#FBBF24"/>
          </svg>
        </span>
        <div class="sidebar-title">游伴AI</div>
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
  { path: '/app/chat', icon: '💬', label: 'AI 规划' },
  { path: '/app/explore', icon: '🗺️', label: '目的地探索' },
  { path: '/app/inspiration', icon: '✨', label: '旅行灵感' },
  { path: '/app/plans', icon: '📋', label: '我的行程' },
  { path: '/app/profile', icon: '👤', label: '个人中心' }
]

function handleLogout() {
  auth.logout()
  router.push('/login')
}
</script>
