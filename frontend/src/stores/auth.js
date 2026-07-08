import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../api'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || '')
  const username = ref(localStorage.getItem('username') || '')
  const nickname = ref(localStorage.getItem('nickname') || '')

  const isLoggedIn = computed(() => !!token.value)
  const displayName = computed(() => nickname.value || username.value)
  const avatarChar = computed(() => displayName.value.charAt(0).toUpperCase())

  function persist() {
    localStorage.setItem('token', token.value)
    localStorage.setItem('username', username.value)
    localStorage.setItem('nickname', nickname.value)
  }

  async function login(u, p) {
    const res = await api.post('/api/auth/login', { username: u, password: p })
    if (res.data.code === 200) {
      token.value = res.data.data.token
      username.value = res.data.data.username
      nickname.value = res.data.data.nickname
      persist()
      return { success: true }
    }
    return { success: false, message: res.data.message }
  }

  async function register(u, p, n) {
    const res = await api.post('/api/auth/register', { username: u, password: p, nickname: n })
    if (res.data.code === 200) {
      token.value = res.data.data.token
      username.value = res.data.data.username
      nickname.value = res.data.data.nickname
      persist()
      return { success: true }
    }
    return { success: false, message: res.data.message }
  }

  function logout() {
    token.value = ''
    username.value = ''
    nickname.value = ''
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    localStorage.removeItem('nickname')
  }

  function updateProfile(name) {
    nickname.value = name
    localStorage.setItem('nickname', name)
  }

  return { token, username, nickname, isLoggedIn, displayName, avatarChar, login, register, logout, updateProfile }
})
