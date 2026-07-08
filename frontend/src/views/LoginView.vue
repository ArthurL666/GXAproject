<template>
  <div class="login-page">
    <!-- 视频背景 — 与首页保持一致 -->
    <div class="video-wrapper">
      <video
        ref="videoRef"
        class="bg-video"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260329_050842_be71947f-f16e-4a14-810c-06e83d23ddb5.mp4"
        muted
        loop
        playsinline
        preload="auto"
      ></video>
      <div class="video-overlay"></div>
    </div>

    <!-- 导航栏（简约版） -->
    <nav class="login-nav">
      <router-link to="/" class="nav-logo">游伴AI</router-link>
    </nav>

    <!-- 登录卡片 -->
    <div class="login-container">
      <div class="login-card">
        <!-- 顶部品牌区 -->
        <div class="card-header">
          <div class="brand-icon">
            <svg viewBox="0 0 64 64" width="52" height="52" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="2" width="60" height="60" rx="14" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
              <path d="M32 8 L44 36 L32 31 L20 36Z" fill="white" opacity="0.92"/>
              <rect x="30" y="14" width="4" height="18" rx="2" fill="rgba(0,0,0,0.35)"/>
              <circle cx="32" cy="46" r="4" fill="#FBBF24"/>
            </svg>
          </div>
          <h1 class="brand-title">游伴AI</h1>
          <p class="brand-subtitle">说走就走的旅行，从一句话开始</p>
        </div>

        <!-- 表单 -->
        <form @submit.prevent="submit" class="login-form">
          <!-- 错误提示 -->
          <div v-if="error" class="error-banner">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            {{ error }}
          </div>

          <div class="form-group">
            <label>用户名</label>
            <div class="input-wrapper">
              <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <input v-model="username" type="text" placeholder="请输入用户名" autocomplete="username" />
            </div>
          </div>

          <div class="form-group" v-if="!isLogin">
            <label>昵称（可选）</label>
            <div class="input-wrapper">
              <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
              <input v-model="nickname" type="text" placeholder="给自己取个好听的昵称吧" />
            </div>
          </div>

          <div class="form-group">
            <label>密码</label>
            <div class="input-wrapper">
              <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
              <input v-model="password" type="password" placeholder="请输入密码" autocomplete="current-password" />
            </div>
          </div>

          <button type="submit" class="submit-btn" :disabled="loading">
            <span v-if="loading" class="spinner"></span>
            <span v-else>{{ isLogin ? '登 录' : '注 册' }}</span>
          </button>
        </form>

        <!-- 底部切换 -->
        <div class="card-footer">
          <span v-if="isLogin">
            还没有账号？
            <a @click="toggleMode">立即注册</a>
          </span>
          <span v-else>
            已有账号？
            <a @click="toggleMode">去登录</a>
          </span>
        </div>

        <!-- 返回首页 -->
        <router-link to="/" class="back-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          返回首页
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const videoRef = ref(null)

const isLogin = ref(true)
const username = ref('')
const password = ref('')
const nickname = ref('')
const loading = ref(false)
const error = ref('')

// 视频自动播放
onMounted(() => {
  const video = videoRef.value
  if (video) {
    video.play().catch(() => {
      // 自动播放被阻止，静静失败即可
    })
  }
})

function toggleMode() {
  isLogin.value = !isLogin.value
  error.value = ''
}

async function submit() {
  error.value = ''
  if (!username.value || !password.value) { error.value = '请填写用户名和密码'; return }
  if (!isLogin.value && password.value.length < 6) { error.value = '密码至少6位'; return }
  loading.value = true
  try {
    const result = isLogin.value
      ? await auth.login(username.value, password.value)
      : await auth.register(username.value, password.value, nickname.value)
    if (result.success) {
      const q = route.query.q
      router.push(q ? { path: '/app/chat', query: { q } } : '/app/chat')
    } else {
      error.value = result.message
    }
  } catch (e) {
    error.value = e.response?.data?.message || '网络错误，请稍后重试'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* ===== 全局 ===== */
.login-page {
  position: relative;
  width: 100%;
  min-height: 100vh;
  overflow: hidden;
  font-family: 'Schibsted Grotesk', 'Inter', 'Noto Sans', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  background: #000;
  display: flex;
  flex-direction: column;
}

/* ===== 视频背景 ===== */
.video-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
}

.bg-video {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 115%;
  height: 115%;
  object-fit: cover;
  object-position: center top;
}

.video-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.24);
  z-index: 1;
}

/* ===== 简约导航 ===== */
.login-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding: 20px 48px;
}

.nav-logo {
  font-family: 'Schibsted Grotesk', sans-serif;
  font-weight: 600;
  font-size: 24px;
  letter-spacing: -1.44px;
  color: #fff;
  text-decoration: none;
  display: inline-block;
}

/* ===== 登录容器 ===== */
.login-container {
  position: relative;
  z-index: 10;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 100px 24px 40px;
}

/* ===== 登录卡片 ===== */
.login-card {
  width: 420px;
  max-width: 100%;
  background: rgba(18, 18, 18, 0.75);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-radius: 20px;
  padding: 44px 40px 36px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow:
    0 24px 80px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.04);
  animation: cardIn 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes cardIn {
  from {
    opacity: 0;
    transform: translateY(24px) scale(0.97);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* 品牌区 */
.card-header {
  text-align: center;
  margin-bottom: 32px;
}

.brand-icon {
  font-size: 48px;
  display: block;
  margin-bottom: 8px;
}

.brand-title {
  font-family: 'Fustat', sans-serif;
  font-weight: 700;
  font-size: 26px;
  letter-spacing: -0.5px;
  color: #fff;
  margin: 0 0 6px;
}

.brand-subtitle {
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
}

/* ===== 表单 ===== */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

/* 错误提示 */
.error-banner {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(239, 68, 68, 0.12);
  border: 1px solid rgba(239, 68, 68, 0.25);
  color: #fca5a5;
  padding: 10px 14px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 500;
  font-family: 'Inter', sans-serif;
  animation: shakeIn 0.35s ease-out;
}

@keyframes shakeIn {
  0% { opacity: 0; transform: translateX(-8px); }
  60% { transform: translateX(4px); }
  100% { opacity: 1; transform: translateX(0); }
}

.error-banner svg {
  flex-shrink: 0;
}

/* 表单组 */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.65);
  letter-spacing: 0.2px;
}

/* 输入框容器 */
.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 14px;
  color: rgba(255, 255, 255, 0.3);
  pointer-events: none;
  transition: color 0.2s;
}

.input-wrapper:focus-within .input-icon {
  color: rgba(255, 255, 255, 0.6);
}

.input-wrapper input {
  width: 100%;
  padding: 12px 14px 12px 42px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  font-size: 14px;
  font-family: 'Inter', 'Noto Sans', sans-serif;
  color: #fff;
  background: rgba(255, 255, 255, 0.06);
  outline: none;
  transition: all 0.25s;
}

.input-wrapper input::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

.input-wrapper input:focus {
  border-color: rgba(255, 255, 255, 0.25);
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.06);
}

/* 提交按钮 */
.submit-btn {
  position: relative;
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 12px;
  background: #fff;
  color: #000;
  font-family: 'Schibsted Grotesk', sans-serif;
  font-weight: 600;
  font-size: 16px;
  letter-spacing: 1.2px;
  cursor: pointer;
  transition: all 0.25s;
  margin-top: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
}

.submit-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 24px rgba(255, 255, 255, 0.15);
}

.submit-btn:active {
  transform: translateY(0);
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* 加载动画 */
.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(0, 0, 0, 0.15);
  border-top-color: #000;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ===== 底部 ===== */
.card-footer {
  text-align: center;
  margin-top: 20px;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.4);
}

.card-footer a {
  color: rgba(255, 255, 255, 0.85);
  font-weight: 600;
  cursor: pointer;
  transition: color 0.2s;
  text-decoration: none;
}

.card-footer a:hover {
  color: #fff;
}

/* 返回首页 */
.back-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 16px;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.3);
  text-decoration: none;
  transition: color 0.2s;
  width: 100%;
  justify-content: center;
}

.back-link:hover {
  color: rgba(255, 255, 255, 0.6);
}

/* ===== 响应式 ===== */
@media (max-width: 480px) {
  .login-card {
    padding: 32px 24px;
    border-radius: 16px;
  }

  .login-nav {
    padding: 16px 20px;
  }

  .brand-icon {
    font-size: 40px;
  }

  .brand-title {
    font-size: 22px;
  }
}

/* ===== 无障碍 — 减少动效 ===== */
@media (prefers-reduced-motion: reduce) {
  .login-card {
    animation: none;
  }
  .error-banner {
    animation: none;
  }
  .submit-btn {
    transition: none;
  }
}
</style>
