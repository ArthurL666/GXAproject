import { ref, nextTick, onUnmounted } from 'vue'
import { marked } from 'marked'
import api from '../api'

/**
 * SSE 流式对话 Composable
 * 封装 Spring AI Flux SSE 的消费逻辑
 */
export function useChat() {
  const messages = ref([])
  const input = ref('')
  const typing = ref(false)
  const abortController = ref(null)

  const hints = [
    '推荐北京3天行程', '成都有什么好玩的', '杭州天气怎么样',
    '推荐三亚的酒店', '去巴黎玩5天预算多少', '帮我规划西安美食之旅'
  ]

  /** 从服务器加载历史消息 */
  async function loadHistory() {
    try {
      const res = await api.get('/api/chat/history')
      if (res.data.code === 200 && res.data.data?.length) {
        messages.value = res.data.data.map(m => ({
          id: m.id,
          role: m.role,
          content: m.content,
          timestamp: m.createTime
        }))
        return true
      }
    } catch (e) { /* ignore */ }
    return false
  }

  /** 显示欢迎消息 */
  function showWelcome() {
    messages.value.push({
      role: 'assistant',
      content: '👋 你好呀！我是你的**AI旅游规划助手** ✈️\n\n'
        + '我可以帮你：\n'
        + '🌍 **规划旅行** — 告诉我目的地和天数\n'
        + '🏨 **推荐酒店** — 从五星级到特色民宿\n'
        + '⛅ **查询天气** — 出行前了解天气\n'
        + '🎯 **推荐景点** — 根据偏好筛选\n\n'
        + '现在，告诉我你想去哪里玩吧～ 🗺️',
      timestamp: new Date().toISOString()
    })
  }

  /** 初始化 — 加载历史或显示欢迎消息 */
  async function init() {
    const hasHistory = await loadHistory()
    if (!hasHistory) showWelcome()
  }

  /** 发送消息 — SSE 流式消费 */
  async function send(text) {
    const content = (text || input.value).trim()
    if (!content || typing.value) return

    // 用户消息
    messages.value.push({
      role: 'user',
      content,
      timestamp: new Date().toISOString()
    })
    input.value = ''
    typing.value = true

    // AI 消息占位
    const aiMsg = { role: 'assistant', content: '', timestamp: new Date().toISOString() }
    messages.value.push(aiMsg)

    // 取消上一次请求
    if (abortController.value) abortController.value.abort()
    abortController.value = new AbortController()

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ message: content }),
        signal: abortController.value.signal
      })

      if (!response.ok) throw new Error('HTTP ' + response.status)

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          const trimmed = line.trim()
          if (trimmed.startsWith('data:')) {
            const data = trimmed.substring(5).trim()
            if (data === '[DONE]') continue
            if (data.startsWith('{')) {
              // Spring AI 可能返回 JSON 事件
              try {
                const json = JSON.parse(data)
                if (json.result?.output?.content) {
                  aiMsg.content += json.result.output.content
                }
              } catch {
                aiMsg.content += data
              }
            } else {
              aiMsg.content += data
            }
          }
        }
      }
    } catch (e) {
      if (e.name !== 'AbortError') {
        aiMsg.content = '😢 抱歉，网络连接出现了问题，请稍后重试～'
      }
    } finally {
      typing.value = false
      abortController.value = null
    }
  }

  /** 快捷提示 */
  function sendHint(hint) {
    input.value = hint
    send(hint)
  }

  /** Enter 发送，Shift+Enter 换行 */
  function onKeydown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  /** Markdown 渲染 */
  function renderMd(text) {
    return text ? marked.parse(text) : ''
  }

  /** 时间格式化 */
  function fmtTime(ts) {
    if (!ts) return ''
    return new Date(ts).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  }

  /** 滚动到底部 */
  function scrollTo(el) {
    nextTick(() => {
      if (el) el.scrollTop = el.scrollHeight
    })
  }

  onUnmounted(() => {
    if (abortController.value) abortController.value.abort()
  })

  return {
    messages, input, typing, hints,
    init, send, sendHint, onKeydown,
    renderMd, fmtTime, scrollTo
  }
}