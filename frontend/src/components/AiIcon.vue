<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 64 64"
    xmlns="http://www.w3.org/2000/svg"
    :class="cls"
    :style="{ display: 'inline-block', verticalAlign: 'middle' }"
  >
    <!-- 玻璃质感背景 -->
    <rect
      x="2" y="2" width="60" height="60" rx="14"
      :fill="bgFill"
      :stroke="bgStroke"
      stroke-width="1"
    />
    <!-- 纸飞机主体 -->
    <path
      d="M32 8 L44 36 L32 31 L20 36Z"
      fill="white"
      opacity="0.92"
    />
    <!-- 手柄 -->
    <rect x="30" y="14" width="4" height="18" rx="2" :fill="handleColor" />
    <!-- 目的地标记 -->
    <circle cx="32" cy="46" r="4" fill="#FBBF24" />
  </svg>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  size: { type: [Number, String], default: 36 },
  variant: { type: String, default: 'light' }, // 'light' or 'primary'
  cls: { type: String, default: '' }
})

const bgFill = computed(() => {
  return props.variant === 'primary' ? '#DBEAFE' : 'rgba(255,255,255,0.06)'
})

const bgStroke = computed(() => {
  return props.variant === 'primary' ? 'rgba(255,255,255,0.1)' : 'rgba(14,165,233,0.2)'
})

const handleColor = computed(() => {
  return props.variant === 'primary' ? 'rgba(0,0,0,0.35)' : 'rgba(14,165,233,0.5)'
})
</script>
