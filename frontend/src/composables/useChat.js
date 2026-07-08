import { ref, nextTick, onUnmounted } from 'vue'
import { marked } from 'marked'
import api from '../api'

/**
 * SSE 流式对话 Composable
 * - 逐字输出效果（打字机模式）
 * - 思考过程显示
 * - 流结束后渲染 Markdown
 */
export function useChat() {
  const messages = ref([])
  const input = ref('')
  const typing = ref(false)
  const abortController = ref(null)
  const streamingMsgId = ref(null)

  // ===== 打字机状态 =====
  const isThinking = ref(false)          // 思考中（等待首批token）
  const thinkPhase = ref(0)              // 思考阶段 (0-3)
  const streamDisplayContent = ref('')   // 当前已显示的内容（逐步揭示）
  const streamFullContent = ref('')      // SSE 接收到的完整内容（缓冲区）
  const typewriterSpeed = ref(30)        // 每字符间隔(ms)，SSE收到后加快

  let typewriterTimer = null
  let thinkPhaseTimer = null
  let lastBufferLength = 0
  let streamStartTime = 0
  let isStreamDone = false               // SSE流是否已结束

  const hints = [
    '推荐北京3天行程', '成都有什么好玩的', '杭州天气怎么样',
    '推荐三亚的酒店', '去巴黎玩5天预算多少', '帮我规划西安美食之旅'
  ]

  let msgIdCounter = 0

  // ===== 思考阶段消息 =====
  const thinkMessages = [
    { icon: '🧠', text: '思考中', dots: true },
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
      id: 'welcome',
      role: 'assistant',
      content: '👋 你好呀！我是你的 **AI 旅游规划助手** ✈️\n\n'
        + '我可以帮你：\n'
        + '🌍 **规划旅行** — 告诉我目的地和天数\n'
        + '🏨 **推荐酒店** — 从五星级到特色民宿\n'
        + '⛅ **查询天气** — 出行前了解天气\n'
        + '🎯 **推荐景点** — 根据偏好筛选\n\n'
        + '现在，告诉我你想去哪里玩吧～ 🗺️',
      timestamp: new Date().toISOString()
    })
  }

  /** 初始化 */
  async function init() {
    const hasHistory = await loadHistory()
    if (!hasHistory) showWelcome()
  }

  // ===== 打字机控制 =====

  /** 启动打字机效果 */
  function startTypewriter(speed) {
    stopTypewriter()
    const ms = speed || typewriterSpeed.value
    isStreamDone = false

    typewriterTimer = setInterval(() => {
      const fullLen = streamFullContent.value.length
      const displayLen = streamDisplayContent.value.length

      if (displayLen < fullLen) {
        // 动态速度：缓冲区越大速度越快
        const bufferAhead = fullLen - displayLen
        let step = 1

        if (bufferAhead > 500) {
          step = 5          // 大缓冲区，一次多个字符
        } else if (bufferAhead > 200) {
          step = 3
        } else if (bufferAhead > 80) {
          step = 2
        }

        const newLen = Math.min(displayLen + step, fullLen)
        streamDisplayContent.value = streamFullContent.value.slice(0, newLen)
        lastBufferLength = bufferAhead
      } else if (isStreamDone) {
        // 流已结束且缓冲区耗尽 → 结束打字机
        stopTypewriter()
        finishStreaming()
      }
      // 流未结束但缓冲区用尽 → 继续等待
    }, ms)
  }

  /** 停止打字机 */
  function stopTypewriter() {
    if (typewriterTimer) {
      clearInterval(typewriterTimer)
      typewriterTimer = null
    }
  }

  /** 立即显示所有剩余内容 */
  function flushTypewriter() {
    stopTypewriter()
    streamDisplayContent.value = streamFullContent.value
    if (isStreamDone) {
      finishStreaming()
    }
  }

  /** 结束流式状态，触发 Markdown 渲染 */
  function finishStreaming() {
    if (!streamingMsgId.value) return
    stopTypewriter()
    stopThinkPhase()
    typing.value = false
    streamingMsgId.value = null
    isStreamDone = false
  }

  // ===== 思考阶段动画 =====

  function startThinkPhase() {
    stopThinkPhase()
    isThinking.value = true
    thinkPhase.value = 0

    thinkPhaseTimer = setInterval(() => {
      thinkPhase.value = (thinkPhase.value + 1) % thinkMessages.length
    }, 2000)
  }

  function stopThinkPhase() {
    if (thinkPhaseTimer) {
      clearInterval(thinkPhaseTimer)
      thinkPhaseTimer = null
    }
    isThinking.value = false
  }

  /** 重置打字机状态 */
  function resetTypewriter() {
    stopTypewriter()
    stopThinkPhase()
    streamDisplayContent.value = ''
    streamFullContent.value = ''
    isThinking.value = false
    isStreamDone = false
    lastBufferLength = 0
    streamStartTime = 0
  }

  /** 发送消息 — SSE 流式消费 + 打字机逐字输出 */
  async function send(text) {
    const content = (text || input.value).trim()
    if (!content || typing.value) return

    messages.value.push({
      id: 'user-' + (++msgIdCounter),
      role: 'user',
      content,
      timestamp: new Date().toISOString()
    })
    input.value = ''
    typing.value = true

    const msgId = 'ai-' + (++msgIdCounter)
    streamingMsgId.value = msgId
    const aiMsg = { id: msgId, role: 'assistant', content: '', timestamp: new Date().toISOString() }
    messages.value.push(aiMsg)

    // 重置打字机
    resetTypewriter()
    startThinkPhase()
    streamStartTime = Date.now()

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
      let dataLines = []

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
            dataLines.push(data)
          } else if (trimmed === '' && dataLines.length) {
            const eventData = dataLines.join('\n')
            dataLines = []

            let chunk = ''
            if (eventData.startsWith('{')) {
              try {
                const json = JSON.parse(eventData)
                chunk = json.result?.output?.content || json.choices?.[0]?.delta?.content || ''
              } catch { chunk = eventData }
            } else {
              chunk = eventData
            }

            if (chunk) {
              // 追加到完整内容
              streamFullContent.value += chunk
              aiMsg.content += chunk

              // 首批 token 到达 → 关闭思考状态，启动打字机
              if (isThinking.value) {
                stopThinkPhase()
                isThinking.value = false
                const elapsed = Date.now() - streamStartTime
                // 根据等待时间动态调整初始速度
                const speed = elapsed > 3000 ? 18 : 25
                startTypewriter(speed)
              } else if (!typewriterTimer) {
                // 打字机未启动（异常情况），启动它
                startTypewriter()
              }
            }
          }
        }
      }

      // 末尾残留
      if (dataLines.length) {
        const eventData = dataLines.join('\n')
        let chunk = ''
        if (eventData.startsWith('{')) {
          try {
            const json = JSON.parse(eventData)
            chunk = json.result?.output?.content || json.choices?.[0]?.delta?.content || ''
          } catch { chunk = eventData }
        } else {
          chunk = eventData
        }
        if (chunk) {
          streamFullContent.value += chunk
          aiMsg.content += chunk
        }
      }

      // SSE 流结束 → 标记完成
      isStreamDone = true

      // 如果打字机缓冲区已耗尽，立即结束
      if (streamDisplayContent.value.length >= streamFullContent.value.length) {
        finishStreaming()
      }
      // 否则打字机会在下一个 tick 检测到 isStreamDone 并结束

    } catch (e) {
      if (e.name !== 'AbortError') {
        aiMsg.content = '😢 抱歉，网络连接出现了问题，请稍后重试～'
        finishStreaming()
      } else {
        // 用户主动中止
        isStreamDone = true
        if (streamDisplayContent.value.length >= streamFullContent.value.length) {
          finishStreaming()
        }
      }
    }
  }

  /** 快捷提示 */
  function sendHint(hint) {
    input.value = hint
    send(hint)
  }

  /** Enter 发送 */
  function onKeydown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  /** Markdown 渲染（保留换行） */
  function renderMd(text) {
    if (!text) return ''
    // breaks:true 让单换行转 <br>，gfm:true 启用 GitHub 风格 Markdown
    return marked.parse(text, { breaks: true, gfm: true }).replace(/\*\*/g, '')
  }

  function fmtTime(ts) {
    if (!ts) return ''
    return new Date(ts).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  }

  function scrollTo(el) {
    nextTick(() => {
      if (el) el.scrollTop = el.scrollHeight
    })
  }

  onUnmounted(() => {
    stopTypewriter()
    stopThinkPhase()
    if (abortController.value) abortController.value.abort()
  })

  return {
    messages, input, typing, streamingMsgId, hints,
    isThinking, thinkPhase, streamDisplayContent, streamFullContent,
    typewriterSpeed,
    flushTypewriter,
    init, send, sendHint, onKeydown,
    renderMd, fmtTime, scrollTo
  }
}
