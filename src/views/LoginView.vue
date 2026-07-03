<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-logo">
        <span class="icon">✈️</span>
        <h1>AI 旅游助手</h1>
        <p>说走就走的旅行，从一句话开始 🌍</p>
      </div>
      <form @submit.prevent="submit">
        <div v-if="error" class="error-msg">⚠️ {{ error }}</div>
        <div class="form-group">
          <label>👤 用户名</label>
          <input v-model="username" type="text" placeholder="请输入用户名" autocomplete="username" />
        </div>
        <div class="form-group" v-if="!isLogin">
          <label>😊 昵称（可选）</label>
          <input v-model="nickname" type="text" placeholder="给自己取个好听的昵称吧" />
        </div>
        <div class="form-group">
          <label>🔒 密码</label>
          <input v-model="password" type="password" placeholder="请输入密码" autocomplete="current-password" />
        </div>
        <button type="submit" class="btn btn-primary" :disabled="loading">
          {{ loading ? '请稍候...' : (isLogin ? '🚀 登录' : '✨ 注册') }}
        </button>
      </form>
      <div class="login-footer">
        <span v-if="isLogin">还没有账号？<a @click="toggleMode">立即注册</a></span>
        <span v-else>已有账号？<a @click="toggleMode">去登录</a></span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()

const isLogin = ref(true)
const username = ref('')
const password = ref('')
const nickname = ref('')
const loading = ref(false)
const error = ref('')

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
      router.push('/chat')
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
.error-msg {
  background: var(--danger-light); color: var(--danger);
  padding: 10px 14px; border-radius: 8px; margin-bottom: 16px; font-size: 14px;
}
</style>