<template>
  <div class="chat-page">
    <div class="chat-main">
      <div class="chat-header">
        <h2>💬 AI 规划</h2>
        <div class="chat-header-right">
          <button class="btn btn-text btn-sm history-toggle" @click="showHistory = !showHistory" :title="showHistory ? '关闭历史' : '查看历史'">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            历史
          </button>
          <span class="ai-badge">🟢 在线</span>
        </div>
      </div>

      <!-- 历史记录面板 -->
      <div v-if="showHistory" class="history-panel">
        <div v-if="historyLoading" class="history-empty">⏳ 加载中...</div>
        <div v-else-if="!historyList.length" class="history-empty">
          <p>暂无历史对话记录</p>
        </div>
        <div v-else class="history-list-inline">
          <div
            v-for="(item, idx) in historyList"
            :key="item.id || idx"
            class="history-item"
            @click="loadHistoryItem(item)"
          >
            <span class="history-item-role">{{ item.role === 'user' ? '👤' : '' }}<AiIcon v-if="item.role === 'assistant'" :size="18" variant="primary" /></span>
            <span class="history-item-text">{{ truncate(item.content, 60) }}</span>
            <span class="history-item-time">{{ fmtTime(item.createTime) }}</span>
          </div>
        </div>
      </div>

      <div class="chat-messages" ref="msgContainer">
        <div v-for="(msg, idx) in messages" :key="msg.id || idx" class="message-row" :class="msg.role">
          <div class="msg-avatar" :class="msg.role === 'assistant' ? 'ai' : 'usr'">
            <AiIcon v-if="msg.role === 'assistant'" :size="22" variant="primary" />
            <span v-else>😊</span>
          </div>
          <div class="message-bubble">
            <!-- 流式输出中 -->
            <div v-if="msg.role === 'assistant' && msg.id === streamingMsgId" class="msg-streaming">
              <!-- 思考阶段 -->
              <div v-if="isThinking" class="msg-thinking">
                <div class="thinking-bubble">
                  <span class="thinking-icon">🧠</span>
                  <span class="thinking-label">思考中</span>
                  <span class="thinking-dots">
                    <span class="tdot">.</span>
                    <span class="tdot">.</span>
                    <span class="tdot">.</span>
                  </span>
                </div>
                <div class="thinking-sub">分析你的需求，规划最佳行程...</div>
              </div>
              <!-- 打字机输出阶段 -->
              <div v-else class="msg-typing" @click="flushTypewriter">
                <span class="typing-text">{{ streamDisplayContent }}</span>
                <span v-if="streamDisplayContent.length < streamFullContent.length" class="typing-cursor-big">▊</span>
                <span v-if="streamDisplayContent.length < streamFullContent.length" class="skip-typewriter" @click.stop="flushTypewriter" title="快速显示全部">⏭️</span>
              </div>
            </div>
            <!-- 流结束 → 渲染 markdown -->
            <div v-else-if="msg.role === 'assistant'" v-html="renderMd(msg.content)"></div>
            <div v-else>{{ msg.content }}</div>
            <div class="msg-time">{{ fmtTime(msg.timestamp) }}</div>
            <button v-if="msg.role === 'assistant' && msg.content && !(typing && idx === messages.length-1)"
              class="btn-save-plan" @click="savePlan(msg)">💾 保存行程</button>
          </div>
        </div>
      </div>

      <div class="chat-input-area">
        <div class="chat-hints">
          <span v-for="h in hints" :key="h" class="chat-hint" @click="sendHint(h)">{{ h }}</span>
        </div>
        <div class="chat-input-row">
          <textarea
            v-model="input"
            placeholder="告诉我想去哪里，我来帮你规划..."
            @keydown="onKeydown"
            :disabled="typing"
            rows="1"
          ></textarea>
          <button class="btn-send" @click="send()" :disabled="!input.trim() || typing">✈️</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useChat } from '../composables/useChat'
import api from '../api'
import { useToast } from '../composables/useToast'
import AiIcon from '../components/AiIcon.vue'

const route = useRoute()

const msgContainer = ref(null)
const {
  messages, input, typing, streamingMsgId, hints,
  isThinking, thinkPhase, streamDisplayContent, streamFullContent,
  flushTypewriter,
  init, send, sendHint, onKeydown,
  renderMd, fmtTime, scrollTo
} = useChat()

const toast = useToast()
const showHistory = ref(false)
const historyList = ref([])
const historyLoading = ref(false)
const skipAutoScroll = ref(false)

async function loadHistory() {
  historyLoading.value = true
  try {
    const res = await api.get('/api/chat/history')
    if (res.data.code === 200) {
      historyList.value = (res.data.data || []).reverse().slice(-50)
    }
  } catch (e) { /* ignore */ }
  historyLoading.value = false
}

async function loadHistoryItem(item) {
  showHistory.value = false
  if (!historyList.value.length) return
  // 阻止 watch 自动滚到底部
  skipAutoScroll.value = true
  const all = [...historyList.value].reverse()
  const targetIdx = all.findIndex(m => m.role === item.role && m.content === item.content)
  if (targetIdx < 0) { skipAutoScroll.value = false; return }
  messages.value = all.map(m => ({
    role: m.role,
    content: m.content,
    timestamp: m.createTime
  }))
  nextTick(() => {
    const container = msgContainer.value
    if (!container) { skipAutoScroll.value = false; return }
    const rows = container.querySelectorAll('.message-row')
    if (rows[targetIdx]) {
      container.scrollTop = rows[targetIdx].offsetTop - container.clientHeight / 2 + rows[targetIdx].clientHeight / 2
    }
    skipAutoScroll.value = false
  })
}

/** 中文数字映射 */
const CN_NUM_MAP = { '一':1,'二':2,'三':3,'四':4,'五':5,'六':6,'七':7,'八':8,'九':9,'十':10 }

async function savePlan(msg) {
  let city = ''
  let days = null
  const content = msg.content

  // ── 城市提取（多种模式） ──
  // 1) "北京3天" / "成都5天" (2-4汉字紧跟天数)
  let m = content.match(/[一-龥]{2,4}(?=\s*\d{1,2}\s*天)/)
  // 2) "目的地：北京" / "城市：成都"
  if (!m) m = content.match(/目(?:的地|城市)[：:]\s*([一-龥]{2,4})/)
  // 3) "去北京玩" / "前往成都"
  if (!m) m = content.match(/[去往前到]\s*([一-龥]{2,4})/)
  // 4) "北京之旅" / "成都行程"
  if (!m) m = content.match(/([一-龥]{2,4})[之行之旅旅行行程游游玩度假]/)
  // 5) 标题中的城市 "北京站" / "成都篇"
  if (!m) m = content.match(/^#+\s*([一-龥]{2,4})/)
  if (!m) m = content.match(/[【「『]([一-龥]{2,4})[】」』]/)
  if (m) city = m[1] || m[0]

  // ── 天数提取（多种模式） ──
  // 1) "3天" / "5 天"
  let d = content.match(/(\d+)\s*天/)
  // 2) "三日" / "五天" (中文数字)
  if (!d) d = content.match(/[一二三四五六七八九十]+(?=日|天)/)
  // 3) "3日游" / "5日行程"
  if (!d) d = content.match(/(\d+)\s*日/)
  // 4) "day 3" / "Day3"
  if (!d) d = content.match(/[Dd]ay\s*(\d+)/)
  // 5) "三日游" (中文数字)
  if (!d) d = content.match(/第?([一二三四五六七八九十])[天日]/)
  if (d) {
    const num = parseInt(d[1])
    if (!isNaN(num)) days = num
    else days = CN_NUM_MAP[d[1]] || null
  }
  if (!days) days = (content.match(/Day\s*(\d+)/gi) || [])
    .map(x => parseInt(x.match(/\d+/)[0]))
    .filter(Boolean)
    .sort((a,b) => b-a)[0] || null

  if (!city) city = prompt('请输入目的地城市：')
  if (!days) days = parseInt(prompt('请输入旅行天数：') || '0')
  if (!city || !days) { toast.error('保存失败：城市或天数不能为空'); return }
  try {
    await api.post('/api/chat/plan/save', { city, days, content: msg.content, preferences: '' })
    toast.success('✅ 行程已保存到「我的行程」')
  } catch (e) {
    toast.error('保存失败，请重试')
  }
}

function truncate(text, max) {
  return text?.length > max ? text.slice(0, max) + '...' : text || ''
}

watch(showHistory, (val) => {
  if (val) loadHistory()
})

onMounted(() => {
  init()
  scrollTo(msgContainer.value)
  // 从首页/目的地带入的文字 → 填入输入框
  const q = route.query.q
  if (q) {
    nextTick(() => {
      input.value = q
    })
  }
})

watch(messages, () => {
  if (!skipAutoScroll.value) scrollTo(msgContainer.value)
}, { deep: true })
</script>

<style scoped>
.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.chat-header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.history-toggle {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  font-size: 13px;
  color: var(--text-secondary);
}

.history-toggle:hover {
  color: var(--primary);
  background: rgba(14,165,233,0.08);
  border-radius: 8px;
}

/* 历史面板 */
.history-panel {
  background: #fff;
  border-bottom: 1px solid var(--border);
  max-height: 240px;
  overflow-y: auto;
  padding: 8px 16px;
  animation: slideDown 0.2s ease-out;
}

@keyframes slideDown {
  from { opacity: 0; max-height: 0; padding: 0 16px; }
  to { opacity: 1; max-height: 240px; padding: 8px 16px; }
}

.history-empty {
  text-align: center;
  padding: 20px;
  color: var(--text-light);
  font-size: 14px;
}

.history-list-inline {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s;
}

.history-item:hover {
  background: var(--bg);
}

.history-item-role {
  font-size: 16px;
  flex-shrink: 0;
}

.history-item-text {
  flex: 1;
  font-size: 13px;
  color: var(--text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.history-item-time {
  font-size: 11px;
  color: var(--text-light);
  flex-shrink: 0;
}

/* ===== 打字机流式文本 ===== */
.msg-streaming {
  white-space: pre-wrap; line-height: 1.7;
  font-size: 14px; color: var(--text);
  min-height: 28px;
}

/* 思考阶段 */
.msg-thinking {
  padding: 8px 0;
}
.thinking-bubble {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}
.thinking-icon {
  font-size: 20px;
  animation: thinkPulse 2s ease-in-out infinite;
}
.thinking-label {
  font-weight: 600;
  font-size: 14px;
  color: var(--text-secondary);
}
.thinking-dots {
  display: inline-flex;
  gap: 2px;
}
.tdot {
  font-size: 20px;
  font-weight: 700;
  color: var(--primary);
  animation: dotBounce 1.4s ease-in-out infinite;
}
.tdot:nth-child(2) { animation-delay: 0.2s; }
.tdot:nth-child(3) { animation-delay: 0.4s; }
@keyframes dotBounce {
  0%, 80%, 100% { transform: translateY(0); opacity: 0.3; }
  40% { transform: translateY(-4px); opacity: 1; }
}
@keyframes thinkPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}
.thinking-sub {
  font-size: 12px;
  color: var(--text-light);
  padding-left: 28px;
  animation: fadeInOut 3s ease-in-out infinite;
}
@keyframes fadeInOut {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

/* 打字机输出阶段 */
.msg-typing {
  white-space: pre-wrap;
  word-break: break-word;
  cursor: pointer;
  position: relative;
}
.typing-text {
  font-size: 14px;
  line-height: 1.8;
  color: var(--text);
}
.typing-cursor-big {
  display: inline-block;
  font-size: 14px;
  color: var(--primary);
  margin-left: 1px;
  animation: blink 0.8s step-end infinite;
  vertical-align: text-bottom;
  line-height: 1;
}
.skip-typewriter {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  margin-left: 6px;
  opacity: 0.4;
  transition: opacity 0.2s;
  cursor: pointer;
  vertical-align: middle;
}
.skip-typewriter:hover {
  opacity: 1;
}
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

</style>
