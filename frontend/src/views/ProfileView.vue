<template>
  <div class="page-container">
    <div class="page-header">
      <h2>👤 个人中心</h2>
      <p>管理个人信息与旅行偏好</p>
    </div>

    <!-- 顶部统计横幅 -->
    <div class="stats-banner">
      <div class="stat-item">
        <span class="stat-icon">📋</span>
        <div class="stat-info">
          <span class="stat-value">{{ planCount }}</span>
          <span class="stat-label">已保存行程</span>
        </div>
      </div>
      <div class="stat-item">
        <span class="stat-icon">🏆</span>
        <div class="stat-info">
          <span class="stat-value">{{ travelStyles.find(s => s.value === preferences.style)?.label || '未设置' }}</span>
          <span class="stat-label">出行风格</span>
        </div>
      </div>
      <div class="stat-item">
        <span class="stat-icon">📅</span>
        <div class="stat-info">
          <span class="stat-value">{{ profile.createTime ? formatDate(profile.createTime) : '--' }}</span>
          <span class="stat-label">注册时间</span>
        </div>
      </div>
      <div class="stat-item">
        <span class="stat-icon">💎</span>
        <div class="stat-info">
          <span class="stat-value">{{ budgets.find(b => b.value === preferences.budget)?.label.replace(/[💰💵💎]\s*/, '') || '未设置' }}</span>
          <span class="stat-label">预算偏好</span>
        </div>
      </div>
    </div>

    <!-- 双列布局：基本信息 + 账户信息 -->
    <div class="profile-two-col">
      <!-- 个人信息卡片 -->
      <div class="profile-section">
        <div class="profile-section-header">
          <h3>📋 基本信息</h3>
        </div>
        <div class="profile-card">
          <div class="profile-avatar-section">
            <div class="profile-avatar">{{ displayName.charAt(0).toUpperCase() }}</div>
            <div class="profile-name">{{ displayName }}</div>
            <div class="profile-username">@{{ profile.username }}</div>
          </div>

          <div class="profile-fields">
            <div class="form-group">
              <label>😊 昵称</label>
              <div class="field-row">
                <input v-model="nickname" :disabled="!editing" placeholder="给自己取个好听的昵称" />
                <button v-if="!editing" class="btn btn-text btn-sm" @click="editing = true">✏️ 编辑</button>
              </div>
            </div>
            <div v-if="editing" class="form-actions">
              <button class="btn btn-primary" @click="saveProfile" :disabled="saving" style="width:auto;">
                {{ saving ? '保存中...' : '💾 保存资料' }}
              </button>
              <button class="btn btn-outline" @click="cancelEdit" style="width:auto;">取消</button>
            </div>
          </div>
        </div>
      </div>

      <!-- 账户信息 -->
      <div class="profile-section">
        <div class="profile-section-header">
          <h3>📅 账户信息</h3>
        </div>
        <div class="profile-card">
          <div class="profile-info-list">
            <div class="profile-info-row">
              <span class="info-key">👤 用户名</span>
              <span class="info-value">{{ profile.username }}</span>
            </div>
            <div class="profile-info-row">
              <span class="info-key">📅 注册时间</span>
              <span class="info-value">{{ profile.createTime || '未知' }}</span>
            </div>
            <div class="profile-info-row">
              <span class="info-key">📋 已保存行程</span>
              <span class="info-value badge-value">{{ planCount }} 个</span>
            </div>
            <div class="profile-info-row">
              <span class="info-key">🔒 账户状态</span>
              <span class="info-value">
                <span class="status-dot active"></span> 正常
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 旅行偏好卡片 -->
    <div class="profile-section">
      <div class="profile-section-header">
        <h3>🎯 旅行偏好</h3>
        <p>帮助我们为你推荐更合适的旅行方案</p>
      </div>
      <div class="profile-card">
        <div class="pref-grid">
          <!-- 出行风格 -->
          <div class="pref-group">
            <label>出行风格</label>
            <div class="pref-options">
              <button
                v-for="style in travelStyles"
                :key="style.value"
                class="pref-btn"
                :class="{ active: preferences.style === style.value }"
                @click="preferences.style = style.value"
              >
                {{ style.icon }} {{ style.label }}
              </button>
            </div>
          </div>

          <!-- 预算范围 -->
          <div class="pref-group">
            <label>预算范围</label>
            <div class="pref-options">
              <button
                v-for="b in budgets"
                :key="b.value"
                class="pref-btn"
                :class="{ active: preferences.budget === b.value }"
                @click="preferences.budget = b.value"
              >
                {{ b.label }}
              </button>
            </div>
          </div>

          <!-- 偏好季节 -->
          <div class="pref-group">
            <label>偏好季节</label>
            <div class="pref-options">
              <button
                v-for="s in seasons"
                :key="s.value"
                class="pref-btn"
                :class="{ active: preferences.season === s.value }"
                @click="preferences.season = s.value"
              >
                {{ s.icon }} {{ s.label }}
              </button>
            </div>
          </div>

          <!-- 同行人数 -->
          <div class="pref-group">
            <label>常与谁同行</label>
            <div class="pref-options">
              <button
                v-for="c in companions"
                :key="c.value"
                class="pref-btn"
                :class="{ active: preferences.companion === c.value }"
                @click="preferences.companion = c.value"
              >
                {{ c.icon }} {{ c.label }}
              </button>
            </div>
          </div>
        </div>

        <div class="form-actions" style="margin-top:20px;">
          <button class="btn btn-primary" @click="savePreferences" :disabled="prefSaving" style="width:auto;">
            {{ prefSaving ? '保存中...' : '💾 保存偏好' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '../api'
import { useAuthStore } from '../stores/auth'
import { useToast } from '../composables/useToast'

const auth = useAuthStore()
const toast = useToast()

const displayName = computed(() => auth.displayName)
const profile = ref({ username: '', nickname: '', createTime: '' })
const nickname = ref('')
const editing = ref(false)
const saving = ref(false)
const planCount = ref(0)

// 旅行偏好
const prefSaving = ref(false)
const preferences = ref({
  style: 'relax',
  budget: 'medium',
  season: 'all',
  companion: 'alone'
})

const travelStyles = [
  { value: 'relax', icon: '🧘', label: '休闲度假' },
  { value: 'adventure', icon: '🧗', label: '探险户外' },
  { value: 'culture', icon: '🏛️', label: '文化历史' },
  { value: 'food', icon: '🍜', label: '美食之旅' },
  { value: 'shopping', icon: '🛍️', label: '购物休闲' }
]

const budgets = [
  { value: 'budget', label: '💰 经济实惠' },
  { value: 'medium', label: '💵 适中舒适' },
  { value: 'luxury', label: '💎 高端品质' }
]

const seasons = [
  { value: 'spring', icon: '🌸', label: '春季' },
  { value: 'summer', icon: '☀️', label: '夏季' },
  { value: 'autumn', icon: '🍁', label: '秋季' },
  { value: 'winter', icon: '❄️', label: '冬季' },
  { value: 'all', icon: '🌟', label: '不限' }
]

const companions = [
  { value: 'alone', icon: '🚶', label: '独自' },
  { value: 'couple', icon: '💑', label: '情侣' },
  { value: 'family', icon: '👨‍👩‍👧‍👦', label: '家庭' },
  { value: 'friends', icon: '👫', label: '朋友' }
]

onMounted(() => load())

async function load() {
  try {
    const [profileRes, planRes] = await Promise.all([
      api.get('/api/user/profile'),
      api.get('/api/chat/plan/list').catch(() => ({ data: { data: [] } }))
    ])
    if (profileRes.data.code === 200) {
      profile.value = profileRes.data.data
      nickname.value = profile.value.nickname || ''
      // 加载已保存的偏好
      if (profile.value.preferences) {
        Object.assign(preferences.value, profile.value.preferences)
      }
    }
    planCount.value = planRes.data?.data?.length || 0
  } catch (e) { toast.error('加载失败') }
}

function formatDate(dateStr) {
  if (!dateStr) return '--'
  try {
    const d = new Date(dateStr)
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}/${m}/${day}`
  } catch { return dateStr }
}

async function saveProfile() {
  saving.value = true
  try {
    const res = await api.put('/api/user/profile', { nickname: nickname.value })
    if (res.data.code === 200) {
      profile.value.nickname = nickname.value
      auth.updateProfile(nickname.value)
      editing.value = false
      toast.success('✅ 资料已保存')
    } else {
      toast.error(res.data.message || '保存失败')
    }
  } catch (e) { toast.error('保存失败') }
  saving.value = false
}

function cancelEdit() {
  nickname.value = profile.value.nickname || ''
  editing.value = false
}

async function savePreferences() {
  prefSaving.value = true
  try {
    const res = await api.put('/api/user/profile', {
      nickname: nickname.value,
      preferences: preferences.value
    })
    if (res.data.code === 200) {
      toast.success('✅ 旅行偏好已保存')
    } else {
      toast.error(res.data.message || '保存失败')
    }
  } catch (e) { toast.error('保存失败') }
  prefSaving.value = false
}
</script>

<style scoped>
/* ===== 统计横幅 ===== */
.stats-banner {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 28px;
}

.stat-item {
  background: #fff;
  border-radius: var(--radius-lg);
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border);
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.stat-icon {
  font-size: 28px;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: var(--bg);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.stat-value {
  font-size: 15px;
  font-weight: 700;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.stat-label {
  font-size: 12px;
  color: var(--text-light);
  margin-top: 2px;
}

/* ===== 双列布局 ===== */
.profile-two-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 24px;
}

/* ===== 分段 ===== */
.profile-section {
  display: flex;
  flex-direction: column;
}

.profile-section-header {
  margin-bottom: 12px;
}

.profile-section-header h3 {
  font-size: 17px;
  font-weight: 700;
  color: var(--text);
  margin: 0;
}

.profile-section-header p {
  font-size: 13px;
  color: var(--text-secondary);
  margin: 2px 0 0;
}

/* ===== 卡片 ===== */
.profile-card {
  flex: 1;
  background: #fff;
  border-radius: var(--radius-xl);
  padding: 28px;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border);
}

/* ===== 头像区 ===== */
.profile-avatar-section {
  text-align: center;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border);
}

.profile-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--gradient-primary);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 12px;
  box-shadow: 0 4px 14px rgba(14,165,233,0.3);
}

.profile-name {
  font-size: 18px;
  font-weight: 700;
  color: var(--text);
}

.profile-username {
  font-size: 13px;
  color: var(--text-light);
  margin-top: 2px;
}

/* ===== 表单字段 ===== */
.profile-fields {
  max-width: 100%;
}

.field-row {
  display: flex;
  gap: 8px;
  align-items: center;
}

.field-row input {
  flex: 1;
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 8px;
}

/* ===== 账户信息列表 ===== */
.profile-info-list {
  display: flex;
  flex-direction: column;
}

.profile-info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 0;
  border-bottom: 1px solid var(--border);
  font-size: 14px;
}

.profile-info-row:last-child {
  border-bottom: none;
}

.info-key {
  color: var(--text-secondary);
  font-weight: 500;
}

.info-value {
  color: var(--text);
  font-weight: 600;
}

.badge-value {
  background: var(--bg);
  padding: 2px 12px;
  border-radius: 20px;
  font-size: 13px;
  color: var(--primary);
}

.status-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 6px;
  vertical-align: middle;
}

.status-dot.active {
  background: var(--success);
  box-shadow: 0 0 6px rgba(16,185,129,0.4);
}

/* ===== 偏好网格 ===== */
.pref-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.pref-group label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 10px;
}

.pref-options {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.pref-btn {
  padding: 10px 18px;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: #fff;
  color: var(--text-secondary);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.pref-btn:hover {
  border-color: var(--primary-light);
  color: var(--primary);
  background: rgba(14,165,233,0.04);
}

.pref-btn.active {
  background: var(--gradient-primary);
  color: #fff;
  border-color: transparent;
  box-shadow: 0 2px 8px rgba(14,165,233,0.25);
}

/* ===== 响应式 ===== */
@media (max-width: 1024px) {
  .stats-banner {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .profile-two-col {
    grid-template-columns: 1fr;
  }

  .stats-banner {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .stat-item {
    padding: 14px;
    gap: 12px;
  }

  .stat-icon {
    width: 40px;
    height: 40px;
    font-size: 22px;
  }

  .pref-grid {
    grid-template-columns: 1fr;
    gap: 18px;
  }

  .profile-card {
    padding: 20px;
  }
}
</style>
