<template>
  <div class="chat-page">
    <div class="chat-main">
      <div class="chat-header">
        <h2>💬 AI 对话</h2>
        <span class="ai-badge">🟢 在线</span>
      </div>

      <div class="chat-messages" ref="msgContainer">
        <div v-for="(msg, idx) in messages" :key="idx" class="message-row" :class="msg.role">
          <div class="msg-avatar" :class="msg.role === 'assistant' ? 'ai' : 'usr'">
            {{ msg.role === 'assistant' ? '🤖' : '😊' }}
          </div>
          <div class="message-bubble">
            <div v-if="msg.role === 'assistant'" v-html="renderMd(msg.content)"></div>
            <div v-else>{{ msg.content }}</div>
            <div v-if="typing && idx === messages.length-1 && !msg.content" class="typing-cursor"></div>
            <div class="msg-time">{{ fmtTime(msg.timestamp) }}</div>
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
import { ref, onMounted, watch } from 'vue'
import { useChat } from '../composables/useChat'

const msgContainer = ref(null)
const {
  messages, input, typing, hints,
  init, send, sendHint, onKeydown,
  renderMd, fmtTime, scrollTo
} = useChat()

onMounted(() => {
  init()
  scrollTo(msgContainer.value)
})

// 消息更新时自动滚动
watch(messages, () => scrollTo(msgContainer.value), { deep: true })
</script>