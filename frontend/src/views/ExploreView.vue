<template>
  <div class="explore-page">
    <!-- ========== LOADING SKELETON ========== -->
    <div v-if="loading" class="loading-overlay">
      <div class="skeleton-hero" />
      <div class="skeleton-tabs"><span v-for="i in 6" :key="i" class="skeleton-chip" /></div>
      <div class="skeleton-grid">
        <div v-for="i in 6" :key="i" class="skeleton-card">
          <div class="skeleton-img" />
          <div class="skeleton-line w-60" />
          <div class="skeleton-line w-80" />
          <div class="skeleton-line w-40" />
        </div>
      </div>
    </div>

    <!-- ========== MAIN CONTENT ========== -->
    <div v-show="!loading" class="content-wrapper">
      <!-- Hero -->
      <section class="explore-hero">
        <div class="hero-bg" />
        <div class="hero-particles">
          <span v-for="i in 8" :key="i" class="particle" :style="{ '--i': i, '--x': `${10 + (i * 11) % 80}%`, '--d': `${1.5 + (i * 0.3) % 2}s` }">✦</span>
        </div>
        <div class="hero-content">
          <h1 class="hero-title">发现你的下一段旅程</h1>
          <p class="hero-sub">从山川湖海到城市烟火，找到属于你的目的地</p>
          <div class="hero-search">
            <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input v-model="searchQuery" class="search-input" type="text" placeholder="搜索目的地、关键词..." @input="handleSearch" />
            <button v-if="searchQuery" class="search-clear" @click="searchQuery = ''">✕</button>
          </div>
          <div class="hero-trends">
            <span class="trend-label">热门：</span>
            <button v-for="t in trendSearches" :key="t" class="trend-tag" @click="searchQuery = t">{{ t }}</button>
          </div>
        </div>
      </section>

      <!-- Category Tabs -->
      <section class="categories">
        <div class="categories-scroll">
          <button
            v-for="cat in categories"
            :key="cat.key"
            class="category-chip"
            :class="{ active: activeCategory === cat.key }"
            @click="activeCategory = cat.key"
          >
            <span class="chip-icon">{{ cat.icon }}</span>
            <span class="chip-label">{{ cat.label }}</span>
          </button>
        </div>
      </section>

      <!-- Featured Banner -->
      <section v-if="activeCategory === 'all'" class="featured-banner" @click="handleFeaturedClick">
        <div class="banner-bg" style="background-image: url('https://images.pexels.com/photos/29614950/pexels-photo-29614950.jpeg?auto=compress&cs=tinysrgb&w=1200'); background-size: cover; background-position: center;">
          <svg class="banner-wave" viewBox="0 0 1440 320" preserveAspectRatio="none"><path fill="rgba(255,255,255,0.08)" d="M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,176C672,160,768,160,864,176C960,192,1056,224,1152,213C1248,202,1344,150,1392,122.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"/><path fill="rgba(255,255,255,0.05)" d="M0,224L48,213C96,202,192,181,288,181C384,181,480,202,576,213C672,224,768,224,864,213C960,202,1056,181,1152,181C1248,181,1344,202,1392,213L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"/></svg>
        </div>
        <div class="banner-content">
          <div class="banner-badge">🏖️ 夏日特辑</div>
          <h2 class="banner-title">海岛奇遇 · 拥抱蔚蓝</h2>
          <p class="banner-desc">逃离酷暑，在最美的海滩上寻找夏日清凉</p>
          <span class="banner-cta">探索海岛目的地 →</span>
        </div>
      </section>

      <!-- Destination Grid -->
      <section class="destinations">
        <div class="section-header">
          <h2>{{ activeCategory === 'all' ? '🌍 热门目的地' : currentCategoryLabel }}</h2>
          <span class="section-count">{{ filteredDestinations.length }} 个目的地</span>
        </div>

        <div v-if="filteredDestinations.length" class="dest-grid">
          <article
            v-for="dest in filteredDestinations"
            :key="dest.name"
            class="dest-card"
            :class="{ exploring: exploringCard === dest.name }"
            @click="openDestination(dest)"
            @mousemove="onCardMove($event, dest.name)"
            @mouseleave="onCardLeave(dest.name)"
          >
            <div class="card-visual" :style="{ background: `url(${dest.image}), ${dest.gradient}`, backgroundSize: 'cover, auto', backgroundPosition: 'center, 0 0' }">
              <div class="card-visual-shine" :ref="el => { if (el) cardRefs[dest.name] = el }" />
              <div class="card-emoji-wrap">
                <span class="card-emoji">{{ dest.emoji }}</span>
              </div>
              <div class="card-badges">
                <span class="card-badge rating">⭐ {{ dest.rating }}</span>
                <span class="card-badge season">{{ dest.bestSeason }}</span>
              </div>
              <div class="card-gradient-overlay" />
            </div>
            <div class="card-body">
              <div class="card-body-top">
                <h3 class="card-title">{{ dest.name }}</h3>
                <span class="card-price">¥{{ dest.price }}+</span>
              </div>
              <p class="card-desc">{{ dest.desc }}</p>
              <div class="card-tags">
                <span v-for="tag in dest.tags.slice(0, 3)" :key="tag" class="card-tag">{{ tag }}</span>
              </div>
            </div>
          </article>
        </div>

        <!-- Empty State -->
        <div v-else class="empty-state">
          <div class="empty-illustration">
            <span class="empty-icon">🔍</span>
            <svg class="empty-map" viewBox="0 0 200 120" fill="none"><circle cx="100" cy="60" r="50" stroke="#CBD5E1" stroke-width="1.5" stroke-dasharray="4 4"/><circle cx="80" cy="50" r="6" fill="#F59E0B" opacity="0.6"/><circle cx="120" cy="70" r="4" fill="#0EA5E9" opacity="0.6"/><circle cx="95" cy="80" r="3" fill="#10B981" opacity="0.6"/></svg>
          </div>
          <h3 class="empty-title">没有找到匹配的目的地</h3>
          <p class="empty-desc">试试其他分类或换个关键词搜索吧</p>
          <button class="empty-btn" @click="activeCategory = 'all'; searchQuery = ''">查看全部目的地</button>
        </div>
      </section>

      <!-- Personalized Recommendations -->
      <section class="recommend-section">
        <div class="section-header">
          <h2>🎯 猜你喜欢</h2>
          <span class="section-hint">根据偏好为你推荐</span>
        </div>
        <div class="pref-tags">
          <button
            v-for="pref in preferences"
            :key="pref.key"
            class="pref-tag"
            :class="{ active: activePref === pref.key }"
            @click="activePref = pref.key"
          >
            {{ pref.icon }} {{ pref.label }}
          </button>
        </div>
        <div class="recommend-scroll-wrap">
          <button class="scroll-arrow left" @click="scrollRecommend('left')" :disabled="recScrollAtStart">‹</button>
          <div ref="recommendScroll" class="recommend-scroll" @scroll="onRecScroll">
            <div
              v-for="rec in recommendedDestinations"
              :key="rec.name"
              class="rec-card"
              @click="openDestination(rec)"
            >
              <div class="rec-card-visual" :style="{ background: `url(${rec.image}), ${rec.gradient}`, backgroundSize: 'cover, auto', backgroundPosition: 'center, 0 0' }">
                <span class="rec-card-emoji">{{ rec.emoji }}</span>
              </div>
              <div class="rec-card-body">
                <h4>{{ rec.name }}</h4>
                <span class="rec-card-rating">⭐ {{ rec.rating }}</span>
                <p>{{ rec.desc.slice(0, 30) }}…</p>
              </div>
            </div>
          </div>
          <button class="scroll-arrow right" @click="scrollRecommend('right')" :disabled="recScrollAtEnd">›</button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const searchQuery = ref('')
const activeCategory = ref('all')
const activePref = ref('outdoor')
const loading = ref(true)
const exploringCard = ref(null)
const cardRefs = reactive({})
const recommendScroll = ref(null)
const recScrollAtStart = ref(true)
const recScrollAtEnd = ref(false)

// ─── Data ─────────────────────────────────────────
const categories = [
  { key: 'all',         icon: '🌟', label: '全部' },
  { key: 'domestic',    icon: '🇨🇳', label: '国内' },
  { key: 'overseas',    icon: '🌍', label: '国外' },
  { key: 'nature',      icon: '🏔️', label: '自然风光' },
  { key: 'city',        icon: '🏙️', label: '城市漫游' },
  { key: 'beach',       icon: '🏖️', label: '海滨度假' },
  { key: 'food',        icon: '🍜', label: '美食之旅' },
  { key: 'culture',     icon: '🏛️', label: '文化历史' },
  { key: 'seasonal',    icon: '🌸', label: '当季推荐' },
  { key: 'hot',         icon: '🔥', label: '热门精选' },
]

const trendSearches = ['海岛', '古镇', '雪山', '美食', '亲子']

const preferences = [
  { key: 'outdoor', icon: '🥾', label: '轻户外' },
  { key: 'foodie',  icon: '🍴', label: '美食家' },
  { key: 'photo',   icon: '📷', label: '摄影控' },
  { key: 'culture', icon: '🎭', label: '文化迷' },
  { key: 'luxury',  icon: '👑', label: '奢华游' },
]

const unsplash = (id) => `https://images.unsplash.com/photo-${id}?w=600&h=400&fit=crop&auto=format`
const pexels = (id) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=600`
const pixabay = (id) => `https://pixabay.com/photos/${id}/download/?attachment`

const destinations = [
  { name: '京都',    region: 'overseas', image: pexels('31409369'), emoji: '⛩️', gradient: 'linear-gradient(135deg, #FFF1F2 0%, #FBCFE8 30%, #FDA4AF 100%)',         desc: '樱花与古寺交织，千年的和风雅韵流淌在每一条石板路上', tags: ['文化历史', '城市漫游', '自然风光'], category: ['city', 'culture', 'nature'], rating: 4.8, price: 5800, bestSeason: '🌸 春季', pref: ['photo', 'culture'] },
  { name: '巴厘岛',  region: 'overseas', image: pexels('33720814'), emoji: '🏝️', gradient: 'linear-gradient(135deg, #D1FAE5 0%, #6EE7B7 50%, #34D399 100%)',        desc: '热带天堂，海浪与神庙、梯田与SPA编织出最治愈的假期', tags: ['海滨度假', '自然风光'], category: ['beach', 'nature'], rating: 4.9, price: 4200, bestSeason: '☀️ 夏季', pref: ['outdoor', 'luxury'] },
  { name: '瑞士',    region: 'overseas', image: pexels('34606110'), emoji: '⛰️', gradient: 'linear-gradient(135deg, #EFF6FF 0%, #93C5FD 50%, #60A5FA 100%)',        desc: '阿尔卑斯的雪峰与翡翠湖泊，每一帧都是壁纸般的风景', tags: ['自然风光', '城市漫游'], category: ['nature', 'city'], rating: 4.9, price: 12000, bestSeason: '❄️ 冬季', pref: ['photo', 'outdoor'] },
  { name: '冰岛',    region: 'overseas', image: pexels('33705542'), emoji: '🌌', gradient: 'linear-gradient(135deg, #F3E8FF 0%, #C4B5FD 50%, #A78BFA 100%)',        desc: '极光、冰川、火山——地球上最不像人间的地方', tags: ['自然风光'], category: ['nature'], rating: 4.7, price: 15000, bestSeason: '🌌 全年', pref: ['photo', 'outdoor'] },
  { name: '大理',    region: 'domestic', image: pexels('33970874'),      emoji: '☁️', gradient: 'linear-gradient(135deg, #E0F2FE 0%, #7DD3FC 50%, #38BDF8 100%)',        desc: '苍山洱海间的风花雪月，文艺青年的精神故乡', tags: ['自然风光'], category: ['nature'], rating: 4.6, price: 2500, bestSeason: '🌸 春季', pref: ['photo', 'foodie'] },
  { name: '东京',    region: 'overseas', image: pexels('18848537'), emoji: '🗼', gradient: 'linear-gradient(135deg, #FCE7F3 0%, #F472B6 50%, #EC4899 100%)',        desc: '赛博朋克与江户风情的碰撞，永不熄灭的城市灯火', tags: ['城市漫游', '美食之旅', '文化历史'], category: ['city', 'food', 'culture'], rating: 4.8, price: 6500, bestSeason: '🌸 春季', pref: ['foodie', 'culture'] },
  { name: '圣托里尼', region: 'overseas', image: pexels('18774900'), emoji: '🏘️', gradient: 'linear-gradient(135deg, #F0F9FF 0%, #BAE6FD 50%, #7DD3FC 100%)',       desc: '蓝白相间的童话小镇，爱琴海上的一颗明珠', tags: ['海滨度假', '城市漫游'], category: ['beach', 'city'], rating: 4.9, price: 9800, bestSeason: '☀️ 夏季', pref: ['photo', 'luxury'] },
  { name: '清迈',    region: 'overseas', image: pexels('32763116'), emoji: '🛕', gradient: 'linear-gradient(135deg, #FEF3C7 0%, #FCD34D 50%, #FBBF24 100%)',        desc: '泰北玫瑰，古城寺庙与森林大象的慢生活', tags: ['文化历史', '美食之旅', '自然风光'], category: ['culture', 'food', 'nature'], rating: 4.7, price: 2800, bestSeason: '☀️ 夏季', pref: ['foodie', 'culture'] },
  { name: '巴黎',    region: 'overseas', image: pexels('32597754'), emoji: '🥐', gradient: 'linear-gradient(135deg, #FFF1F2 0%, #FDA4AF 50%, #FB7185 100%)',        desc: '浪漫之都，艺术、时尚与美食的永恒盛宴', tags: ['城市漫游', '美食之旅', '文化历史'], category: ['city', 'food', 'culture'], rating: 4.8, price: 11000, bestSeason: '🌸 春季', pref: ['foodie', 'luxury', 'photo'] },
  { name: '马尔代夫', region: 'overseas', image: pexels('29614950'), emoji: '🌊', gradient: 'linear-gradient(135deg, #CCFBF1 0%, #5EEAD4 50%, #2DD4BF 100%)',       desc: '印度洋上的天堂，水屋、珊瑚礁与无尽蔚蓝', tags: ['海滨度假', '自然风光'], category: ['beach', 'nature'], rating: 4.9, price: 15000, bestSeason: '☀️ 夏季', pref: ['luxury', 'outdoor'] },
  { name: '成都',    region: 'domestic', image: pexels('33855530'),      emoji: '🐼', gradient: 'linear-gradient(135deg, #FEE2E2 0%, #FCA5A5 50%, #F87171 100%)',        desc: '火锅飘香的城市，熊猫故乡的巴适生活', tags: ['美食之旅', '城市漫游', '文化历史'], category: ['food', 'city', 'culture'], rating: 4.7, price: 2000, bestSeason: '🍂 秋季', pref: ['foodie', 'culture'] },
  { name: '北海道',  region: 'overseas', image: pexels('29914279'), emoji: '❄️', gradient: 'linear-gradient(135deg, #F1F5F9 0%, #E2E8F0 50%, #CBD5E1 100%)',       desc: '薰衣草花田与粉雪天堂，四季分明的北国风光', tags: ['自然风光', '美食之旅'], category: ['nature', 'food'], rating: 4.8, price: 7500, bestSeason: '❄️ 冬季', pref: ['photo', 'foodie', 'outdoor'] },
  { name: '重庆',    region: 'domestic', image: pexels('32660201'), emoji: '🌶️', gradient: 'linear-gradient(135deg, #FED7AA 0%, #FB923C 50%, #F97316 100%)',       desc: '8D魔幻山城，火锅与夜景的麻辣诱惑', tags: ['美食之旅', '城市漫游'], category: ['food', 'city'], rating: 4.6, price: 1800, bestSeason: '🍂 秋季', pref: ['foodie'] },
  { name: '三亚',    region: 'domestic', image: pexels('32030703'),      emoji: '🌴', gradient: 'linear-gradient(135deg, #D1FAE5 0%, #34D399 50%, #10B981 100%)',        desc: '椰风海韵，中国最好的海滨度假天堂', tags: ['海滨度假', '自然风光'], category: ['beach', 'nature'], rating: 4.5, price: 3500, bestSeason: '☀️ 夏季', pref: ['outdoor', 'luxury'] },
  { name: '西安',    region: 'domestic', image: pexels('30737851'),      emoji: '🏯', gradient: 'linear-gradient(135deg, #FEF3C7 0%, #FCD34D 50%, #F59E0B 100%)',        desc: '十三朝古都，兵马俑与大雁塔的历史回响', tags: ['文化历史', '城市漫游'], category: ['culture', 'city'], rating: 4.7, price: 2200, bestSeason: '🌸 春季', pref: ['culture', 'photo'] },
  { name: '杭州',    region: 'domestic', image: pexels('33003672'),      emoji: '🌊', gradient: 'linear-gradient(135deg, #E0F2FE 0%, #93C5FD 50%, #60A5FA 100%)',        desc: '西湖烟雨与龙井茶香，人间天堂的诗意画卷', tags: ['自然风光', '城市漫游', '美食之旅'], category: ['nature', 'city', 'food'], rating: 4.6, price: 2800, bestSeason: '🌸 春季', pref: ['photo', 'foodie'] },
]

// ─── Computed ──────────────────────────────────────
const filteredDestinations = computed(() => {
  let list = destinations
  if (activeCategory.value !== 'all') {
    if (activeCategory.value === 'domestic' || activeCategory.value === 'overseas') {
      list = list.filter(d => d.region === activeCategory.value)
    } else {
      list = list.filter(d => d.category.includes(activeCategory.value))
    }
  }
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase()
    list = list.filter(d =>
      d.name.includes(q) || d.tags.some(t => t.includes(q)) || d.desc.includes(q)
    )
  }
  // Sort by rating for 'all' view
  if (activeCategory.value === 'all' && !searchQuery.value) {
    list = [...list].sort((a, b) => b.rating - a.rating)
  }
  return list
})

const currentCategoryLabel = computed(() => {
  const cat = categories.find(c => c.key === activeCategory.value)
  return cat ? `${cat.icon} ${cat.label}` : ''
})

const recommendedDestinations = computed(() => {
  const pref = activePref.value
  const scored = destinations.map(d => ({
    ...d,
    score: d.pref.includes(pref) ? 2 : (d.rating > 4.6 ? 1 : 0)
  }))
  return scored.sort((a, b) => b.score - a.score).slice(0, 8)
})

// ─── 3D Card Effect ───────────────────────────────
function onCardMove(e, name) {
  const el = cardRefs[name]
  if (!el) return
  const rect = el.getBoundingClientRect()
  const x = (e.clientX - rect.left) / rect.width - 0.5
  const y = (e.clientY - rect.top) / rect.height - 0.5
  el.style.transform = `perspective(600px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg)`
  el.style.background = `radial-gradient(circle at ${(x + 0.5) * 100}% ${(y + 0.5) * 100}%, rgba(255,255,255,0.25), transparent 60%)`
}

function onCardLeave(name) {
  const el = cardRefs[name]
  if (!el) return
  el.style.transform = ''
  el.style.background = ''
}

function openDestination(dest) {
  exploringCard.value = dest.name
  setTimeout(() => {
    router.push(`/app/destination/${dest.slug || dest.name}`)
    exploringCard.value = null
  }, 300)
}

function handleFeaturedClick() {
  router.push('/app/destination/马尔代夫')
}

// ─── Search ────────────────────────────────────────
function handleSearch() {
  // reactive via computed
}

// ─── Scroll ────────────────────────────────────────
function scrollRecommend(dir) {
  const el = recommendScroll.value
  if (!el) return
  const amount = 280
  el.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' })
}

function onRecScroll() {
  const el = recommendScroll.value
  if (!el) return
  recScrollAtStart.value = el.scrollLeft <= 4
  recScrollAtEnd.value = el.scrollLeft >= el.scrollWidth - el.clientWidth - 4
}

// ─── Lifecycle ─────────────────────────────────────
onMounted(() => {
  setTimeout(() => { loading.value = false }, 600)
})
</script>

<style scoped>
/* ================================================
   EXPLORE PAGE — 沉浸式目的地探索
   ================================================ */
.explore-page {
  --page-padding: 32px;
  height: 100%;
  overflow-y: auto;
  scroll-behavior: smooth;
  position: relative;
}

/* ─── Hero ─────────────────────────────────────── */
.explore-hero {
  position: relative;
  padding: 48px var(--page-padding) 40px;
  background: linear-gradient(180deg, #E0F2FE 0%, #F0F9FF 40%, transparent 100%);
  overflow: hidden;
}
.hero-bg {
  position: absolute; inset: 0;
  background:
    radial-gradient(ellipse at 20% 80%, rgba(14,165,233,0.08) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(245,158,11,0.06) 0%, transparent 50%);
  pointer-events: none;
}
.hero-particles { position: absolute; inset: 0; pointer-events: none; }
.particle {
  position: absolute;
  top: calc(var(--i) * 12%);
  left: var(--x);
  font-size: 10px;
  color: rgba(14,165,233,0.25);
  animation: float var(--d) ease-in-out infinite alternate;
}
@keyframes float {
  from { transform: translateY(0) scale(1); opacity: 0.3; }
  to   { transform: translateY(-20px) scale(1.3); opacity: 0.8; }
}

.hero-content { position: relative; z-index: 1; max-width: 680px; }
.hero-title {
  font-size: clamp(28px, 4vw, 40px);
  font-weight: 800;
  letter-spacing: -0.03em;
  color: #0F172A;
  margin: 0 0 8px;
  text-wrap: balance;
}
.hero-sub {
  font-size: 15px;
  color: #475569;
  margin: 0 0 24px;
  line-height: 1.6;
}
.hero-search {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff;
  border-radius: 14px;
  padding: 4px 4px 4px 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04);
  transition: box-shadow 0.3s;
}
.hero-search:focus-within {
  box-shadow: 0 4px 24px rgba(14,165,233,0.15), 0 0 0 2px rgba(14,165,233,0.2);
}
.search-icon { color: #94A3B8; flex-shrink: 0; }
.search-input {
  flex: 1;
  border: none;
  outline: none;
  padding: 12px 0;
  font-size: 15px;
  background: transparent;
  color: #0F172A;
  font-family: inherit;
}
.search-input::placeholder { color: #94A3B8; }
.search-clear {
  width: 28px; height: 28px;
  border: none; border-radius: 50%;
  background: #F1F5F9;
  color: #64748B;
  font-size: 12px;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  margin-right: 8px;
  transition: background 0.2s;
}
.search-clear:hover { background: #E2E8F0; }
.hero-trends {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 12px;
  flex-wrap: wrap;
}
.trend-label { font-size: 13px; color: #64748B; font-weight: 500; }
.trend-tag {
  padding: 3px 12px;
  border-radius: 20px;
  border: 1px solid #E2E8F0;
  background: rgba(255,255,255,0.7);
  color: #475569;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}
.trend-tag:hover {
  border-color: #0EA5E9;
  color: #0EA5E9;
  background: rgba(14,165,233,0.06);
}

/* ─── Categories ───────────────────────────────── */
.categories {
  padding: 20px var(--page-padding);
  border-bottom: 1px solid #E2E8F0;
  background: #fff;
}
.categories-scroll {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding-bottom: 4px;
}
.categories-scroll::-webkit-scrollbar { display: none; }
.category-chip {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 18px;
  border-radius: 100px;
  border: 1.5px solid #E2E8F0;
  background: #fff;
  color: #475569;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
  white-space: nowrap;
  font-family: inherit;
}
.category-chip:hover {
  border-color: #0EA5E9;
  color: #0EA5E9;
  background: #F0F9FF;
}
.category-chip.active {
  border-color: transparent;
  background: linear-gradient(135deg, #0EA5E9, #38BDF8);
  color: #fff;
  box-shadow: 0 4px 12px rgba(14,165,233,0.3);
  transform: scale(1.04);
}
.chip-icon { font-size: 16px; }
.chip-label { font-weight: 600; }

/* ─── Featured Banner ──────────────────────────── */
.featured-banner {
  position: relative;
  margin: 24px var(--page-padding);
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  background: linear-gradient(135deg, #0EA5E9 0%, #38BDF8 30%, #F59E0B 100%);
  min-height: 160px;
  transition: transform 0.3s, box-shadow 0.3s;
}
.featured-banner:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(14,165,233,0.25);
}
.banner-bg { position: absolute; inset: 0; opacity: 0.5; }
.banner-wave {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.banner-content {
  position: relative;
  z-index: 1;
  padding: 32px;
  color: #fff;
}
.banner-badge {
  display: inline-block;
  padding: 4px 14px;
  border-radius: 20px;
  background: rgba(255,255,255,0.2);
  backdrop-filter: blur(4px);
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 12px;
}
.banner-title {
  font-size: clamp(22px, 3vw, 30px);
  font-weight: 800;
  letter-spacing: -0.02em;
  margin: 0 0 6px;
}
.banner-desc {
  font-size: 14px;
  opacity: 0.85;
  margin: 0 0 16px;
  line-height: 1.5;
}
.banner-cta {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 20px;
  border-radius: 100px;
  background: #fff;
  color: #0EA5E9;
  font-size: 13px;
  font-weight: 700;
  transition: transform 0.2s;
}
.featured-banner:hover .banner-cta { transform: translateX(4px); }

/* ─── Section Header ───────────────────────────── */
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}
.section-header h2 {
  font-size: 20px;
  font-weight: 700;
  color: #0F172A;
}
.section-count {
  font-size: 13px;
  color: #94A3B8;
  font-weight: 500;
}
.section-hint {
  font-size: 13px;
  color: #94A3B8;
  font-weight: 400;
}

/* ─── Destinations ─────────────────────────────── */
.destinations { padding: 24px var(--page-padding); }
.dest-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

/* Card */
.dest-card {
  background: #fff;
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid #F1F5F9;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
}
.dest-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 32px rgba(0,0,0,0.1);
  border-color: transparent;
}
.dest-card.exploring {
  transform: scale(0.96);
  opacity: 0.7;
}

.card-visual {
  position: relative;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition: height 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.dest-card:hover .card-visual { height: 152px; }
.dest-card:hover .card-visual,
.dest-card:hover .rec-card-visual { background-size: 110%, auto !important; }
.card-visual > *, .rec-card-visual > * { position: relative; z-index: 1; }
.card-visual-shine {
  position: absolute;
  inset: -50%;
  transition: transform 0.2s ease-out;
  pointer-events: none;
}
.card-emoji-wrap {
  position: relative;
  z-index: 1;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgba(255,255,255,0.5);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.dest-card:hover .card-emoji-wrap {
  transform: scale(1.1) translateY(-4px);
}
.card-emoji { font-size: 30px; }
.card-badges {
  position: absolute;
  top: 12px;
  left: 12px;
  right: 12px;
  display: flex;
  gap: 6px;
  z-index: 2;
}
.card-badge {
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  background: rgba(255,255,255,0.75);
  backdrop-filter: blur(4px);
  color: #1E293B;
}
.card-badge.rating { background: rgba(255,255,255,0.85); }
.card-gradient-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(transparent, rgba(0,0,0,0.03));
  pointer-events: none;
}

.card-body {
  padding: 16px 18px 18px;
}
.card-body-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}
.card-title {
  font-size: 17px;
  font-weight: 700;
  color: #0F172A;
  letter-spacing: -0.01em;
}
.card-price {
  font-size: 14px;
  font-weight: 700;
  color: #0EA5E9;
}
.card-desc {
  font-size: 13px;
  color: #64748B;
  line-height: 1.5;
  margin: 0 0 10px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.card-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
.card-tag {
  padding: 2px 10px;
  border-radius: 20px;
  background: #F1F5F9;
  color: #64748B;
  font-size: 11px;
  font-weight: 500;
}

/* ─── Empty State ──────────────────────────────── */
.empty-state {
  text-align: center;
  padding: 60px 20px;
}
.empty-illustration {
  position: relative;
  display: inline-block;
  margin-bottom: 20px;
}
.empty-icon { font-size: 48px; }
.empty-map {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 180px;
  height: 120px;
  opacity: 0.4;
}
.empty-title {
  font-size: 18px;
  font-weight: 700;
  color: #0F172A;
  margin: 0 0 6px;
}
.empty-desc {
  font-size: 14px;
  color: #94A3B8;
  margin: 0 0 20px;
}
.empty-btn {
  padding: 10px 24px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #0EA5E9, #38BDF8);
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}
.empty-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(14,165,233,0.3);
}

/* ─── Recommendations ──────────────────────────── */
.recommend-section {
  padding: 32px var(--page-padding) 48px;
  background: #F8FAFC;
  border-top: 1px solid #F1F5F9;
  margin-top: 8px;
}
.pref-tags {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}
.pref-tag {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 7px 16px;
  border-radius: 100px;
  border: 1.5px solid #E2E8F0;
  background: #fff;
  color: #475569;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}
.pref-tag:hover { border-color: #0EA5E9; color: #0EA5E9; }
.pref-tag.active {
  border-color: transparent;
  background: linear-gradient(135deg, #0EA5E9, #38BDF8);
  color: #fff;
}

.recommend-scroll-wrap {
  position: relative;
  display: flex;
  align-items: center;
}
.scroll-arrow {
  position: absolute;
  z-index: 2;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: #fff;
  color: #475569;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: all 0.2s;
  font-family: inherit;
}
.scroll-arrow:disabled { opacity: 0.3; cursor: default; }
.scroll-arrow:not(:disabled):hover { background: #0EA5E9; color: #fff; }
.scroll-arrow.left { left: -12px; }
.scroll-arrow.right { right: -12px; }

.recommend-scroll {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding: 8px 4px;
  scroll-snap-type: x mandatory;
  width: 100%;
}
.recommend-scroll::-webkit-scrollbar { display: none; }

.rec-card {
  flex-shrink: 0;
  width: 220px;
  border-radius: 16px;
  overflow: hidden;
  background: #fff;
  border: 1px solid #F1F5F9;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  scroll-snap-align: start;
}
.rec-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
}
.rec-card-visual {
  height: 110px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition: height 0.3s;
}
.rec-card:hover .rec-card-visual { height: 96px; }
.rec-card:hover .rec-card-visual { background-size: 110%, auto !important; }
.rec-card-emoji { font-size: 36px; }
.rec-card-body {
  padding: 12px 14px 14px;
}
.rec-card-body h4 {
  font-size: 14px;
  font-weight: 700;
  color: #0F172A;
  margin: 0 0 2px;
}
.rec-card-rating {
  font-size: 12px;
  color: #64748B;
  display: block;
  margin-bottom: 4px;
}
.rec-card-body p {
  font-size: 12px;
  color: #94A3B8;
  line-height: 1.4;
  margin: 0;
}

/* ─── Loading Overlay ──────────────────────────── */
.loading-overlay {
  position: absolute;
  top: 0; left: 0; right: 0;
  z-index: 10;
}
.content-wrapper {
  min-height: 80vh;
}

/* ─── Skeleton ─────────────────────────────────── */
.skeleton-hero {
  height: 200px;
  margin: 24px var(--page-padding);
  border-radius: 20px;
  background: linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 50%, #F1F5F9 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
.skeleton-tabs {
  display: flex;
  gap: 8px;
  padding: 20px var(--page-padding);
}
.skeleton-chip {
  width: 80px;
  height: 36px;
  border-radius: 100px;
  background: linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 50%, #F1F5F9 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  padding: 24px var(--page-padding);
}
.skeleton-card {
  border-radius: 18px;
  overflow: hidden;
  background: #fff;
  border: 1px solid #F1F5F9;
}
.skeleton-img {
  height: 180px;
  background: linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 50%, #F1F5F9 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
.skeleton-line {
  height: 14px;
  margin: 12px 16px;
  border-radius: 4px;
  background: linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 50%, #F1F5F9 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
.skeleton-line.w-60 { width: 60%; }
.skeleton-line.w-80 { width: 80%; }
.skeleton-line.w-40 { width: 40%; }

@keyframes shimmer {
  from { background-position: 200% 0; }
  to { background-position: -200% 0; }
}

/* ─── Responsive ───────────────────────────────── */
@media (max-width: 768px) {
  .explore-page { --page-padding: 16px; }
  .explore-hero { padding: 32px var(--page-padding) 28px; }
  .hero-title { font-size: 24px; }
  .featured-banner { margin: 16px var(--page-padding); min-height: 140px; }
  .banner-content { padding: 20px; }
  .dest-grid { grid-template-columns: 1fr; gap: 14px; }
  .categories-scroll { gap: 6px; }
  .category-chip { padding: 6px 14px; font-size: 12px; }
  .recommend-section { padding: 24px var(--page-padding) 36px; }
}
</style>
