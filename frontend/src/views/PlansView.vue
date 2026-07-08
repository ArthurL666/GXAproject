<template>
  <div class="page-container">
    <div class="page-header">
      <div class="header-left">
        <h2>📋 我的行程</h2>
        <p v-if="plans.length">共 {{ plans.length }} 个旅行计划</p>
        <p v-else>已保存的旅行计划，可随时查看</p>
      </div>
      <button v-if="plans.length" class="btn btn-outline btn-sm" @click="refresh">🔄 刷新</button>
    </div>

    <!-- ========== 加载中 ========== -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner" />
      <p class="loading-text">加载中...</p>
    </div>

    <!-- ========== 空状态 ========== -->
    <div v-else-if="!plans.length" class="empty-state">
      <span class="empty-icon">🗺️</span>
      <h3>暂无旅行计划</h3>
      <p>去 AI 规划中聊聊目的地，保存行程后就会出现在这里 ✨</p>
      <button class="btn btn-primary" style="width:auto;margin-top:20px;padding:10px 28px;border-radius:12px" @click="goChat">
        开始规划 →
      </button>
    </div>

    <!-- ========== 行程列表 ========== -->
    <div v-else class="plans-list">
      <TransitionGroup name="card">
        <div
          v-for="plan in plans"
          :key="plan.id"
          class="plan-card"
          :class="{ expanded: expandedId === plan.id }"
        >
          <!-- ===== 封面 ===== -->
          <div class="plan-cover" @click="toggleExpand(plan.id)">
            <div class="plan-cover-bg" :style="coverStyle(plan.city)" />
            <div class="plan-cover-overlay" />
            <div class="plan-cover-content">
              <div class="plan-cover-top">
                <div class="plan-cover-left">
                  <span class="plan-cover-icon">{{ cityIcon(plan.city) }}</span>
                  <div>
                    <h3 class="plan-city-name">{{ plan.city || '未知目的地' }}</h3>
                    <div class="plan-meta-tags">
                      <span class="plan-badge days-badge">📅 {{ plan.days }} 天{{ plan.days > 1 ? ' ' + (plan.days - 1) + ' 晚' : '' }}</span>
                      <span class="plan-badge date-badge">{{ fmtDate(plan.createTime) }}</span>
                    </div>
                  </div>
                </div>
                <div class="plan-cover-right">
                  <button class="cover-btn delete-btn" @click.stop="del(plan.id)" title="删除">🗑️</button>
                  <span class="expand-arrow" :class="{ open: expandedId === plan.id }">▼</span>
                </div>
              </div>

              <!-- 折叠预览 -->
              <Transition name="preview-fade">
                <div v-if="expandedId !== plan.id" class="plan-preview" key="preview">
                  <p class="preview-text">{{ previewText(plan.content) }}</p>
                </div>
              </Transition>
            </div>
          </div>

          <!-- ===== 展开详情 - 可视化时间线 ===== -->
          <Transition name="detail-slide">
            <div v-if="expandedId === plan.id" class="plan-body" key="body">
              <template v-if="isItinerary(plan)">
              <!-- 旅程概览 -->
              <div class="trip-summary">
                <div class="ts-stats">
                  <div class="ts-stat"><span class="ts-num">{{ plan.days }}</span><span class="ts-lbl">天数</span></div>
                  <div class="ts-stat"><span class="ts-num">{{ totalActivities(plan) }}</span><span class="ts-lbl">活动</span></div>
                  <div class="ts-stat"><span class="ts-num">{{ tripHotels(plan) }}</span><span class="ts-lbl">住宿</span></div>
                  <div class="ts-stat"><span class="ts-num">{{ tripMeals(plan) }}</span><span class="ts-lbl">美食</span></div>
                </div>
              </div>

              <!-- 每日路线摘要 -->
              <div class="day-route-summary">
                <div v-for="(d, i) in planDays(plan)" :key="i" class="day-route-item" :style="{ '--dr-color': roadmapColor(i) }">
                  <span class="dr-dot"></span>
                  <span class="dr-label">{{ d.dayNum }}</span>
                  <span class="dr-tags">
                    <span v-for="tag in dayRouteTags(d)" :key="tag" class="dr-tag">{{ tag }}</span>
                  </span>
                </div>
              </div>

              <!-- ===== 图表 & 数据表切换 ===== -->
              <div class="viz-section" v-if="planDays(plan).length">
                <!-- 视图切换 -->
                <div class="viz-switch">
                  <button class="viz-switch-btn" :class="{ active: !showDataTable }" @click="showDataTable = false">
                    📊 图表视图
                  </button>
                  <button class="viz-switch-btn" :class="{ active: showDataTable }" @click="showDataTable = true">
                    📋 数据表视图
                  </button>
                </div>

                <!-- ── 图表视图 ── -->
                <template v-if="!showDataTable">
                  <div class="chart-tabs">
                    <button
                      v-for="ct in availableCharts(plan)"
                      :key="ct.key"
                      class="chart-tab"
                      :class="{active:chartType===ct.key}"
                      @click="switchChart(plan, ct.key)"
                    >{{ ct.label }}</button>
                  </div>
                  <div class="chart-area">
                    <canvas class="chart-canvas"></canvas>
                    <div v-if="!hasChart" class="chart-placeholder">
                      <span>📊</span>
                      <p>选择上方标签查看图表</p>
                    </div>
                  </div>
                </template>

                <!-- ── 数据表视图 ── -->
                <template v-if="showDataTable">
                  <div class="data-table-wrap">
                    <div class="data-table-toolbar">
                      <span class="data-table-info">
                        📋 {{ structuredRows(plan).length }} 项活动
                      </span>
                    </div>
                    <div class="data-table-scroll">
                      <table class="data-table">
                        <thead>
                          <tr>
                            <th class="dt-th dt-day">天</th>
                            <th class="dt-th dt-time">时间</th>
                            <th class="dt-th dt-activity">活动名称</th>
                            <th class="dt-th dt-type">类型</th>
                            <th class="dt-th dt-cost">预算</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(row, ri) in structuredRows(plan)" :key="ri" class="dt-row" :class="`dt-slot-${row.slot}`">
                            <td class="dt-td dt-day">
                              <span class="dt-day-badge" :style="{ background: roadmapColor((row.day - 1) % ROADMAP_COLORS.length) }">D{{ row.day }}</span>
                            </td>
                            <td class="dt-td dt-time">
                              <span v-if="row.time" class="dt-time-text">{{ row.time }}</span>
                              <span v-else class="dt-time-slot">{{ { '上午': '🌅', '下午': '☀️', '晚上': '🌙' }[row.slot] || '📌' }} {{ row.slot }}</span>
                            </td>
                            <td class="dt-td dt-activity">
                              <span class="dt-activity-text">{{ row.activity }}</span>
                              <span v-if="row.location" class="dt-location">📍 {{ row.location }}</span>
                            </td>
                            <td class="dt-td dt-type">
                              <span class="dt-type-tag" :style="{ background: TYPE_BG_COLORS[row.type] || '#F1F5F9', color: TYPE_FG_COLORS[row.type] || '#64748B' }">
                                {{ row.typeIcon }} {{ row.type }}
                              </span>
                            </td>
                            <td class="dt-td dt-cost">
                              <span v-if="row.cost" class="dt-cost-text">¥{{ row.cost.toLocaleString() }}</span>
                              <span v-else class="dt-cost-none">—</span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div v-if="!structuredRows(plan).length" class="data-table-empty">
                      <span>📭</span>
                      <p>暂未识别到结构化活动数据</p>
                    </div>
                  </div>
                </template>
              </div>

              <!-- ===== 可视化行程表格（时段 × 天矩阵） ===== -->
              <div class="itin-table-wrap">
                <div class="itin-table-header">
                  <span class="itin-table-title">🗓️ 行程时间表</span>
                </div>
                <table class="itin-table">
                  <thead>
                    <tr>
                      <th class="th-corner"></th>
                      <th v-for="(d, i) in planDays(plan)" :key="d.dayNum" class="th-day" :style="{ '--th-color': roadmapColor(i) }">
                        <span class="th-day-num">{{ d.dayNum }}</span>
                        <span class="th-day-title">{{ d.title }}</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="slot in ['上午', '下午', '晚上']" :key="slot">
                      <td class="td-slot" :style="{ background: slotColor(slot) }">
                        <span class="td-slot-icon">{{ slotIcon(slot) }}</span>
                        <span class="td-slot-label">{{ slot }}</span>
                      </td>
                      <td
                        v-for="(d, di) in planDays(plan)"
                        :key="di"
                        class="td-cell"
                        :class="{ empty: !getSlotItems(d, slot).length }"
                      >
                        <div v-if="getSlotItems(d, slot).length" class="td-activities">
                          <div v-for="(item, j) in getSlotItems(d, slot)" :key="j" class="td-activity" :title="item.text">
                            <span class="td-activity-icon">{{ activityIcon(item.text) }}</span>
                            <span class="td-activity-text">{{ item.text }}</span>
                          </div>
                        </div>
                        <span v-else class="td-empty-hint">—</span>
                      </td>
                    </tr>
                    <!-- 额外时段：如果某天有无法分组的活动 -->
                    <tr v-if="hasExtraSlot(plan)">
                      <td class="td-slot" style="background:linear-gradient(135deg,#E2E8F0,#CBD5E1)">
                        <span class="td-slot-icon">📌</span>
                        <span class="td-slot-label">全天</span>
                      </td>
                      <td
                        v-for="(d, di) in planDays(plan)"
                        :key="'e'+di"
                        class="td-cell"
                        :class="{ empty: !getOtherItems(d).length }"
                      >
                        <div v-if="getOtherItems(d).length" class="td-activities">
                          <div v-for="(item, j) in getOtherItems(d)" :key="j" class="td-activity" :title="item.text">
                            <span class="td-activity-icon">{{ activityIcon(item.text) }}</span>
                            <span class="td-activity-text">{{ item.text }}</span>
                          </div>
                        </div>
                        <span v-else class="td-empty-hint">—</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              </template>

              <!-- 内容模式 -->
              <div v-if="!isItinerary(plan)" class="content-view">
                <div v-for="(sec, idx) in contentSections(plan)" :key="idx" class="cv-section">
                  <h4 class="cv-heading" v-if="sec.heading">{{ sec.heading }}</h4>
                  <div class="cv-body">
                    <p v-for="(line, j) in sec.lines" :key="j" class="cv-line">{{ line }}</p>
                  </div>
                </div>
              </div>
              <!-- 原始内容折叠 -->
              <details class="raw-toggle">
                <summary class="raw-summary">📄 查看完整原始内容</summary>
                <div class="raw-body" v-html="renderContent(plan.content)" />
              </details>
            </div>
          </Transition>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api'
import { useToast } from '../composables/useToast'
import { usePlanCharts } from '../composables/usePlanCharts'
import { Chart, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend, RadialLinearScale, PointElement, LineElement, Filler, DoughnutController, BarController, RadarController, LineController } from 'chart.js'

Chart.register(ArcElement, BarElement, CategoryScale, LinearScale, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend, DoughnutController, BarController, RadarController, LineController)

const router = useRouter()
const toast = useToast()
const {
  getTypeDistribution, getDailyComparison, getSlotRadar, getTimelineChart,
  getBudgetChart, getTransportChart, getMealChart, getDensityChart,
  getStructuredRows, getTextTable, autoDetectCharts,
  classifyItem, getItemSlot, getTypeEmoji,
} = usePlanCharts()

const plans = ref([])
const loading = ref(true)
const expandedId = ref(null)
const chartType = ref('types')
const pendingChart = ref(false)
const hasChart = ref(false)  // 是否已渲染图表（控制占位符显示）
const showDataTable = ref(false) // 切换图表/数据表视图
let chartInstance = null

// ===== 渐变色 =====
const GRADIENTS = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
  'linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)',
  'linear-gradient(135deg, #fdbb2d 0%, #22c1c3 100%)',
  'linear-gradient(135deg, #f5576c 0%, #ff6f00 100%)',
  'linear-gradient(135deg, #0EA5E9 0%, #38BDF8 100%)',
  'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
  'linear-gradient(135deg, #fc5c7d 0%, #6a82fb 100%)',
]

function hashCode(s) {
  if (!s) return 0
  let h = 0
  for (let i = 0; i < s.length; i++) { h = ((h << 5) - h) + s.charCodeAt(i); h |= 0 }
  return Math.abs(h)
}

function coverStyle(city) {
  return { background: GRADIENTS[hashCode(city) % GRADIENTS.length] }
}

// ===== 城市图标 =====
const CITY_ICONS = {
  '北京': '🏯', '上海': '🌃', '广州': '🌺', '深圳': '🌳',
  '成都': '🐼', '杭州': '🏞️', '西安': '🏛️', '重庆': '🌉',
  '厦门': '🌊', '昆明': '🌸', '三亚': '🏖️', '大理': '🏔️',
  '丽江': '🏘️', '长沙': '🍊', '武汉': '🌸', '南京': '🏛️',
  '青岛': '🌊', '大连': '⛵', '苏州': '🏯', '桂林': '🏞️',
  '西藏': '⛰️', '新疆': '🏜️', '香港': '🌃', '澳门': '🎰',
  '台北': '🏯', '东京': '🗼', '首尔': '🇰🇷', '曼谷': '🙏',
  '巴黎': '🗼', '纽约': '🗽', '伦敦': '🇬🇧', '悉尼': '🏄',
  '罗马': '🏛️', '巴厘岛': '🌴', '普吉岛': '🏖️', '济州岛': '🌊',
}

function cityIcon(city) { return CITY_ICONS[city] || '📍' }

// ===== 内容解析 =====
const CN_NUMS = { '一': 1, '二': 2, '三': 3, '四': 4, '五': 5, '六': 6, '七': 7, '八': 8, '九': 9, '十': 10 }

function parsedDays(content, expectedDays) {
  if (!content) return []
  const days = []
  const lines = content.split('\n')
  let cur = null

  for (const raw of lines) {
    const line = raw.trim()
    if (!line) continue

    // 统一清洗行：去掉 #、*、前后空白及前导 emoji
    const cleaned = line
      .replace(/^#{1,6}\s*/, '')
      .replace(/^\*{1,2}\s*/, '')
      .replace(/\s*\*{1,2}$/, '')
      .replace(/^[\u{1F000}-\u{1FFFF}\u{FE00}-\u{FE0F}\u{200D}]+\s*/u, '')  // 去掉所有前导 emoji+变体选择器
      .trim()

    // ── 匹配天数标题 ──
    const m = cleaned.match(/^Day\s*(\d+)\s*[:：]?\s*(.*)/i)
    const cn = !m && cleaned.match(/^第\s*(\d+)\s*天\s*[:：]?\s*(.*)/)
    const cnChar = !m && !cn && cleaned.match(/^第([一二三四五六七八九])天\s*[:：]?\s*(.*)/)
    const cnDirect = !m && !cn && !cnChar && cleaned.match(/^([一二三四五六七八九])天\s*[:：]?\s*(.*)/)
    // 括号格式: 【Day 1】 / 【第一天】 / [Day 1]
    const bracketDay = !m && !cn && !cnChar && !cnDirect && cleaned.match(/^[【\[\（(]\s*(?:Day\s*)?(\d+)\s*[天]?\s*[】\]\）)]\s*(.*)/i)

    if (m) {
      if (cur) days.push(cur)
      cur = { dayNum: parseInt(m[1]), title: m[2]?.trim() || `第 ${m[1]} 天`, items: [] }
      continue
    }
    if (cn) {
      if (cur) days.push(cur)
      const n = parseInt(cn[1])
      if (n > 0) { cur = { dayNum: n, title: cn[2]?.trim() || `第 ${n} 天`, items: [] }; continue }
    }
    if (cnChar) {
      if (cur) days.push(cur)
      const n = CN_NUMS[cnChar[1]] || 0
      if (n) { cur = { dayNum: n, title: cnChar[2]?.trim() || `第 ${n} 天`, items: [] }; continue }
    }
    if (cnDirect) {
      if (cur) days.push(cur)
      const n = CN_NUMS[cnDirect[1]] || 0
      if (n) { cur = { dayNum: n, title: cnDirect[2]?.trim() || `第 ${n} 天`, items: [] }; continue }
    }
    if (bracketDay) {
      if (cur) days.push(cur)
      const n = parseInt(bracketDay[1])
      if (n > 0) { cur = { dayNum: n, title: bracketDay[2]?.trim() || `第 ${n} 天`, items: [] }; continue }
    }

    // ── 跳过无意义行 ──
    const pure = line.replace(/[\s|\\-]/g, '')
    if (!pure || pure.length <= 2) continue
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(line.trim())) continue
    if (/^[💡⚠️📌🔔📝🎯💪]/u.test(cleaned) && !cleaned.match(/^第.*天/)) continue

    // ── Markdown 表格行 ──
    if (cur && line.startsWith('|')) {
      const parts = line.split('|').filter(p => p.trim())
      if (parts.length >= 2 && !parts.some(p => /时间|活动|备注|项目/.test(p)) && !line.includes('---')) {
        const timeCol = parts[0].trim()
        const actCol = parts[1]?.trim() || ''
        cur.items.push({ text: `${timeCol} ${actCol}` })
        continue
      }
    }

    // ── 活动条目 ──
    if (cur) {
      const s = line.replace(/\*\*(.+?)\*\*/g, '$1').trim()
      if (s.length < 4) continue
      if (/^(需要我为你|告诉我你的想法|如果|要是|或者|你可以)/.test(s)) break
      if (/^\d+[.、]\s*(细化|推荐|查看|告诉我|生成)/.test(s)) break
      if (/^[-*]\s*(细化|推荐|查看|告诉我|生成)/.test(s)) break

      const im = s.match(/^[-*•·▪▶]\s*(.*)/)
        || s.match(/^\d+[.、）)]\s*(.*)/)
        || s.match(/^📍?\s*(\d{1,2}:\d{2}.*)/)
      if (im) {
        const itemText = im[1].trim()
        if (itemText.length < 4 && !itemText.match(/\d:\d{2}/)) continue
        cur.items.push({ text: itemText })
        continue
      }

      const emojiPrefix = s.match(/^([\u{1F300}-\u{1F9FF}])\s*(.*)/u)
      if (emojiPrefix && emojiPrefix[2].trim().length >= 2) {
        cur.items.push({ text: emojiPrefix[2].trim() })
        continue
      }

      if (s.match(/\d{1,2}:\d{2}/) || /^[上午下午晚上早中晚]/.test(s)) {
        cur.items.push({ text: s })
      }
    }
  }
  if (cur) days.push(cur)

  if (expectedDays && expectedDays > days.length && days.length > 0) {
    for (let d = days.length + 1; d <= expectedDays; d++) {
      days.push({ dayNum: d, title: `第 ${d} 天`, items: [] })
    }
  }
  if (!days.length && lines.some(l => l.trim())) {
    days.push({
      dayNum: 1,
      title: '行程安排',
      items: lines.filter(l => l.trim()).map(l => ({ text: l.trim().replace(/^[-*•]\s*/, '').replace(/\*\*(.+?)\*\*/g, '$1') }))
    })
  }
  return days
}
function activityIcon(text) {

  const t = text || ''
  if (/吃|餐|美食|饭|海鲜|火锅|烧烤|早餐|午餐|晚餐|餐厅|小吃|品尝|料理|自助/i.test(t)) return '🍽️'
  if (/酒店|住|宿|入住|住宿|民宿|旅馆|客栈|房间/i.test(t)) return '🏨'
  if (/景点|游览|参观|看|博物馆|公园|寺庙|宫殿|遗址|名胜|古迹|景区/i.test(t)) return '🏛️'
  if (/交通|车|飞|机场|站|地铁|出租|公交|租车|高铁|火车|航班|大巴/i.test(t)) return '🚗'
  if (/购物|买|逛街|商场|市场|商业街|免税/i.test(t)) return '🛍️'
  if (/海滩|海|水|游泳|潜水|冲浪|海边|沙滩|浮潜|深潜|海景/i.test(t)) return '🏖️'
  if (/山|爬山|登山|徒步|自然|森林|峡谷/i.test(t)) return '⛰️'
  if (/拍照|照片|摄影|拍|相机|打卡/i.test(t)) return '📸'
  if (/晚上|夜|夜景|酒吧|夜市|夜生活|晚餐/i.test(t)) return '🌙'
  if (/上午|早上|早晨|清晨|日出/i.test(t)) return '🌅'
  if (/表演|演出|歌舞|show|秀|剧场/i.test(t)) return '🎭'
  if (/寺庙|佛教|祈福|许愿|宗教/i.test(t)) return '🙏'
  if (/咖啡|茶馆|下午茶|饮品/i.test(t)) return '☕'
  if (/骑行|单车|自行车|骑行/i.test(t)) return '🚴'
  if (/乐园|游乐|主题公园|迪士尼|欢乐谷/i.test(t)) return '🎢'
  if (/按摩|spa|温泉|泡汤|放松|SPA/i.test(t)) return '💆'
  if (/下午/i.test(t)) return '☀️'
  return '✨'
}

// ===== 活动分类标签 =====
function activityType(text) {
  const t = text || ''
  if (/吃|餐|美食|饭|海鲜|火锅|烧烤|早餐|午餐|晚餐|餐厅|小吃|品尝|料理|自助/i.test(t)) return '🍽️ 餐饮'
  if (/酒店|住|宿|入住|住宿|民宿|旅馆|客栈|房间/i.test(t)) return '🏨 住宿'
  if (/景点|游览|参观|看|博物馆|公园|寺庙|宫殿|遗址|名胜|古迹|景区/i.test(t)) return '🏛️ 景点'
  if (/交通|车|飞|机场|站|地铁|出租|公交|租车|高铁|火车|航班|大巴/i.test(t)) return '🚗 交通'
  if (/购物|买|逛街|商场|市场|商业街|免税/i.test(t)) return '🛍️ 购物'
  if (/海滩|海|水|游泳|潜水|冲浪|海边|沙滩|浮潜|深潜|海景/i.test(t)) return '🏖️ 海滨'
  if (/山|爬山|登山|徒步|自然|森林|峡谷/i.test(t)) return '⛰️ 户外'
  if (/拍照|照片|摄影|拍|相机|打卡/i.test(t)) return '📸 摄影'
  if (/表演|演出|歌舞|show|秀|剧场/i.test(t)) return '🎭 演出'
  if (/咖啡|茶馆|下午茶|饮品/i.test(t)) return '☕ 休闲'
  return '✨ 活动'
}

// ===== 时间段颜色 =====
function slotColor(slot) {
  if (slot.includes('上午') || slot.includes('早上') || slot.includes('清晨')) return 'linear-gradient(135deg, #FDE68A, #FCD34D)'
  if (slot.includes('下午') || slot.includes('中午')) return 'linear-gradient(135deg, #FED7AA, #FB923C)'
  if (slot.includes('晚上') || slot.includes('夜晚') || slot.includes('夜景') || slot.includes('夜市') || slot.includes('傍晚')) return 'linear-gradient(135deg, #C4B5FD, #8B5CF6)'
  return 'linear-gradient(135deg, #E2E8F0, #CBD5E1)'
}

function slotIcon(slot) {
  if (slot.includes('上午') || slot.includes('早上') || slot.includes('清晨')) return '🌅'
  if (slot.includes('下午') || slot.includes('中午')) return '☀️'
  if (slot.includes('晚上') || slot.includes('夜晚') || slot.includes('夜景') || slot.includes('夜市') || slot.includes('傍晚')) return '🌙'
  return '📌'
}

// ===== 按时间段分组 =====
function groupedItems(items) {
  const morning = [], afternoon = [], evening = [], rest = []
  items.forEach(item => {
    const t = item.text
    if (/上午|早上|早晨|清晨|日出/.test(t)) morning.push(item)
    else if (/下午|中午/.test(t)) afternoon.push(item)
    else if (/晚上|夜晚|夜景|夜市|傍晚/.test(t)) evening.push(item)
    else rest.push(item)
  })
  const result = []
  if (morning.length) result.push({ slot: '上午', items: morning })
  if (afternoon.length) result.push({ slot: '下午', items: afternoon })
  if (evening.length) result.push({ slot: '晚上', items: evening })
  if (rest.length) {
    if (result.length) result[result.length - 1].items.push(...rest)
    else result.push({ slot: '全日', items: rest })
  }
  return result
}

// ===== 旅程统计 =====
function planDays(plan) { return parsedDays(plan.content, plan.days) }

function totalActivities(plan) {
  return planDays(plan).reduce((s, d) => s + d.items.length, 0)
}

function tripHotels(plan) {
  return planDays(plan).reduce((s, d) => s + d.items.filter(i => /酒店|住|宿|入住|住宿|民宿|旅馆|客栈|房间/i.test(i.text)).length, 0)
}

function tripMeals(plan) {
  return planDays(plan).reduce((s, d) => s + d.items.filter(i => /吃|餐|美食|饭|海鲜|火锅|烧烤|早餐|午餐|晚餐|餐厅|小吃|品尝|料理|自助/i.test(i.text)).length, 0)
}

const ROADMAP_COLORS = ['#0EA5E9', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6', '#F97316', '#06B6D4', '#84CC16']

function roadmapColor(i) { return ROADMAP_COLORS[i % ROADMAP_COLORS.length] }

function isItinerary(plan) {
  const days = parsedDays(plan.content, plan.days)
  // 只要有活动的天数就认为是行程，显示图表和数据表
  return days.length > 0 && days.some(d => d.items.length > 0)
}


// ===== 表格辅助函数 =====
function itemSlot(text) {
  // 1. 明确的关键词分类（最高优先级）
  if (/^上午|^早上|^早晨|^清晨|早餐|早餐/.test(text)) return '上午'
  if (/^下午|^中午|午餐/.test(text)) return '下午'
  if (/^晚上|^夜晚|^傍晚|晚餐|宵夜|夜市/.test(text)) return '晚上'

  // 2. 时间范围解析 "8:00-11:30 活动名" 或 "08:00~10:00"
  const tm = text.match(/(\d{1,2}):(\d{2})\s*[-~—]\s*(\d{1,2}):(\d{2})/)
  if (tm) {
    const startH = parseInt(tm[1])
    const endH = parseInt(tm[3])
    // 取中间时段
    const mid = (startH + endH) / 2
    if (mid < 12) return '上午'
    if (mid < 17) return '下午'
    return '晚上'
  }

  // 3. 单一时间点 "19:00 看夜景"
  const singleTm = text.match(/(\d{1,2}):(\d{2})/)
  if (singleTm) {
    const h = parseInt(singleTm[1])
    const m = parseInt(singleTm[2])
    if (h < 5) return '晚上'      // 凌晨归类到前晚
    if (h < 12) return '上午'
    if (h < 13 && m < 30) return '上午'  // 12:00-12:30 算上午
    if (h < 18) return '下午'
    return '晚上'
  }

  // 4. 活动类型推断
  if (/早|晨|日出/i.test(text)) return '上午'
  if (/午间|午后/i.test(text)) return '下午'
  if (/晚|夜|宵/i.test(text) && !/早晚/.test(text)) return '晚上'

  // 5. 默认：根据常见活动时间推断
  if (/早餐|早茶|晨跑|晨练|日出|上午|出发|抵达/i.test(text)) return '上午'
  if (/午餐|午休|下午茶/i.test(text)) return '下午'
  if (/晚餐|夜宵|夜景|酒吧|夜市|住宿|入住酒店|回酒店/i.test(text)) return '晚上'

  // 6. 实在无法判断 → 归入全天
  return '其他'
}

function getSlotItems(day, slot) {
  return day.items.filter(item => itemSlot(item.text) === slot)
}

function getOtherItems(day) {
  return day.items.filter(item => itemSlot(item.text) === '其他')
}

function hasExtraSlot(plan) {
  return planDays(plan).some(d => getOtherItems(d).length > 0)
}

/**
 * 为每一天生成路线标签摘要（从活动项目中提取分类标签）
 */
function dayRouteTags(day) {
  const tags = new Set()
  const countMap = {}
  day.items.forEach(item => {
    const t = item.text || ''
    // 提取活动类型标签
    let tag = ''
    if (/博物馆|公园|寺庙|宫殿|遗址|名胜|景区|景点/i.test(t)) tag = '🏛️'
    else if (/吃|餐|美食|餐厅|小吃|火锅|烧烤|料理/i.test(t)) tag = '🍽️'
    else if (/酒店|入住|住宿|民宿/i.test(t)) tag = '🏨'
    else if (/交通|高铁|飞机|地铁|出租|租车/i.test(t)) tag = '🚗'
    else if (/购物|逛街|商场|市场|商业街/i.test(t)) tag = '🛍️'
    else if (/海滩|海|水|海边|游泳/i.test(t)) tag = '🏖️'
    else if (/山|爬山|徒步|自然/i.test(t)) tag = '⛰️'
    else if (/拍照|摄影|打卡/i.test(t)) tag = '📸'
    else if (/表演|演出|剧场|show/i.test(t)) tag = '🎭'
    else if (/咖啡|茶馆|下午茶/i.test(t)) tag = '☕'
    else if (/夜市|夜景|酒吧|夜生活/i.test(t)) tag = '🌙'
    else if (/自由|休息|休闲|逛逛|漫步/i.test(t)) tag = '🚶'
    if (tag) {
      countMap[tag] = (countMap[tag] || 0) + 1
    }
  })
  // 返回出现最多的前3个标签
  return Object.entries(countMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([tag]) => tag)
}

/**
 * 将非标准行程内容按段落分组显示
 */
function contentSections(plan) {
  if (!plan.content) return []
  const lines = plan.content.split('\n').filter(l => l.trim())
  const sections = []
  let current = null

  for (const line of lines) {
    const trimmed = line.trim()
    // 如果是以 # 或 ** 开头的标题行
    if (/^#{1,6}\s/.test(trimmed) || /^\*\*.*\*\*$/.test(trimmed)) {
      if (current) sections.push(current)
      current = {
        heading: trimmed.replace(/^#{1,6}\s*/, '').replace(/\*\*/g, ''),
        lines: []
      }
    } else {
      if (!current) {
        current = { heading: '', lines: [] }
      }
      const clean = trimmed.replace(/\*\*(.+?)\*\*/g, '$1')
      if (clean.length > 3) current.lines.push(clean)
    }
  }
  if (current) sections.push(current)
  return sections
}

function previewText(content) {
  if (!content) return ''
  return content
    .replace(/\*\*(.+?)\*\*/g, '$1').replace(/[-*•]\s*/g, '')
    .replace(/#{1,6}\s*/g, '').replace(/\n/g, ' ').replace(/\s+/g, ' ').trim()
    .substring(0, 72).replace(/\s+\S*$/, '') + '...'
}

function renderContent(text) {
  if (!text) return '<p style="color:var(--text-light)">暂无详情</p>'
  return text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>').replace(/\*\*/g, '')
}

function fmtDate(ts) {
  if (!ts) return ''
  return new Date(ts).toLocaleString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

// ===== 图表渲染 =====

// 活动类型表格配色
const TYPE_BG_COLORS = {
  '景点游览': '#E0F2FE', '美食餐饮': '#FEF3C7', '酒店住宿': '#EDE9FE',
  '交通出行': '#D1FAE5', '购物消费': '#FCE7F3', '休闲娱乐': '#FFEDD5',
  '户外运动': '#DCFCE7', '文化体验': '#E0E7FF', '拍照摄影': '#CFFAFE',
  '夜市夜游': '#F3E8FF', '演出表演': '#FEE2E2', 'SPA康养': '#CCFBF1',
  '其他活动': '#F1F5F9',
}
const TYPE_FG_COLORS = {
  '景点游览': '#0369A1', '美食餐饮': '#B45309', '酒店住宿': '#6D28D9',
  '交通出行': '#047857', '购物消费': '#BE185D', '休闲娱乐': '#C2410C',
  '户外运动': '#15803D', '文化体验': '#4338CA', '拍照摄影': '#0891B2',
  '夜市夜游': '#7E22CE', '演出表演': '#B91C1C', 'SPA康养': '#0F766E',
  '其他活动': '#64748B',
}

/**
 * 获取行程可用图表类型列表
 * 固定显示4个核心图表 + 自动检测附加图表
 */
function availableCharts(plan) {
  try {
    const days = planDays(plan)
    const detected = autoDetectCharts(days)

    const core = [
      { key: 'types',    label: '🍽️ 活动类型' },
      { key: 'daily',    label: '📊 每日对比' },
      { key: 'timeline', label: '📈 时段分布' },
      { key: 'slots',    label: '🌓 时段雷达' },
    ]
    const extras = [
      { key: 'budget',   label: '💰 预算分布' },
      { key: 'transport',label: '🚗 交通方式' },
      { key: 'meal',     label: '🍜 餐饮类型' },
      { key: 'density',  label: '📊 密集趋势' },
    ]

    // 只显示 core + 检测到的 extra
    return [...core, ...extras.filter(e => detected.includes(e.key))]
  } catch (e) {
    console.warn('图表检测异常:', e)
    return [
      { key: 'types', label: '🍽️ 活动类型' },
      { key: 'daily', label: '📊 每日对比' },
      { key: 'slots', label: '🌓 时段雷达' },
    ]
  }
}

/**
 * 获取行程的结构化数据行
 */
function structuredRows(plan) {
  return getStructuredRows(planDays(plan))
}

function switchChart(plan, type) {
  chartType.value = type
  pendingChart.value = true

  nextTick(() => {
    // 直接在 DOM 中查找 canvas，避免 v-for 内 ref 绑定的问题
    const canvas = document.querySelector('.chart-canvas')
    if (!canvas || typeof canvas.getContext !== 'function') {
      pendingChart.value = false
      return
    }

    // 销毁旧图表
    if (chartInstance) {
      chartInstance.destroy()
      chartInstance = null
    }

    const ctx = canvas.getContext('2d')
    const days = planDays(plan)

    const chartFns = {
      types:     getTypeDistribution,
      daily:     getDailyComparison,
      timeline:  getTimelineChart,
      slots:     getSlotRadar,
      budget:    getBudgetChart,
      transport: getTransportChart,
      meal:      getMealChart,
      density:   getDensityChart,
    }

    const fn = chartFns[type]
    if (!fn) { pendingChart.value = false; return }

    try {
      const result = fn(days)
      if (result) {
        const config = { type: result.type, data: result.data, options: result.options }
        chartInstance = new Chart(ctx, config)
        hasChart.value = true
      }
    } catch (e) {
      console.warn('图表渲染失败:', e)
    }
    pendingChart.value = false
  })
}

// ===== 展开时自动显示图表 =====
watch(expandedId, (newId) => {
  showDataTable.value = false // 切换到图表视图
  hasChart.value = false
  if (!newId) {
    // 折叠 → 销毁图表
    if (chartInstance) {
      chartInstance.destroy()
      chartInstance = null
    }
    return
  }
  // 展开 → 自动显示图表
  chartType.value = 'types'
  const plan = plans.value.find(p => p.id === newId)
  if (plan) {
    nextTick(() => switchChart(plan, 'types'))
  }
})

// ===== 操作 =====
onMounted(() => load())

async function load() {
  loading.value = true
  try {
    const res = await api.get('/api/chat/plan/list')
    if (res.data.code === 200) plans.value = res.data.data || []
  } catch { toast.error('加载失败') }
  loading.value = false
}

async function refresh() {
  await load()
  toast.success('已刷新')
}

function toggleExpand(id) {
  expandedId.value = expandedId.value === id ? null : id
}

async function del(id) {
  if (!confirm('确定删除这个行程吗？')) return
  try {
    await api.delete(`/api/chat/plan/${id}`)
    plans.value = plans.value.filter(p => p.id !== id)
    if (expandedId.value === id) { expandedId.value = null }
    toast.success('删除成功')
  } catch { toast.error('删除失败') }
}

function goChat() { router.push('/app/chat') }
</script>

<style scoped>
/* ============================================
   可视化行程 — 时间线风格
   ============================================ */

/* ===== 加载 ===== */
.loading-state {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; padding: 80px 20px; gap: 16px;
}
.loading-spinner {
  width: 40px; height: 40px;
  border: 3px solid var(--border);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
.loading-text { color: var(--text-light); font-size: 14px; }

/* ===== 行程列表 ===== */
.plans-list { display: flex; flex-direction: column; gap: 20px; }

/* ===== 卡片动画 ===== */
.card-enter-active, .card-leave-active { transition: all 0.4s ease; }
.card-enter-from { opacity: 0; transform: translateY(20px); }
.card-leave-to { opacity: 0; transform: scale(0.9) translateY(-10px); }
.card-move { transition: transform 0.4s ease; }

/* ===== 卡片 ===== */
.plan-card {
  background: #fff;
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border);
  transition: box-shadow 0.3s, transform 0.2s;
}
.plan-card:hover { box-shadow: var(--shadow-md); }
.plan-card.expanded { box-shadow: var(--shadow-lg); }

/* ===== 封面 ===== */
.plan-cover {
  position: relative; cursor: pointer; overflow: hidden;
  min-height: 88px; user-select: none;
}
.plan-cover-bg {
  position: absolute; inset: 0;
  transition: transform 0.5s ease;
}
.plan-card:hover .plan-cover-bg { transform: scale(1.04); }
.plan-cover-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.15) 60%, rgba(0,0,0,0.05) 100%);
}
.plan-cover-content {
  position: relative; z-index: 1; padding: 18px 24px; color: #fff;
}
.plan-cover-top { display: flex; align-items: flex-start; justify-content: space-between; }
.plan-cover-left { display: flex; align-items: center; gap: 14px; }
.plan-cover-icon {
  font-size: 34px; line-height: 1; flex-shrink: 0;
  filter: drop-shadow(0 2px 6px rgba(0,0,0,0.25));
}
.plan-city-name {
  font-size: 20px; font-weight: 700; margin: 0 0 3px;
  text-shadow: 0 1px 4px rgba(0,0,0,0.2);
}
.plan-meta-tags { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.plan-badge {
  display: inline-block; padding: 2px 10px; border-radius: 20px;
  font-size: 11px; font-weight: 600;
  backdrop-filter: blur(8px);
  background: rgba(255,255,255,0.2);
  border: 1px solid rgba(255,255,255,0.25);
}
.plan-cover-right { display: flex; align-items: center; gap: 4px; flex-shrink: 0; }
.cover-btn {
  background: rgba(255,255,255,0.2);
  backdrop-filter: blur(8px); color: #fff;
  width: 32px; height: 32px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; font-size: 14px;
  transition: all 0.25s; opacity: 0.7;
  border: 1px solid rgba(255,255,255,0.3);
}
.plan-card:hover .cover-btn { opacity: 1; }
.cover-btn:hover { background: rgba(239,68,68,0.75); border-color: transparent; transform: scale(1.12); }
.expand-arrow {
  font-size: 11px; opacity: 0.75; padding: 6px 4px;
  transition: transform 0.3s ease;
}
.expand-arrow.open { transform: rotate(180deg); }

/* ===== 折叠预览 ===== */
.plan-preview { margin-top: 10px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.2); }
.preview-text {
  font-size: 13px; opacity: 0.8; line-height: 1.5;
  overflow: hidden; text-overflow: ellipsis;
  display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical;
}
.preview-fade-enter-active, .preview-fade-leave-active { transition: opacity 0.25s ease; }
.preview-fade-enter-from, .preview-fade-leave-to { opacity: 0; }

/* ===== 展开详情 ===== */
.plan-body { border-top: 1px solid var(--border); background: #fff; }
.detail-slide-enter-active, .detail-slide-leave-active { transition: all 0.3s ease; }
.detail-slide-enter-from { opacity: 0; max-height: 0; }
.detail-slide-enter-to { opacity: 1; max-height: 2000px; }
.detail-slide-leave-to { opacity: 0; max-height: 0; padding: 0; }

/* ===== 旅程概览统计 ===== */
.trip-summary {
  padding: 20px 24px 12px;
  border-bottom: 1px solid #F1F5F9;
}
.ts-stats {
  display: flex;
  gap: 16px;
  justify-content: center;
}
.ts-stat {
  text-align: center;
  padding: 10px 20px;
  background: #F8FAFC;
  border-radius: 12px;
  flex: 1;
  max-width: 100px;
  transition: transform 0.2s;
}
.ts-stat:hover { transform: translateY(-2px); }
.ts-num {
  display: block;
  font-size: 22px;
  font-weight: 800;
  color: #0F172A;
  line-height: 1.2;
}
.ts-lbl {
  font-size: 11px;
  color: #94A3B8;
  font-weight: 500;
}

/* ===== 每日路线摘要 ===== */
.day-route-summary {
  display: flex;
  gap: 8px;
  padding: 12px 24px 4px;
  overflow-x: auto;
  flex-wrap: nowrap;
}
.day-route-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px 6px 8px;
  background: #F8FAFC;
  border-radius: 20px;
  border: 1px solid #E2E8F0;
  flex-shrink: 0;
  font-size: 12px;
}
.dr-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--dr-color, #0EA5E9);
  flex-shrink: 0;
}
.dr-label {
  font-weight: 700;
  color: #475569;
  font-size: 11px;
  white-space: nowrap;
}
.dr-tags {
  display: flex;
  gap: 2px;
  align-items: center;
}
.dr-tag {
  font-size: 12px;
  line-height: 1;
}

/* ===== 行程表格 ===== */
.itin-table-wrap {
  padding: 12px 24px 20px;
  overflow-x: auto;
}
.itin-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 13px;
  min-width: 500px;
}
.itin-table th,
.itin-table td {
  padding: 10px 12px;
  text-align: left;
  vertical-align: top;
  border-bottom: 1px solid #F1F5F9;
  border-right: 1px solid #F1F5F9;
}
.itin-table th:first-child,
.itin-table td:first-child {
  border-left: 1px solid #F1F5F9;
}
.itin-table thead tr:first-child th {
  border-top: 1px solid #F1F5F9;
}
.itin-table thead tr:first-child th:first-child {
  border-radius: 12px 0 0 0;
}
.itin-table thead tr:first-child th:last-child {
  border-radius: 0 12px 0 0;
}

/* 表头 */
.th-corner {
  width: 60px;
  min-width: 60px;
  background: #F8FAFC;
}
.th-day {
  text-align: center;
  min-width: 140px;
  background: #F8FAFC;
  padding: 12px 12px 10px !important;
  position: relative;
}
.th-day::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 10%;
  right: 10%;
  height: 3px;
  border-radius: 3px 3px 0 0;
  background: var(--th-color, #0EA5E9);
}
.th-day-num {
  display: block;
  font-size: 15px;
  font-weight: 700;
  color: #0F172A;
}
.th-day-title {
  font-size: 11px;
  color: #94A3B8;
  font-weight: 500;
  display: block;
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 时段行 */
.td-slot {
  width: 60px;
  min-width: 60px;
  text-align: center;
  font-weight: 600;
  font-size: 12px;
  color: #1E293B;
  padding: 14px 8px !important;
}
.td-slot-icon { font-size: 18px; display: block; margin-bottom: 2px; }
.td-slot-label { font-size: 11px; white-space: nowrap; }

/* 活动单元格 */
.td-cell {
  padding: 8px 10px !important;
}
.td-cell.empty {
  text-align: center;
  color: #CBD5E1;
  font-size: 16px;
}
.td-empty-hint { color: #E2E8F0; font-size: 14px; }
.td-activities {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.td-activity {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  padding: 5px 8px;
  border-radius: 8px;
  background: #F8FAFC;
  transition: background 0.2s;
  line-height: 1.4;
}
.td-activity:hover {
  background: #EFF6FF;
}
.td-activity-icon { font-size: 13px; flex-shrink: 0; margin-top: 1px; }
.td-activity-text {
  font-size: 12px;
  color: #334155;
  word-break: break-word;
}

/* 交替行底色提升可读性 */
.itin-table tbody tr:nth-child(even) .td-cell:not(.empty) {
  background: rgba(0,0,0,0.01);
}

/* 响应式 */
@media (max-width: 768px) {
  .itin-table-wrap { padding: 8px 16px 16px; }
  .itin-table { font-size: 12px; min-width: 400px; }
  .th-day { min-width: 110px; padding: 10px 8px !important; }
  .th-day-num { font-size: 13px; }
  .td-activity { padding: 4px 6px; gap: 4px; }
  .td-activity-text { font-size: 11px; }
  .td-slot { width: 44px; min-width: 44px; padding: 10px 4px !important; }
  .td-slot-icon { font-size: 14px; }
}

/* ===== 内容视图（非标准行程） ===== */
.content-view {
  padding: 16px 24px;
}
.cv-section {
  margin-bottom: 16px;
  padding: 12px 16px;
  background: #F8FAFC;
  border-radius: 12px;
  border-left: 3px solid var(--primary-light);
}
.cv-heading {
  font-size: 14px;
  font-weight: 700;
  color: #0F172A;
  margin-bottom: 8px;
}
.cv-body {
  font-size: 13px;
  line-height: 1.8;
  color: #475569;
}
.cv-line {
  margin: 4px 0;
  padding-left: 12px;
  position: relative;
}
.cv-line::before {
  content: '•';
  position: absolute;
  left: 0;
  color: var(--primary-light);
}

/* ===== 图表概览 ===== */
.chart-section {
  padding: 16px 24px 8px;
  border-bottom: 1px solid #F1F5F9;
}
.chart-tabs {
  display: flex;
  gap: 6px;
  margin-bottom: 12px;
  overflow-x: auto;
  flex-wrap: nowrap;
}
.chart-tab {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 14px;
  border-radius: 20px;
  border: 1px solid #E2E8F0;
  background: #fff;
  color: #64748B;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
  font-family: inherit;
}
.chart-tab:hover {
  border-color: var(--primary-light);
  color: var(--primary);
}
.chart-tab.active {
  background: var(--gradient-primary);
  color: #fff;
  border-color: transparent;
}
.chart-tab span { font-size: 14px; }
.chart-area {
  position: relative;
  height: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.chart-canvas {
  display: block;
  width: 100% !important;
  height: 100% !important;
}
.chart-placeholder {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #CBD5E1;
  font-size: 13px;
  gap: 8px;
  pointer-events: none;
}
.chart-placeholder span { font-size: 32px; }
.chart-placeholder p { margin: 0; }

@media (max-width: 768px) {
  .chart-section { padding: 12px 16px 4px; }
  .chart-area { height: 200px; }
  .chart-tab { font-size: 11px; padding: 4px 10px; }
}

/* ============================================
   可视化视图切换
   ============================================ */
.viz-section {
  padding: 12px 24px 4px;
  border-bottom: 1px solid #F1F5F9;
}

.viz-switch {
  display: flex;
  gap: 6px;
  margin-bottom: 12px;
}
.viz-switch-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 10px;
  border: 1.5px solid #E2E8F0;
  background: #fff;
  color: #64748B;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s;
  font-family: inherit;
}
.viz-switch-btn:hover {
  border-color: var(--primary-light);
  color: var(--primary);
  background: #F0F5FF;
}
.viz-switch-btn.active {
  background: var(--gradient-primary);
  color: #fff;
  border-color: transparent;
  box-shadow: 0 2px 8px rgba(59,130,246,0.25);
}

/* ============================================
   数据表视图
   ============================================ */
.data-table-wrap {
  margin-bottom: 8px;
}
.data-table-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}
.data-table-info {
  font-size: 13px;
  color: var(--text-light);
  font-weight: 500;
}

.data-table-scroll {
  overflow-x: auto;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
}
.data-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 13px;
  min-width: 500px;
}

/* 表头 */
.data-table thead {
  position: sticky;
  top: 0;
  z-index: 2;
}
.dt-th {
  padding: 10px 12px;
  background: #F8FAFC;
  font-weight: 700;
  font-size: 12px;
  color: #475569;
  text-align: left;
  border-bottom: 2px solid #E2E8F0;
  white-space: nowrap;
}
.dt-th:not(:last-child) {
  border-right: 1px solid #F1F5F9;
}
.dt-day { width: 52px; text-align: center; }
.dt-time { width: 72px; }
.dt-activity { min-width: 160px; }
.dt-type { width: 100px; }
.dt-cost { width: 72px; text-align: right; }

/* 行 */
.dt-row {
  transition: background 0.15s;
}
.dt-row:hover {
  background: #FAFBFC;
}
.dt-row:not(:last-child) .dt-td {
  border-bottom: 1px solid #F1F5F9;
}

/* 行交替色 */
.dt-row:nth-child(even) {
  background: #FAFBFC;
}
.dt-row:nth-child(even):hover {
  background: #F0F5FF;
}

/* 时段行前缀色 */
.dt-slot-上午 .dt-td:first-child {
  border-left: 3px solid #FCD34D;
}
.dt-slot-下午 .dt-td:first-child {
  border-left: 3px solid #FB923C;
}
.dt-slot-晚上 .dt-td:first-child {
  border-left: 3px solid #A78BFA;
}
.dt-slot-其他 .dt-td:first-child {
  border-left: 3px solid #CBD5E1;
}

/* 单元格 */
.dt-td {
  padding: 8px 12px;
  vertical-align: middle;
  font-size: 13px;
}
.dt-td:not(:last-child) {
  border-right: 1px solid #F1F5F9;
}

.dt-day { text-align: center; }
.dt-day-badge {
  display: inline-block;
  width: 30px;
  height: 22px;
  line-height: 22px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  color: #fff;
  text-align: center;
}

.dt-time-text {
  font-weight: 600;
  color: #1E293B;
  font-size: 12px;
  font-variant-numeric: tabular-nums;
}
.dt-time-slot {
  font-size: 12px;
  color: #94A3B8;
}

.dt-activity-text {
  color: #1E293B;
  font-weight: 500;
}
.dt-location {
  display: block;
  font-size: 11px;
  color: #94A3B8;
  margin-top: 2px;
}

.dt-type-tag {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
}

.dt-cost-text {
  font-weight: 700;
  color: #059669;
  font-size: 13px;
  font-variant-numeric: tabular-nums;
}
.dt-cost-none {
  color: #CBD5E1;
}

.data-table-empty {
  padding: 40px 20px;
  text-align: center;
  color: #CBD5E1;
}
.data-table-empty span { font-size: 32px; }
.data-table-empty p { margin: 8px 0 0; font-size: 13px; }

/* ===== 行程表格标题 ===== */
.itin-table-header {
  padding: 8px 4px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.itin-table-title {
  font-size: 14px;
  font-weight: 700;
  color: #0F172A;
}

@media (max-width: 768px) {
  .viz-section { padding: 8px 16px 2px; }
  .viz-switch-btn { font-size: 12px; padding: 6px 12px; }
  .data-table-wrap { font-size: 12px; }
  .dt-th { padding: 8px; font-size: 11px; }
  .dt-td { padding: 6px 8px; font-size: 12px; }
  .dt-activity { min-width: 120px; }
  .dt-type { width: 80px; }
}

/* ===== 原始内容 ===== */
.raw-toggle {
  margin: 0 24px 16px;
  border-top: 1px solid var(--border);
}
.raw-summary {
  list-style: none;
  display: flex; align-items: center; justify-content: center;
  padding: 10px 0; cursor: pointer;
  font-size: 13px; color: var(--text-light);
  transition: color 0.2s;
  user-select: none;
}
.raw-summary::-webkit-details-marker { display: none; }
.raw-summary:hover { color: var(--primary); }
.raw-body {
  padding: 12px 16px; font-size: 13px; line-height: 1.8;
  color: var(--text-secondary);
  background: var(--bg); border-radius: var(--radius-sm);
  max-height: 300px; overflow-y: auto;
  white-space: pre-wrap; word-break: break-word;
}

/* ===== 空状态 ===== */
.empty-state { text-align: center; padding: 80px 20px; color: var(--text-secondary); }
.empty-icon {
  font-size: 72px; display: block; margin-bottom: 16px;
  animation: float 3s ease-in-out infinite;
}
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

/* ===== 响应式 ===== */
@media (max-width: 768px) {
  .plan-cover-content { padding: 14px 16px; }
  .plan-cover-icon { font-size: 28px; }
  .plan-city-name { font-size: 17px; }
  .ts-stats { gap: 8px; }
  .ts-stat { padding: 8px 12px; }
  .ts-num { font-size: 18px; }
  .day-rail { padding: 12px 16px 8px; }
  .day-pin { padding: 5px 10px 5px 8px; font-size: 12px; }
  .day-view { padding: 8px 16px 16px; }
  .tl-item { padding: 6px 10px; }
  .tl-item-text { font-size: 13px; }
  .raw-toggle { margin: 0 16px 12px; }
}
</style>
