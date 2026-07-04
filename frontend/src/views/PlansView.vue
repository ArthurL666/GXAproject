<template>
  <div class="page-container">
    <div class="page-header">
      <h2>🗺️ 我的行程</h2>
      <p>已保存的旅行计划</p>
    </div>

    <div v-if="loading" class="empty-state"><p>⏳ 加载中...</p></div>

    <div v-else-if="!plans.length" class="empty-state">
      <span class="icon">🗺️</span>
      <h3>暂无旅行计划</h3>
      <p>去和AI助手聊天，规划好行程后在对话中保存即可查看～</p>
    </div>

    <div v-else class="plans-grid">
      <div v-for="plan in plans" :key="plan.id" class="plan-card">
        <div class="plan-card-top">
          <span class="plan-city">📍 {{ plan.city || '未知城市' }}</span>
          <span class="plan-days" v-if="plan.days">📅 {{ plan.days }} 天</span>
        </div>
        <div class="plan-content">{{ truncate(plan.content, 120) }}</div>
        <div class="plan-footer">
          <span class="plan-time">📅 {{ fmtTime(plan.createTime) }}</span>
          <button class="btn btn-text btn-sm" @click="del(plan.id)" style="color:var(--danger);">🗑️</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../api'
import { useToast } from '../composables/useToast'

const plans = ref([])
const loading = ref(true)
const toast = useToast()

onMounted(() => load())

async function load() {
  loading.value = true
  try {
    const res = await api.get('/api/chat/plan/list')
    if (res.data.code === 200) plans.value = res.data.data || []
  } catch (e) { toast.error('加载失败') }
  loading.value = false
}

async function del(id) {
  if (!confirm('确定删除这个行程吗？')) return
  try {
    await api.delete(`/api/chat/plan/${id}`)
    plans.value = plans.value.filter(p => p.id !== id)
    toast.success('删除成功')
  } catch (e) { toast.error('删除失败') }
}

function truncate(text, max) { return text?.length > max ? text.slice(0, max) + '...' : text || '暂无详情' }
function fmtTime(ts) {
  if (!ts) return ''
  return new Date(ts).toLocaleString('zh-CN', { month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' })
}
</script>