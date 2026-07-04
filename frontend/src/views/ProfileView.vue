<template>
  <div class="page-container">
    <div class="page-header">
      <h2>👤 个人中心</h2>
      <p>管理您的个人信息</p>
    </div>

    <div class="profile-card">
      <div class="profile-avatar-section">
        <div class="profile-avatar">{{ profile.nickname ? profile.nickname.charAt(0).toUpperCase() : 'U' }}</div>
      </div>

      <div class="form-group">
        <label>👤 用户名</label>
        <input :value="profile.username" disabled />
      </div>
      <div class="form-group">
        <label>😊 昵称</label>
        <input v-model="nickname" :disabled="!editing" placeholder="请输入昵称" />
      </div>
      <div class="form-group">
        <label>📅 注册时间</label>
        <input :value="profile.createTime" disabled />
      </div>

      <div style="display:flex;gap:12px;margin-top:8px;">
        <button v-if="!editing" class="btn btn-primary" @click="editing = true" style="width:auto;">✏️ 编辑资料</button>
        <template v-else>
          <button class="btn btn-primary" @click="save" :disabled="saving" style="width:auto;">
            {{ saving ? '保存中...' : '💾 保存' }}
          </button>
          <button class="btn btn-outline" @click="cancel" style="width:auto;">取消</button>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../api'
import { useAuthStore } from '../stores/auth'
import { useToast } from '../composables/useToast'

const auth = useAuthStore()
const toast = useToast()
const profile = ref({ username: '', nickname: '', createTime: '' })
const nickname = ref('')
const editing = ref(false)
const saving = ref(false)

onMounted(() => load())

async function load() {
  try {
    const res = await api.get('/api/user/profile')
    if (res.data.code === 200) {
      profile.value = res.data.data
      nickname.value = profile.value.nickname || ''
    }
  } catch (e) { toast.error('加载失败') }
}

async function save() {
  saving.value = true
  try {
    const res = await api.put('/api/user/profile', { nickname: nickname.value })
    if (res.data.code === 200) {
      profile.value.nickname = nickname.value
      auth.updateProfile(nickname.value)
      editing.value = false
      toast.success('保存成功')
    } else {
      toast.error(res.data.message || '保存失败')
    }
  } catch (e) { toast.error('保存失败') }
  saving.value = false
}

function cancel() {
  nickname.value = profile.value.nickname || ''
  editing.value = false
}
</script>