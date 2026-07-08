<template>
  <div class="page-container">
    <div class="page-header" style="display:flex;align-items:center;justify-content:space-between;">
      <div>
        <h2>📋 历史对话记录</h2>
        <p>查看您与游伴AI的对话历史</p>
      </div>
      <button v-if="messages.length" class="btn btn-outline btn-sm" @click="clearAll">🗑️ 清空记录</button>
    </div>

    <div v-if="loading" class="empty-state"><p>⏳ 加载中...</p></div>

    <div v-else-if="!messages.length" class="empty-state">
      <span class="icon">💬</span>
      <h3>暂无对话记录</h3>
      <p>去和AI助手聊聊天吧，你的对话会自动保存～</p>
    </div>

    <div v-else class="history-list">
      <div v-for="msg in messages" :key="msg.id" class="history-card">
        <span class="role-badge" :class="msg.role"><span v-if="msg.role === 'assistant'"><AiIcon :size="14" variant="primary" /> AI</span><span v-else>👤 我</span></span>
        <div class="history-text">{{ truncate(msg.content, 200) }}</div>
        <div style="display:flex;align-items:center;gap:12px;">
          <span class="history-time">{{ fmtTime(msg.createTime) }}</span>
          <button class="btn btn-text btn-sm" @click="del(msg.id)" style="color:var(--danger);">🗑️</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../api'
import { useToast } from '../composables/useToast'
import AiIcon from '../components/AiIcon.vue'

const messages = ref([])
const loading = ref(true)
const toast = useToast()

onMounted(() => load())

async function load() {
  loading.value = true
  try {
    const res = await api.get('/api/chat/history')
    if (res.data.code === 200) messages.value = (res.data.data || []).reverse()
  } catch (e) { toast.error('加载失败') }
  loading.value = false
}

async function del(id) {
  try {
    await api.delete(`/api/chat/history/${id}`)
    messages.value = messages.value.filter(m => m.id !== id)
    toast.success('删除成功')
  } catch (e) { toast.error('删除失败') }
}

async function clearAll() {
  if (!confirm('确定清空所有对话记录吗？')) return
  try {
    await api.delete('/api/chat/history')
    messages.value = []
    toast.success('已清空')
  } catch (e) { toast.error('清空失败') }
}

function truncate(text, max) { return text?.length > max ? text.slice(0, max) + '...' : text }
function fmtTime(ts) {
  if (!ts) return ''
  return new Date(ts).toLocaleString('zh-CN', { month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' })
}
</script>
