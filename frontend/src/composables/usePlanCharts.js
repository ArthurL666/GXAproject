/**
 * 智能行程图表 Composable
 * 自动识别行程数据，生成精致可视化图表与数据表格
 * 纯前端计算，不依赖后端
 */

// ─── 活动类型颜色映射（12+ 分类） ───
const TYPE_COLORS = {
  '景点游览': '#0EA5E9',
  '美食餐饮': '#F59E0B',
  '酒店住宿': '#8B5CF6',
  '交通出行': '#10B981',
  '购物消费': '#EC4899',
  '休闲娱乐': '#F97316',
  '户外运动': '#22C55E',
  '文化体验': '#6366F1',
  '拍照摄影': '#06B6D4',
  '夜市夜游': '#A855F7',
  '演出表演': '#EF4444',
  'SPA康养': '#14B8A6',
  '其他活动': '#94A3B8',
}

// ─── 时段颜色 ───
const SLOT_COLORS = {
  '上午': '#FCD34D',
  '下午': '#FB923C',
  '晚上': '#A78BFA',
  '全天': '#94A3B8',
}

// ─── 精细活动分类（12+ 类，更精准的识别） ───
function classifyItem(text) {
  const t = text || ''

  // 景点游览
  if (/景点|游览|参观|博物馆|公园|寺庙|宫殿|遗址|名胜|古迹|景区|园林|塔|教堂|城堡|广场|步行街|古镇|古街|历史街区|纪念馆|展览馆|美术馆|图书馆|大学|校园|地标|大教堂|清真寺/i.test(t)) return '景点游览'

  // 美食餐饮
  if (/吃|餐|美食|饭|海鲜|火锅|烧烤|早餐|午餐|晚餐|餐厅|小吃|品尝|料理|自助|下午茶|咖啡馆|咖啡|茶馆|奶茶|饮品|甜点|蛋糕|面包|早茶|夜市小吃|大排档|米其林|特色菜|本地菜|美食街|美食城|食堂|面馆|饺子|包子|烤鸭|火锅店|日料|寿司|刺身|烤肉|自助餐| buffet/i.test(t)) return '美食餐饮'

  // 酒店住宿
  if (/酒店|住|宿|入住|住宿|民宿|旅馆|客栈|房间|度假村|公寓|青旅|青年旅舍|别墅|山庄|宾馆|旅店|客房|check.?in|退房|resort/i.test(t)) return '酒店住宿'

  // 交通出行
  if (/交通|车|飞|机场|站|地铁|出租|公交|租车|高铁|火车|航班|大巴|打车|taxi|uber|滴滴|驾车|自驾|步行|单车|自行车|骑行|缆车|索道|游船|轮渡|巴士|长途|接送机|包车|拼车|网约车|轻轨|有轨电车|磁悬浮/i.test(t)) return '交通出行'

  // 购物消费
  if (/购物|买|逛街|商场|市场|商业街|免税|商店|超市|百货|集市|夜市|跳蚤市场|特产|手信|纪念品|伴手礼|药妆|美妆/i.test(t)) return '购物消费'

  // 休闲娱乐
  if (/休闲|咖啡|茶馆|下午茶|饮品|酒吧|清吧|小酒馆|发廊|电影院|ktv|网吧|游戏|密室|剧本杀|桌游|棋牌|足疗|按摩|温泉|放松/i.test(t)) return '休闲娱乐'

  // 户外运动
  if (/山|爬山|登山|徒步|自然|森林|峡谷|户外|露营|探险|漂流|骑行|攀岩|跳伞|滑翔|蹦极|潜水|冲浪|帆船|游艇|皮划艇|独木舟|远足|hiking|trekking/i.test(t)) return '户外运动'

  // 文化体验
  if (/文化|体验|手工|diy|陶艺|茶道|花道|书法|绘画|烹饪|厨艺|学习|课程|讲座|讲解|导览|导游|导游|文化村|民族村|民俗|非遗|传统工艺/i.test(t)) return '文化体验'

  // 拍照摄影
  if (/拍照|照片|摄影|拍|相机|打卡|网红|拍照点|观景台|观景|取景|航拍|无人机/i.test(t)) return '拍照摄影'

  // 夜市夜游
  if (/夜市|夜游|夜景观|夜景|夜生活|夜间/i.test(t)) return '夜市夜游'

  // 演出表演
  if (/表演|演出|歌舞|show|秀|剧场|剧院|演唱会|音乐会|马戏团|杂技|相声|戏曲|话剧|音乐剧|木偶戏|皮影戏/i.test(t)) return '演出表演'

  // SPA康养
  if (/spa|按摩|温泉|泡汤|桑拿|汗蒸|足浴|水疗|美容|美发|养生|冥想|瑜伽|健身|游泳|spa/i.test(t)) return 'SPA康养'

  return '其他活动'
}

// ─── 提取预算/费用信息 ───
function extractCost(text) {
  if (!text) return null
  // 匹配 "¥200"、"200元"、"人均¥100"、"门票¥60" 等
  const costPatterns = [
    /[¥￥](\d+(?:,\d{3})*(?:\.\d{1,2})?)/,
    /(\d+(?:,\d{3})*(?:\.\d{1,2})?)\s*元/,
    /人均[¥￥]?(\d+(?:,\d{3})*(?:\.\d{1,2})?)/,
    /价格[¥￥]?(\d+(?:,\d{3})*(?:\.\d{1,2})?)/,
    /费用[¥￥]?(\d+(?:,\d{3})*(?:\.\d{1,2})?)/,
    /门票[¥￥]?(\d+(?:,\d{3})*(?:\.\d{1,2})?)/,
    /票价[¥￥]?(\d+(?:,\d{3})*(?:\.\d{1,2})?)/,
    /花费[¥￥]?(\d+(?:,\d{3})*(?:\.\d{1,2})?)/,
  ]
  for (const p of costPatterns) {
    const m = text.match(p)
    if (m) {
      const val = parseFloat(m[1].replace(/,/g, ''))
      if (!isNaN(val) && val > 0 && val < 100000) return val
    }
  }
  return null
}

// ─── 提取活动时长（分钟） ───
function extractDuration(text) {
  if (!text) return null
  // 匹配 "2小时"、"1.5h"、"90分钟" 等
  try {
    // 先尝试时间范围 → 估算时长
    const rangePattern = /(\d{1,2}):(\d{2})\s*[-~—]\s*(\d{1,2}):(\d{2})/
    const rangeMatch = text.match(rangePattern)
    if (rangeMatch) {
      const startMin = parseInt(rangeMatch[1]) * 60 + parseInt(rangeMatch[2])
      const endMin = parseInt(rangeMatch[3]) * 60 + parseInt(rangeMatch[4])
      const dur = endMin - startMin
      if (dur > 0 && dur < 1440) return dur
    }

    // 小时
    const hMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:小时|h(?:ours?)?)/i)
    if (hMatch) {
      const mins = parseFloat(hMatch[1]) * 60
      if (mins > 0 && mins < 1440) return mins
    }

    // 分钟
    const mMatch = text.match(/(\d+)\s*(?:分钟|min)/i)
    if (mMatch) {
      const mins = parseInt(mMatch[1])
      if (mins > 0 && mins < 1440) return mins
    }
  } catch (e) {
    // 静默忽略
  }
  return null
}

// ─── 提取活动时间（起始时间小时） ───
function extractTime(text) {
  if (!text) return null
  const m = text.match(/(\d{1,2}):(\d{2})/)
  if (m) {
    const h = parseInt(m[1])
    const min = parseInt(m[2])
    if (h >= 0 && h < 24 && min >= 0 && min < 60) return { hour: h, minute: min, display: `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}` }
  }
  return null
}

// ─── 提取地点名称 ───
function extractLocation(text) {
  if (!text) return null
  // 匹配 "在xxx"、"前往xxx"、"到达xxx" 等
  const locPatterns = [
    /在([一-鿿]{2,10})(?:[，,。.\s]|$)/,
    /前往([一-鿿]{2,10})(?:[，,。.\s]|$)/,
    /到达([一-鿿]{2,10})(?:[，,。.\s]|$)/,
    /抵达([一-鿿]{2,10})(?:[，,。.\s]|$)/,
    /到([一-鿿]{2,10})(?:去|游玩|参观|游览|吃|买|逛|看)/,
  ]
  for (const p of locPatterns) {
    const m = text.match(p)
    if (m) return m[1]
  }
  return null
}

// ─── 判断活动时段 ───
function getItemSlot(text) {
  const t = text || ''

  // 1. 明确关键词
  if (/^上午|^早上|^早晨|^清晨|日出|晨跑|晨练|早茶|早餐/.test(t)) return '上午'
  if (/^下午|^中午|午餐|午休|午间|午后/.test(t)) return '下午'
  if (/^晚上|^夜晚|^傍晚|晚餐|宵夜|夜市|夜景|夜游|夜生活|夜间/.test(t)) return '晚上'

  // 2. 时间范围解析
  const range = t.match(/(\d{1,2}):(\d{2})\s*[-~—]\s*(\d{1,2}):(\d{2})/)
  if (range) {
    const startH = parseInt(range[1])
    const endH = parseInt(range[3])
    const mid = (startH + endH) / 2
    if (mid < 12) return '上午'
    if (mid < 17) return '下午'
    return '晚上'
  }

  // 3. 单一时间点
  const single = t.match(/(\d{1,2}):(\d{2})/)
  if (single) {
    const h = parseInt(single[1])
    const m = parseInt(single[2])
    if (h < 5) return '晚上'       // 凌晨 → 晚上
    if (h < 12) return '上午'
    if (h < 13 && m < 30) return '上午'
    if (h < 18) return '下午'
    return '晚上'
  }

  // 4. 活动类型推断
  if (/早餐|早茶|晨跑|晨练|日出|出发|早上|上午/.test(t)) return '上午'
  if (/午餐|午休|下午茶|下午|中午|午间/.test(t)) return '下午'
  if (/晚餐|夜宵|夜景|酒吧|夜市|住宿|入住酒店|回酒店|晚|夜/.test(t)) return '晚上'

  return '其他'
}

// ─── 获取类型 emoji 图标 ───
function getTypeEmoji(type) {
  const map = {
    '景点游览': '🏛️', '美食餐饮': '🍽️', '酒店住宿': '🏨', '交通出行': '🚗',
    '购物消费': '🛍️', '休闲娱乐': '🎮', '户外运动': '⛰️', '文化体验': '🎨',
    '拍照摄影': '📸', '夜市夜游': '🌙', '演出表演': '🎭', 'SPA康养': '💆',
    '其他活动': '✨',
  }
  return map[type] || '✨'
}

export function usePlanCharts() {

  // ════════════════════════════════════════════════
  //  基础统计
  // ════════════════════════════════════════════════

  /** 统计各活动类型的数量 */
  function countByType(planDays) {
    const counts = {}
    planDays.forEach(d => {
      d.items.forEach(item => {
        const type = classifyItem(item.text)
        counts[type] = (counts[type] || 0) + 1
      })
    })
    return counts
  }

  /** 统计各时段活动数 */
  function countBySlot(planDays) {
    const counts = { '上午': 0, '下午': 0, '晚上': 0 }
    planDays.forEach(d => {
      d.items.forEach(item => {
        const slot = getItemSlot(item.text)
        if (counts[slot] !== undefined) counts[slot]++
      })
    })
    return counts
  }

  /** 统计每日活动数 */
  function countByDay(planDays) {
    return planDays.map(d => ({ day: d.dayNum, count: d.items.length }))
  }

  // ════════════════════════════════════════════════
  //  结构化数据表格（智能识别每一行的结构化信息）
  // ════════════════════════════════════════════════

  /**
   * 从行程中提取结构化数据行
   * 返回: [{ time, activity, type, typeIcon, slot, cost, duration, day }]
   */
  function getStructuredRows(planDays) {
    if (!planDays?.length) return []

    const rows = []
    planDays.forEach(d => {
      d.items.forEach(item => {
        try {
          const text = item.text || ''
          const type = classifyItem(text)
          const slot = getItemSlot(text)
          const time = extractTime(text)
          const cost = extractCost(text)
          const duration = extractDuration(text)
          const location = extractLocation(text)

          // 提取活动名称（去除时间前缀、备注等）
          let activityName = text
            .replace(/^\d{1,2}:\d{2}\s*[-~—]\s*\d{1,2}:\d{2}\s*/, '')
            .replace(/^\d{1,2}:\d{2}\s*/, '')
            .replace(/\s*[（(].+?[）)]\s*$/, '')
            .replace(/\s*[\[【].+?[】\]]\s*$/, '')
            .replace(/[¥￥]\d+(?:,\d{3})*(?:\.\d{1,2})?\s*元?/g, '')
            .replace(/\d+(?:,\d{3})*(?:\.\d{1,2})?\s*元/g, '')
            .trim()

          if (activityName.length > 40) {
            activityName = activityName.substring(0, 38) + '…'
          }

          rows.push({
            day: d.dayNum,
            slot,
            time: time ? time.display : '',
            hour: time ? time.hour : null,
            minute: time ? time.minute : null,
            activity: activityName,
            rawText: text,
            type,
            typeIcon: getTypeEmoji(type),
            cost,
            duration,
            location,
          })
        } catch (e) {
          // 单条数据解析异常时跳过，不影响整体
        }
      })
    })

    // 按天、按时间排序
    rows.sort((a, b) => {
      if (a.day !== b.day) return a.day - b.day
      if (a.hour !== null && b.hour !== null) return a.hour * 60 + a.minute - (b.hour * 60 + b.minute)
      if (a.hour !== null) return -1
      if (b.hour !== null) return 1
      return 0
    })

    return rows
  }

  // ════════════════════════════════════════════════
  //  自动检测可用图表类型
  // ════════════════════════════════════════════════

  /**
   * 自动检测行程中包含哪些可图表化的数据类型
   * 返回: ['types', 'daily', 'timeline', 'slots', 'budget', 'transport', 'meal', 'density']
   */
  function autoDetectCharts(planDays) {
    if (!planDays?.length) return ['types', 'daily', 'slots']

    const available = ['types', 'daily', 'timeline', 'slots']
    const allText = planDays.flatMap(d => d.items.map(i => i.text)).join(' ')

    // 检测是否有预算/费用信息
    if (/[¥￥]\d+|\d+元/.test(allText)) available.push('budget')

    // 检测是否有多种交通方式
    const transportCount = (allText.match(/地铁|公交|出租|高铁|飞机|大巴|租车|打车|自行车|步行|自驾|缆车|游船|轮渡/gi) || []).length
    if (transportCount >= 2) available.push('transport')

    // 检测是否有多种餐饮类型
    const mealCount = (allText.match(/早餐|午餐|晚餐|火锅|烧烤|海鲜|料理|小吃|下午茶|咖啡|自助/gi) || []).length
    if (mealCount >= 2) available.push('meal')

    // 检测是否有足够的数据生成密度图
    const totalItems = planDays.reduce((s, d) => s + d.items.length, 0)
    if (totalItems >= 6 && planDays.length >= 2) available.push('density')

    return available
  }

  // ════════════════════════════════════════════════
  //  图表生成器
  // ════════════════════════════════════════════════

  // ─── 1. 活动类型分布（环形图）Enhanced ───
  function getTypeDistribution(planDays) {
    if (!planDays?.length) return null
    const counts = countByType(planDays)
    // 按数量排序
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1])
    const labels = sorted.map(([k]) => k)
    const data = sorted.map(([, v]) => v)
    const colors = labels.map(l => TYPE_COLORS[l] || '#94A3B8')
    const emojis = labels.map(l => getTypeEmoji(l))

    return {
      type: 'doughnut',
      data: {
        labels: labels.map((l, i) => `${emojis[i]} ${l}`),
        datasets: [{
          data,
          backgroundColor: colors.map(c => c + 'E6'),
          borderColor: '#fff',
          borderWidth: 3,
          hoverOffset: 8,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 14,
              usePointStyle: true,
              boxWidth: 8,
              font: { size: 11 },
            }
          },
          tooltip: {
            backgroundColor: 'rgba(15,23,42,0.9)',
            titleFont: { size: 12 },
            bodyFont: { size: 12 },
            padding: 10,
            cornerRadius: 8,
            callbacks: {
              label: ctx => {
                const total = ctx.dataset.data.reduce((a, b) => a + b, 0)
                const pct = ((ctx.parsed / total) * 100).toFixed(1)
                return ` ${ctx.label.split(' ').slice(1).join(' ')}: ${ctx.parsed} 项 (${pct}%)`
              }
            }
          }
        },
        cutout: '62%',
        radius: '85%',
      }
    }
  }

  // ─── 2. 每日对比（柱状图）Enhanced ───
  function getDailyComparison(planDays) {
    if (!planDays?.length) return null
    const palette = ['#0EA5E9', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6', '#F97316', '#06B6D4', '#84CC16']
    const labels = planDays.map(d => `Day ${d.dayNum}`)
    const data = planDays.map(d => d.items.length)
    const bgColors = planDays.map((d, i) => {
      const c = palette[i % palette.length]
      return c + 'D9'
    })
    const borderColors = planDays.map((_, i) => palette[i % palette.length])

    return {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: '活动数',
          data,
          backgroundColor: bgColors,
          borderColor: borderColors,
          borderWidth: 2,
          borderRadius: { topLeft: 6, topRight: 6, bottomLeft: 0, bottomRight: 0 },
          barThickness: 38,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(15,23,42,0.9)',
            bodyFont: { size: 12 },
            padding: 8,
            cornerRadius: 6,
            callbacks: {
              label: ctx => ` ${ctx.parsed.y} 项活动`,
              afterLabel: ctx => {
                const day = planDays[ctx.dataIndex]
                const types = [...new Set(day.items.map(i => classifyItem(i.text)))]
                return ` ${types.map(t => getTypeEmoji(t) + t).join(' · ')}`
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { stepSize: 1, font: { size: 11 } },
            grid: { color: 'rgba(0,0,0,0.04)' },
            title: { display: true, text: '活动数', font: { size: 11 } }
          },
          x: {
            grid: { display: false },
            ticks: { font: { size: 11 } }
          }
        }
      }
    }
  }

  // ─── 3. 每日时段分布（堆叠条形图）Enhanced ───
  function getTimelineChart(planDays) {
    if (!planDays?.length) return null
    const slots = ['上午', '下午', '晚上']
    const labels = planDays.map(d => `D${d.dayNum}`)
    const colors = ['#FCD34D', '#FB923C', '#A78BFA']

    const slotCounts = slots.map(slot =>
      planDays.map(d => d.items.filter(i => getItemSlot(i.text) === slot).length)
    )

    // 只在有数据的时段显示
    const activeSlots = slots.filter((_, si) => slotCounts[si].some(c => c > 0))
    const activeColors = colors.filter((_, si) => slotCounts[si].some(c => c > 0))
    const activeCounts = slotCounts.filter((_, si) => slots[si] === activeSlots[activeSlots.indexOf(slots[si])])

    const datasets = activeSlots.map((slot, si) => ({
      label: { '上午': '🌅 上午', '下午': '☀️ 下午', '晚上': '🌙 晚上' }[slot] || slot,
      data: slotCounts[slots.indexOf(slot)],
      backgroundColor: activeColors[si] || colors[si],
      borderRadius: 3,
      barThickness: 30,
    }))

    return {
      type: 'bar',
      data: { labels, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { usePointStyle: true, padding: 14, font: { size: 11 } }
          },
          tooltip: {
            backgroundColor: 'rgba(15,23,42,0.9)',
            padding: 8,
            cornerRadius: 6,
            callbacks: {
              label: ctx => ` ${ctx.dataset.label}: ${ctx.parsed} 项`
            }
          }
        },
        scales: {
          x: {
            stacked: true,
            grid: { display: false },
            ticks: { font: { size: 11 } }
          },
          y: {
            stacked: true,
            beginAtZero: true,
            ticks: { stepSize: 1, font: { size: 11 } },
            grid: { color: 'rgba(0,0,0,0.04)' },
            title: { display: true, text: '活动数', font: { size: 11 } }
          }
        }
      }
    }
  }

  // ─── 4. 时段雷达图 Enhanced ───
  function getSlotRadar(planDays) {
    if (!planDays?.length) return null
    const slots = ['上午', '下午', '晚上']
    const labels = ['🌅 上午', '☀️ 下午', '🌙 晚上']
    const data = slots.map(slot =>
      planDays.reduce((sum, d) => sum + d.items.filter(i => getItemSlot(i.text) === slot).length, 0)
    )

    return {
      type: 'radar',
      data: {
        labels,
        datasets: [{
          label: '活动数',
          data,
          backgroundColor: 'rgba(14,165,233,0.10)',
          borderColor: '#0EA5E9',
          borderWidth: 2.5,
          pointBackgroundColor: '#0EA5E9',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 7,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(15,23,42,0.9)',
            padding: 8,
            cornerRadius: 6,
            callbacks: {
              label: ctx => ` ${ctx.label}: ${ctx.parsed} 项`
            }
          }
        },
        scales: {
          r: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              font: { size: 10 },
              backdropColor: 'transparent',
            },
            grid: { color: 'rgba(0,0,0,0.06)' },
            pointLabels: {
              font: { size: 13, weight: 'bold' },
              color: '#334155',
            }
          }
        }
      }
    }
  }

  // ─── 5. 预算/费用分布（环形图）NEW ───
  function getBudgetChart(planDays) {
    if (!planDays?.length) return null

    // 按类型汇总费用
    const costByType = {}
    const costByDay = {}
    let totalCost = 0
    let hasCost = false

    planDays.forEach(d => {
      d.items.forEach(item => {
        const cost = extractCost(item.text)
        if (cost !== null) {
          hasCost = true
          const type = classifyItem(item.text)
          costByType[type] = (costByType[type] || 0) + cost
          costByDay[d.dayNum] = (costByDay[d.dayNum] || 0) + cost
          totalCost += cost
        }
      })
    })

    if (!hasCost) return null

    // 预算类型分布（环形图）
    const sorted = Object.entries(costByType).sort((a, b) => b[1] - a[1])
    const labels = sorted.map(([k]) => k)
    const data = sorted.map(([, v]) => Math.round(v))
    const colors = labels.map(l => TYPE_COLORS[l] || '#94A3B8')
    const emojis = labels.map(l => getTypeEmoji(l))

    return {
      type: 'doughnut',
      data: {
        labels: labels.map((l, i) => `${emojis[i]} ${l}`),
        datasets: [{
          data,
          backgroundColor: colors.map(c => c + 'E6'),
          borderColor: '#fff',
          borderWidth: 3,
          hoverOffset: 8,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: `💰 预算估算 共约 ¥${totalCost.toLocaleString()}`,
            font: { size: 14, weight: 'bold' },
            padding: { bottom: 8 },
            color: '#1E293B',
          },
          legend: {
            position: 'bottom',
            labels: {
              padding: 14,
              usePointStyle: true,
              boxWidth: 8,
              font: { size: 11 },
            }
          },
          tooltip: {
            backgroundColor: 'rgba(15,23,42,0.9)',
            padding: 10,
            cornerRadius: 8,
            callbacks: {
              label: ctx => {
                const pct = ((ctx.parsed / totalCost) * 100).toFixed(1)
                return ` ${ctx.label.split(' ').slice(1).join(' ')}: ¥${ctx.parsed.toLocaleString()} (${pct}%)`
              }
            }
          }
        },
        cutout: '55%',
        radius: '80%',
      }
    }
  }

  // ─── 6. 交通方式分布（柱状图）NEW ───
  function getTransportChart(planDays) {
    if (!planDays?.length) return null

    const transportKeywords = {
      '🚇 地铁': ['地铁', '轻轨', '轨道交通'],
      '🚌 公交': ['公交', '巴士', '大巴', '公交车'],
      '🚕 打车': ['出租', '打车', 'taxi', '滴滴', '网约车'],
      '🚄 高铁': ['高铁', '动车', '火车', '列车'],
      '✈️ 飞机': ['飞', '航班', '飞机', '航空'],
      '🚗 自驾': ['租车', '自驾', '驾车', '开车'],
      '🚶 步行': ['步行', '走路', '骑行', '自行车'],
      '🚢 轮渡': ['轮渡', '游船', '邮轮', '渡轮'],
      '🚠 缆车': ['缆车', '索道'],
    }

    const allText = planDays.flatMap(d => d.items.map(i => i.text)).join(' ')
    const counts = {}
    for (const [label, keywords] of Object.entries(transportKeywords)) {
      const count = keywords.reduce((s, kw) => {
        const regex = new RegExp(kw, 'gi')
        const matches = allText.match(regex)
        return s + (matches ? matches.length : 0)
      }, 0)
      if (count > 0) counts[label] = count
    }

    if (Object.keys(counts).length < 2) return null

    const labels = Object.keys(counts)
    const data = Object.values(counts)
    const colors = ['#0EA5E9', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316', '#22C55E', '#06B6D4', '#A855F7']

    return {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: '出现次数',
          data,
          backgroundColor: labels.map((_, i) => colors[i % colors.length] + 'CC'),
          borderColor: labels.map((_, i) => colors[i % colors.length]),
          borderWidth: 2,
          borderRadius: 6,
          barThickness: 32,
        }]
      },
      options: {
        indexAxis: 'y', // 水平条形图
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: '🚗 交通方式分布',
            font: { size: 14, weight: 'bold' },
            padding: { bottom: 8 },
            color: '#1E293B',
          },
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(15,23,42,0.9)',
            padding: 8,
            cornerRadius: 6,
            callbacks: { label: ctx => ` 出现 ${ctx.parsed.x} 次` }
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            ticks: { stepSize: 1, font: { size: 11 } },
            grid: { color: 'rgba(0,0,0,0.04)' },
          },
          y: {
            grid: { display: false },
            ticks: { font: { size: 12, weight: 'bold' } }
          }
        }
      }
    }
  }

  // ─── 7. 餐饮类型分布（柱状图）NEW ───
  function getMealChart(planDays) {
    if (!planDays?.length) return null

    const mealKeywords = {
      '🍳 早餐': ['早餐', '早茶', '早'],
      '🥗 午餐': ['午餐', '午饭', '午', '中饭'],
      '🍲 晚餐': ['晚餐', '晚饭', '晚', '宵夜', '夜宵'],
      '🥩 火锅': ['火锅', '涮肉', '麻辣'],
      '🍣 日料': ['日料', '寿司', '刺身', '居酒屋'],
      '🦐 海鲜': ['海鲜', '海味'],
      '🥟 小吃': ['小吃', '面馆', '饺子', '包子', '点心', '烧腊'],
      '☕ 下午茶': ['下午茶', '咖啡', '奶茶', '甜点', '蛋糕'],
      '🍢 烧烤': ['烧烤', '烤肉', '烤鸭', '烧肉'],
    }

    const allText = planDays.flatMap(d => d.items.map(i => i.text)).join(' ')
    const counts = {}
    for (const [label, keywords] of Object.entries(mealKeywords)) {
      const count = keywords.reduce((s, kw) => {
        const regex = new RegExp(kw, 'gi')
        const matches = allText.match(regex)
        return s + (matches ? matches.length : 0)
      }, 0)
      if (count > 0) counts[label] = count
    }

    if (Object.keys(counts).length < 2) return null

    // 只保留餐饮类型的活动
    const mealItems = planDays.flatMap(d =>
      d.items.filter(i => classifyItem(i.text) === '美食餐饮')
    )
    if (mealItems.length < 2) return null

    const labels = Object.keys(counts)
    const data = Object.values(counts)
    const colors = ['#FCD34D', '#34D399', '#F87171', '#F97316', '#F472B6', '#06B6D4', '#A78BFA', '#FBBF24', '#FB923C']

    return {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: '提及次数',
          data,
          backgroundColor: labels.map((_, i) => colors[i % colors.length] + 'CC'),
          borderColor: labels.map((_, i) => colors[i % colors.length]),
          borderWidth: 2,
          borderRadius: 6,
          barThickness: 32,
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: '🍽️ 餐饮类型分布',
            font: { size: 14, weight: 'bold' },
            padding: { bottom: 8 },
            color: '#1E293B',
          },
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(15,23,42,0.9)',
            padding: 8,
            cornerRadius: 6,
            callbacks: { label: ctx => ` 提及 ${ctx.parsed.x} 次` }
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            ticks: { stepSize: 1, font: { size: 11 } },
            grid: { color: 'rgba(0,0,0,0.04)' },
          },
          y: {
            grid: { display: false },
            ticks: { font: { size: 12, weight: 'bold' } }
          }
        }
      }
    }
  }

  // ─── 8. 活动密度热力（表格热力 + 图表）NEW ───
  function getDensityChart(planDays) {
    if (!planDays?.length) return null

    const slots = ['上午', '下午', '晚上']
    const labels = planDays.map(d => `D${d.dayNum}`)

    // 构建密度矩阵: 每个 (天, 时段) 的活动数
    const matrix = planDays.map(d =>
      slots.map(slot => d.items.filter(i => getItemSlot(i.text) === slot).length)
    )

    // 计算密度等级 (0, 1-2, 3-4, 5+)
    const maxVal = Math.max(...matrix.flat(), 1)
    const datasets = slots.map((slot, si) => ({
      label: ['🌅 上午', '☀️ 下午', '🌙 晚上'][si],
      data: matrix.map(row => row[si]),
      backgroundColor: ['#FCD34D44', '#FB923C44', '#A78BFA44'][si],
      borderColor: ['#FCD34D', '#FB923C', '#A78BFA'][si],
      borderWidth: 2,
      borderRadius: 4,
      barThickness: 24,
      pointRadius: 0,
      fill: false,
      tension: 0.3,
    }))

    return {
      type: 'line',
      data: { labels, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: '📊 活动密集度趋势',
            font: { size: 14, weight: 'bold' },
            padding: { bottom: 8 },
            color: '#1E293B',
          },
          legend: {
            position: 'bottom',
            labels: { usePointStyle: true, padding: 14, font: { size: 11 } }
          },
          tooltip: {
            backgroundColor: 'rgba(15,23,42,0.9)',
            padding: 8,
            cornerRadius: 6,
            callbacks: {
              title: items => `第 ${items[0].dataIndex + 1} 天`,
              label: ctx => ` ${ctx.dataset.label}: ${ctx.parsed.y} 项`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { stepSize: 1, font: { size: 11 } },
            grid: { color: 'rgba(0,0,0,0.04)' },
            title: { display: true, text: '活动数', font: { size: 11 } }
          },
          x: {
            grid: { display: false },
            ticks: { font: { size: 11 } }
          }
        }
      }
    }
  }

  // ─── 9. 生成数据表格HTML片段（纯文本表格，用于复制）NEW ───
  function getTextTable(planDays) {
    const rows = getStructuredRows(planDays)
    if (!rows.length) return ''

    const header = '| 天 | 时段 | 时间 | 活动 | 类型 | 预算 |'
    const divider = '|:---:|:---:|:---:|:---|:---:|:---:|'
    const body = rows.map(r =>
      `| 第${r.day}天 | ${r.slot} | ${r.time || '—'} | ${r.activity} | ${r.typeIcon}${r.type} | ${r.cost ? '¥' + r.cost : '—'} |`
    ).join('\n')

    return `${header}\n${divider}\n${body}`
  }

  // ════════════════════════════════════════════════
  //  导出
  // ════════════════════════════════════════════════

  return {
    // 分类/分析工具（供外部使用）
    classifyItem,
    getItemSlot,
    getTypeEmoji,
    extractCost,
    extractTime,
    extractDuration,
    extractLocation,

    // 统计
    countByType,
    countBySlot,
    countByDay,

    // 结构化数据
    getStructuredRows,
    getTextTable,

    // 自动检测
    autoDetectCharts,

    // 图表生成器
    getTypeDistribution,
    getDailyComparison,
    getTimelineChart,
    getSlotRadar,
    getBudgetChart,
    getTransportChart,
    getMealChart,
    getDensityChart,
  }
}
