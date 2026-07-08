<template>
  <div class="dest-detail-page" ref="pageRef">
    <!-- ========== LOADING ========== -->
    <div v-if="loading" class="detail-loading">
      <div class="skeleton-hero" />
      <div class="skeleton-section"><div v-for="i in 3" :key="i" class="skeleton-block" /></div>
    </div>

    <!-- ========== NOT FOUND ========== -->
    <div v-else-if="!dest" class="detail-notfound">
      <div class="nf-content">
        <span class="nf-icon">🗺️</span>
        <h2>未找到目的地</h2>
        <p>似乎这个目的地不在我们的列表中</p>
        <button class="nf-btn" @click="$router.push('/app/explore')">← 回到目的地探索</button>
      </div>
    </div>

    <!-- ========== MAIN ========== -->
    <div v-else class="detail-main">
      <!-- ═══ HERO ═══ -->
      <section class="detail-hero" ref="heroRef">
        <div class="hero-bg" :style="{ backgroundImage: `url(${dest.image})` }" />
        <div class="hero-overlay" :style="{ background: `linear-gradient(180deg, transparent 0%, ${dest.themeColor}22 40%, ${dest.themeColor}44 70%, ${dest.themeColor}ee 100%)` }" />
        <div class="hero-content">
          <div class="hero-breadcrumb" @click="$router.push('/app/explore')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            <span>目的地探索</span>
          </div>
          <span class="hero-emoji">{{ dest.emoji }}</span>
          <h1 class="hero-title">{{ dest.name }}</h1>
          <p class="hero-sub">{{ dest.desc }}</p>
          <div class="hero-stats">
            <div class="hero-stat"><span class="stat-value">{{ dest.rating }}</span><span class="stat-label">评分</span></div>
            <div class="hero-stat"><span class="stat-value">¥{{ dest.price }}+</span><span class="stat-label">预算</span></div>
            <div class="hero-stat"><span class="stat-value">{{ dest.bestSeason }}</span><span class="stat-label">最佳季节</span></div>
          </div>
        </div>
        <div class="hero-scroll-hint" @click="scrollToSection('overview')">
          <span>向下探索</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
        </div>
      </section>

      <!-- ═══ STICKY NAV ═══ -->
      <nav class="sticky-nav" :class="{ 'nav-visible': navVisible }" :style="{ '--nav-accent': dest.themeColor }">
        <div class="sticky-nav-inner">
          <button
            v-for="sect in sections" :key="sect.key"
            class="nav-btn"
            :class="{ active: activeSection === sect.key }"
            @click="scrollToSection(sect.key)"
          >{{ sect.icon }} {{ sect.label }}</button>
          <div class="nav-rail" :style="{ left: navRailPos + 'px', width: navRailWidth + 'px' }" />
        </div>
      </nav>

      <!-- ═══ OVERVIEW ═══ -->
      <section class="detail-section" id="section-overview" data-section="overview">
        <div class="section-inner">
          <div class="overview-grid">
            <div class="overview-text">
              <div class="section-label" :style="{ color: dest.themeColor }">关于 {{ dest.name }}</div>
              <h2 class="section-title">{{ dest.name }}印象</h2>
              <p class="overview-paragraph">{{ dest.longDesc }}</p>
              <div class="overview-metrics">
                <div class="metric">
                  <span class="metric-icon">⭐</span>
                  <div><strong>{{ dest.rating }}</strong><p>综合评分</p></div>
                </div>
                <div class="metric">
                  <span class="metric-icon">💰</span>
                  <div><strong>¥{{ dest.price }}+</strong><p>人均预算</p></div>
                </div>
                <div class="metric">
                  <span class="metric-icon">🗓️</span>
                  <div><strong>{{ dest.bestSeason }}</strong><p>最佳季节</p></div>
                </div>
                <div class="metric">
                  <span class="metric-icon">🌡️</span>
                  <div><strong>{{ dest.weather?.split('，')[0] || '宜人' }}</strong><p>气候</p></div>
                </div>
              </div>
            </div>
            <div class="overview-sidebar">
              <div class="info-card" :style="{ borderColor: dest.themeColor + '44' }">
                <h4><span class="info-icon">🌤️</span> 最佳旅行时间</h4>
                <p>{{ dest.bestTime }}</p>
              </div>
              <div class="info-card" :style="{ borderColor: dest.themeColor + '44' }">
                <h4><span class="info-icon">🚗</span> 交通建议</h4>
                <p>{{ dest.transportTips }}</p>
              </div>
              <div class="info-card" :style="{ borderColor: dest.themeColor + '44' }">
                <h4><span class="info-icon">💵</span> 预算参考</h4>
                <p>{{ dest.budgetRange }}</p>
              </div>
              <div class="tag-wrap">
                <span v-for="t in dest.tags" :key="t" class="ov-tag" :style="{ background: dest.themeColor + '18', color: dest.themeColor }">{{ t }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ═══ HIGHLIGHTS ═══ -->
      <section class="detail-section alt-bg" id="section-highlights" data-section="highlights">
        <div class="section-inner">
          <div class="section-label" :style="{ color: dest.themeColor }">🏛️ 必去景点</div>
          <h2 class="section-title">不可错过的地方</h2>
          <p class="section-desc">{{ dest.name }}最值得探访的景点，每一个都有独特的故事</p>
          <div v-if="dest.highlights?.length" class="highlights-grid">
            <div
              v-for="(h, i) in dest.highlights"
              :key="i"
              class="highlight-card"
              :style="{ '--card-accent': dest.themeColor }"
            >
              <div class="hc-number">{{ String(i+1).padStart(2,'0') }}</div>
              <h3 class="hc-title">{{ h.name }}</h3>
              <p class="hc-desc">{{ h.desc }}</p>
              <div class="hc-footer">
                <span class="hc-rating">⭐ {{ h.rating }}</span>
                <span class="hc-price">{{ h.price }}</span>
                <span class="hc-hours">🕐 {{ h.hours }}</span>
              </div>
            </div>
          </div>
          <div v-else class="empty-sect">暂无景点数据</div>
        </div>
      </section>

      <!-- ═══ HOTELS ═══ -->
      <section class="detail-section" id="section-hotels" data-section="hotels">
        <div class="section-inner">
          <div class="section-label" :style="{ color: dest.themeColor }">🏨 住宿推荐</div>
          <h2 class="section-title">住进风景里</h2>
          <p class="section-desc">从豪华度假到特色民宿，找到最适合你的{{ dest.name }}住处</p>
          <div v-if="dest.hotels?.length" class="hotels-grid">
            <div v-for="(h, i) in dest.hotels" :key="i" class="hotel-card" :style="{ '--card-accent': dest.themeColor }">
              <div class="hotel-icon">{{ ['🏰','🏡','🛏️'][i] || '🏨' }}</div>
              <h3 class="hotel-name">{{ h.name }}</h3>
              <div class="hotel-level">{{ h.level }}</div>
              <div class="hotel-meta">
                <span>📍 {{ h.location }}</span>
                <span>⭐ {{ h.rating }}</span>
              </div>
              <div class="hotel-feature">{{ h.feature }}</div>
              <div class="hotel-price">
                <strong>¥{{ h.price }}</strong>
                <span>/晚起</span>
              </div>
            </div>
          </div>
          <div v-else class="empty-sect">暂无住宿数据</div>
        </div>
      </section>

      <!-- ═══ FOOD ═══ -->
      <section class="detail-section alt-bg" id="section-food" data-section="food">
        <div class="section-inner">
          <div class="section-label" :style="{ color: dest.themeColor }">🍜 美食地图</div>
          <h2 class="section-title">{{ dest.name }}味道</h2>
          <p class="section-desc">用味蕾探索城市，每一道菜都是一段旅程</p>
          <div v-if="dest.foods?.length" class="foods-grid">
            <div v-for="(f, i) in dest.foods" :key="i" class="food-card" :style="{ '--card-accent': dest.themeColor }">
              <span class="food-emoji">{{ f.emoji }}</span>
              <div class="food-body">
                <h4>{{ f.name }}</h4>
                <p>{{ f.desc }}</p>
                <span class="food-price">{{ f.price }}</span>
              </div>
            </div>
          </div>
          <div v-else class="empty-sect">暂无美食数据</div>
        </div>
      </section>

      <!-- ═══ ITINERARY ═══ -->
      <section class="detail-section" id="section-itinerary" data-section="itinerary">
        <div class="section-inner">
          <div class="section-label" :style="{ color: dest.themeColor }">📅 推荐行程</div>
          <h2 class="section-title">轻松规划你的旅程</h2>
          <p class="section-desc">精选行程模板，可根据自己的时间和喜好调整</p>
          <div v-if="hasItineraries" class="itinerary-wrap">
            <div class="itinerary-tabs">
              <button
                v-for="days in itineraryKeys"
                :key="days"
                class="itinerary-tab"
                :class="{ active: activeItinerary === days }"
                :style="activeItinerary === days ? { background: dest.themeColor, color: '#fff' } : {}"
                @click="activeItinerary = days"
              >{{ days }} 天行程</button>
            </div>
            <div class="timeline">
              <div
                v-for="(day, di) in currentItinerary"
                :key="di"
                class="timeline-day"
              >
                <div class="timeline-marker" :style="{ borderColor: dest.themeColor }">
                  <span class="timeline-dot" :style="{ background: dest.themeColor }">{{ di + 1 }}</span>
                </div>
                <div class="timeline-content">
                  <h3 class="timeline-day-title">第 {{ di + 1 }} 天 · {{ day.title }}</h3>
                  <div class="timeline-activities">
                    <div v-for="(act, ai) in day.activities" :key="ai" class="activity-item" :class="act.time">
                      <span class="activity-time-badge" :style="{ background: dest.themeColor }">{{ act.time }}</span>
                      <div class="activity-body">
                        <strong>{{ act.activity }}</strong>
                        <p>{{ act.detail }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="empty-sect">暂无行程数据</div>
        </div>
      </section>

      <!-- ═══ REVIEWS ═══ -->
      <section class="detail-section alt-bg" id="section-reviews" data-section="reviews">
        <div class="section-inner">
          <div class="section-label" :style="{ color: dest.themeColor }">💬 旅行者说</div>
          <h2 class="section-title">去过的人怎么说</h2>
          <div v-if="dest.reviews?.length" class="reviews-carousel">
            <div class="reviews-track" :style="{ transform: `translateX(-${reviewIndex * 100}%)` }">
              <div v-for="(r, i) in dest.reviews" :key="i" class="review-card">
                <div class="review-stars">★★★★★</div>
                <blockquote class="review-text">"{{ r.text }}"</blockquote>
                <div class="review-author">
                  <div class="review-avatar" :style="{ background: r.avatarColor }">{{ r.name[0] }}</div>
                  <div>
                    <span class="review-name">{{ r.name }}</span>
                    <span class="review-dest">去了 {{ r.destination }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="reviews-dots">
              <button
                v-for="(_, i) in dest.reviews"
                :key="i"
                class="review-dot"
                :class="{ active: reviewIndex === i }"
                :style="reviewIndex === i ? { background: dest.themeColor } : {}"
                @click="reviewIndex = i"
              />
            </div>
          </div>
          <div v-else class="empty-sect">暂无评价数据</div>
        </div>
      </section>

      <!-- ═══ RELATED ═══ -->
      <section class="detail-section" id="section-related" data-section="related">
        <div class="section-inner">
          <div class="section-label" :style="{ color: dest.themeColor }">🔗 猜你喜欢</div>
          <h2 class="section-title">更多目的地推荐</h2>
          <div class="related-grid">
            <div
              v-for="rd in relatedDests"
              :key="rd.name"
              class="related-card"
              @click="$router.push(`/app/destination/${rd.slug || rd.name}`)"
            >
              <div class="rc-visual" :style="{ background: `url(${rd.image}), ${rd.gradient}`, backgroundSize: 'cover, auto', backgroundPosition: 'center, 0 0' }">
                <span class="rc-emoji">{{ rd.emoji }}</span>
              </div>
              <div class="rc-body">
                <h4>{{ rd.name }}</h4>
                <span>⭐ {{ rd.rating }}</span>
                <p>{{ rd.desc.slice(0, 25) }}…</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ═══ FIXED BOTTOM BAR ═══ -->
      <div class="fixed-bottom-bar" :style="{ '--bar-accent': dest.themeColor }">
        <div class="bar-inner">
          <div class="bar-info">
            <span class="bar-emoji">{{ dest.emoji }}</span>
            <div>
              <strong>{{ dest.name }}</strong>
              <span>⭐ {{ dest.rating }} · ¥{{ dest.price }}+</span>
            </div>
          </div>
          <div class="bar-actions">
            <button class="bar-btn bar-plan" @click="goToChat">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              AI 规划行程
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getDestination, getRelatedDestinations } from '../data/destinations'

const router = useRouter()
const route = useRoute()
const loading = ref(true)
const pageRef = ref(null)
const heroRef = ref(null)
const navVisible = ref(false)
const activeSection = ref('overview')
const activeItinerary = ref('3日')
const reviewIndex = ref(0)
const navRailPos = ref(0)
const navRailWidth = ref(0)
let reviewInterval = null
let observer = null

const sections = [
  { key: 'overview', icon: '📖', label: '概览' },
  { key: 'highlights', icon: '🏛️', label: '景点' },
  { key: 'hotels', icon: '🏨', label: '住宿' },
  { key: 'food', icon: '🍜', label: '美食' },
  { key: 'itinerary', icon: '📅', label: '行程' },
  { key: 'reviews', icon: '💬', label: '评价' },
]

const dest = computed(() => {
  const name = route.params.name
  return getDestination(name)
})

const relatedDests = computed(() => {
  if (!dest.value) return []
  return getRelatedDestinations(dest.value, 4)
})

const hasItineraries = computed(() => {
  return dest.value?.itineraries && Object.keys(dest.value.itineraries).length > 0
})

const itineraryKeys = computed(() => {
  if (!dest.value?.itineraries) return []
  return Object.keys(dest.value.itineraries)
})

const currentItinerary = computed(() => {
  if (!dest.value?.itineraries) return []
  return dest.value.itineraries[activeItinerary.value] || []
})

// ─── Scroll to section ────────────────────────
function scrollToSection(key) {
  const el = document.getElementById(`section-${key}`)
  if (el) {
    const top = el.getBoundingClientRect().top + window.scrollY - 70
    window.scrollTo({ top, behavior: 'smooth' })
  }
}

// ─── Intersection Observer for active section ──
function setupObserver() {
  const sectionEls = document.querySelectorAll('[data-section]')
  if (!sectionEls.length) return
  observer = new IntersectionObserver((entries) => {
    const visible = entries.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
    if (visible.length) {
      activeSection.value = visible[0].dataset.section
      updateNavRail(visible[0].dataset.section)
    }
  }, { threshold: 0.15, rootMargin: '-80px 0px -40% 0px' })
  sectionEls.forEach(el => observer.observe(el))
}

function updateNavRail(key) {
  const btn = document.querySelector(`.nav-btn[data-key="${key}"]`)
  // use text content matching
  const allBtns = document.querySelectorAll('.nav-btn')
  const idx = sections.findIndex(s => s.key === key)
  if (allBtns[idx]) {
    const rect = allBtns[idx].getBoundingClientRect()
    const parent = allBtns[idx].closest('.sticky-nav-inner')
    if (parent) {
      navRailPos.value = rect.left - parent.getBoundingClientRect().left
      navRailWidth.value = rect.width
    }
  }
}

// ─── Go to Chat ──────────────────────────────
function goToChat() {
  if (!dest.value) return
  const q = `帮我规划去${dest.value.name}的行程`
  router.push({ path: '/app/chat', query: { q } })
}

// ─── Lifecycle ───────────────────────────────
onMounted(() => {
  setTimeout(() => { loading.value = false }, 400)

  // Scroll listener for sticky nav
  const onScroll = () => {
    navVisible.value = window.scrollY > (heroRef.value?.offsetHeight || 400) - 80
  }
  window.addEventListener('scroll', onScroll, { passive: true })

  // Reviews carousel
  reviewInterval = setInterval(() => {
    if (dest.value?.reviews?.length) {
      reviewIndex.value = (reviewIndex.value + 1) % dest.value.reviews.length
    }
  }, 5000)

  // Setup observer after DOM update
  setTimeout(setupObserver, 600)

  onUnmounted(() => {
    window.removeEventListener('scroll', onScroll)
    if (reviewInterval) clearInterval(reviewInterval)
    if (observer) observer.disconnect()
  })
})
</script>

<style scoped>
/* ================================================
   DESTINATION DETAIL — 沉浸式目的地详情页
   ================================================ */
.dest-detail-page {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  scroll-behavior: smooth;
  position: relative;
}

/* ─── Loading ──────────────────── */
.detail-loading {
  padding: 0;
}
.skeleton-hero {
  height: 60vh;
  background: linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 50%, #F1F5F9 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
.skeleton-section { padding: 40px 48px; }
.skeleton-block {
  height: 100px;
  margin-bottom: 20px;
  border-radius: 16px;
  background: linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 50%, #F1F5F9 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
@keyframes shimmer {
  from { background-position: 200% 0; }
  to { background-position: -200% 0; }
}

/* ─── Not Found ────────────────── */
.detail-notfound {
  display: flex; align-items: center; justify-content: center;
  height: 80vh; text-align: center;
}
.nf-icon { font-size: 80px; display: block; margin-bottom: 16px; }
.nf-content h2 { font-size: 24px; font-weight: 700; color: #0F172A; margin-bottom: 8px; }
.nf-content p { color: #94A3B8; margin-bottom: 24px; }
.nf-btn {
  padding: 12px 28px; border-radius: 12px; border: none;
  background: linear-gradient(135deg, #0EA5E9, #38BDF8); color: #fff;
  font-size: 15px; font-weight: 600; cursor: pointer; font-family: inherit;
  transition: transform 0.2s;
}
.nf-btn:hover { transform: translateY(-2px); }

/* ─── HERO ─────────────────────── */
.detail-hero {
  position: relative;
  height: 70vh;
  min-height: 500px;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
}
.hero-bg {
  position: absolute; inset: 0;
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  transform: scale(1.1);
  transition: transform 0.3s;
}
.hero-overlay {
  position: absolute; inset: 0;
}
.hero-content {
  position: relative;
  z-index: 2;
  padding: 48px;
  color: #fff;
  width: 100%;
  animation: heroFadeIn 1s ease-out;
}
@keyframes heroFadeIn {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
.hero-breadcrumb {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: rgba(255,255,255,0.7);
  cursor: pointer;
  margin-bottom: 20px;
  transition: color 0.2s;
}
.hero-breadcrumb:hover { color: #fff; }
.hero-emoji { font-size: 56px; display: block; margin-bottom: 12px; filter: drop-shadow(0 4px 12px rgba(0,0,0,0.3)); }
.hero-title {
  font-size: clamp(36px, 6vw, 64px);
  font-weight: 800;
  letter-spacing: -0.03em;
  margin: 0 0 8px;
  text-shadow: 0 2px 20px rgba(0,0,0,0.3);
}
.hero-sub {
  font-size: clamp(16px, 1.6vw, 20px);
  color: rgba(255,255,255,0.85);
  max-width: 600px;
  margin: 0 0 28px;
  line-height: 1.7;
  text-shadow: 0 1px 8px rgba(0,0,0,0.2);
}
.hero-stats {
  display: flex;
  gap: 24px;
}
.hero-stat {
  text-align: center;
}
.stat-value {
  display: block;
  font-size: 20px;
  font-weight: 700;
  text-shadow: 0 1px 8px rgba(0,0,0,0.2);
}
.stat-label {
  font-size: 12px;
  color: rgba(255,255,255,0.7);
}
.hero-scroll-hint {
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  color: rgba(255,255,255,0.6);
  font-size: 12px;
  cursor: pointer;
  animation: bounce 2s infinite;
  z-index: 2;
}
@keyframes bounce {
  0%,100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(8px); }
}

/* ─── Sticky Nav ───────────────── */
.sticky-nav {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(255,255,255,0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(0,0,0,0.06);
  transform: translateY(-100%);
  transition: transform 0.3s;
}
.sticky-nav.nav-visible {
  transform: translateY(0);
}
.sticky-nav-inner {
  display: flex;
  gap: 0;
  padding: 0 32px;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  overflow-x: auto;
  scrollbar-width: none;
}
.sticky-nav-inner::-webkit-scrollbar { display: none; }
.nav-btn {
  position: relative;
  padding: 14px 20px;
  border: none;
  background: none;
  color: #64748B;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition: color 0.2s;
  font-family: inherit;
  flex-shrink: 0;
}
.nav-btn:hover { color: #0F172A; }
.nav-btn.active { color: v-bind('dest?.themeColor || "#0EA5E9"'); font-weight: 600; }
.nav-rail {
  position: absolute;
  bottom: 0;
  height: 3px;
  border-radius: 3px 3px 0 0;
  background: v-bind('dest?.themeColor || "#0EA5E9"');
  transition: left 0.3s, width 0.3s;
}

/* ─── Section Common ───────────── */
.detail-section { padding: 0; }
.section-inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 72px 32px;
}
.alt-bg { background: #F8FAFC; }
.section-label {
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 8px;
}
.section-title {
  font-size: clamp(26px, 3vw, 34px);
  font-weight: 800;
  color: #0F172A;
  letter-spacing: -0.02em;
  margin: 0 0 8px;
}
.section-desc {
  font-size: 17px;
  color: #64748B;
  margin: 0 0 40px;
  max-width: 500px;
  line-height: 1.8;
}
.empty-sect {
  text-align: center;
  padding: 40px;
  color: #94A3B8;
  font-size: 14px;
  background: #fff;
  border-radius: 16px;
  border: 1px dashed #E2E8F0;
}

/* ─── Overview ─────────────────── */
.overview-grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 48px;
  align-items: start;
}
.overview-text {}
.overview-paragraph {
  font-size: 18px;
  color: #334155;
  line-height: 2;
  margin: 16px 0 28px;
}
.overview-metrics {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.metric {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  background: #F8FAFC;
  border-radius: 12px;
}
.metric-icon { font-size: 22px; }
.metric strong { display: block; font-size: 17px; color: #0F172A; }
.metric p { font-size: 13px; color: #94A3B8; margin: 0; }

.overview-sidebar {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.info-card {
  padding: 18px 20px;
  border-radius: 14px;
  background: #fff;
  border: 1px solid #E2E8F0;
  transition: box-shadow 0.2s;
}
.info-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.06); }
.info-card h4 {
  font-size: 14px;
  font-weight: 700;
  color: #0F172A;
  margin: 0 0 6px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.info-icon { font-size: 16px; }
.info-card p {
  font-size: 15px;
  color: #64748B;
  line-height: 1.7;
  margin: 0;
}
.tag-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 4px;
}
.ov-tag {
  padding: 4px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

/* ─── Highlights ───────────────── */
.highlights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}
.highlight-card {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #F1F5F9;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
}
.highlight-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0,0,0,0.08);
  border-color: transparent;
}
.hc-number {
  font-size: 32px;
  font-weight: 800;
  color: #E2E8F0;
  margin-bottom: 8px;
  font-feature-settings: 'tnum';
}
.hc-title {
  font-size: 17px;
  font-weight: 700;
  color: #0F172A;
  margin: 0 0 8px;
}
.hc-desc {
  font-size: 15px;
  color: #64748B;
  line-height: 1.8;
  margin: 0 0 16px;
}
.hc-footer {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  font-size: 14px;
  color: #64748B;
}
.hc-rating, .hc-price, .hc-hours {
  padding: 2px 8px;
  background: #F8FAFC;
  border-radius: 6px;
}

/* ─── Hotels ───────────────────── */
.hotels-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}
.hotel-card {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #F1F5F9;
  transition: all 0.3s;
}
.hotel-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0,0,0,0.08);
}
.hotel-icon { font-size: 40px; margin-bottom: 12px; }
.hotel-name { font-size: 16px; font-weight: 700; color: #0F172A; margin: 0 0 4px; }
.hotel-level { font-size: 12px; color: var(--card-accent, #0EA5E9); font-weight: 600; margin-bottom: 8px; }
.hotel-meta { display: flex; gap: 12px; font-size: 12px; color: #94A3B8; margin-bottom: 8px; }
.hotel-feature { font-size: 13px; color: #64748B; margin-bottom: 16px; }
.hotel-price { font-size: 20px; font-weight: 700; color: #0F172A; }
.hotel-price span { font-size: 13px; font-weight: 400; color: #94A3B8; }

/* ─── Foods ─────────────────────── */
.foods-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}
.food-card {
  display: flex;
  gap: 16px;
  padding: 20px;
  background: #fff;
  border-radius: 14px;
  border: 1px solid #F1F5F9;
  transition: all 0.3s;
}
.food-card:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.06); }
.food-emoji { font-size: 36px; flex-shrink: 0; }
.food-body h4 { font-size: 17px; font-weight: 700; color: #0F172A; margin: 0 0 4px; }
.food-body p { font-size: 15px; color: #64748B; line-height: 1.7; margin: 0 0 8px; }
.food-price { font-size: 12px; color: var(--card-accent, #0EA5E9); font-weight: 600; }

/* ─── Itinerary ────────────────── */
.itinerary-wrap {
  background: #fff;
  border-radius: 20px;
  border: 1px solid #F1F5F9;
  overflow: hidden;
}
.itinerary-tabs {
  display: flex;
  gap: 0;
  border-bottom: 1px solid #F1F5F9;
  background: #F8FAFC;
}
.itinerary-tab {
  flex: 1;
  padding: 14px 24px;
  border: none;
  background: none;
  color: #64748B;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}
.itinerary-tab:not(.active):hover { color: #0F172A; background: rgba(0,0,0,0.02); }

.timeline {
  padding: 32px 40px;
}
.timeline-day {
  display: flex;
  gap: 24px;
  margin-bottom: 32px;
  position: relative;
}
.timeline-day:last-child { margin-bottom: 0; }
.timeline-marker {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 36px;
  flex-shrink: 0;
  position: relative;
}
.timeline-dot {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  z-index: 1;
}
.timeline-marker::after {
  content: '';
  position: absolute;
  top: 40px;
  width: 2px;
  height: calc(100% + 8px);
  background: #E2E8F0;
}
.timeline-day:last-child .timeline-marker::after { display: none; }
.timeline-content { flex: 1; }
.timeline-day-title {
  font-size: 17px;
  font-weight: 700;
  color: #0F172A;
  margin: 0 0 16px;
  padding-top: 6px;
}
.timeline-activities { display: flex; flex-direction: column; gap: 12px; }
.activity-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 14px 18px;
  background: #F8FAFC;
  border-radius: 12px;
  transition: background 0.2s;
}
.activity-item:hover { background: #F1F5F9; }
.activity-time-badge {
  padding: 3px 10px;
  border-radius: 6px;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  flex-shrink: 0;
}
.activity-body strong { font-size: 16px; color: #0F172A; display: block; margin-bottom: 4px; }
.activity-body p { font-size: 15px; color: #64748B; margin: 0; line-height: 1.6; }

/* ─── Reviews ──────────────────── */
.reviews-carousel {
  overflow: hidden;
  position: relative;
}
.reviews-track {
  display: flex;
  transition: transform 0.6s ease-out;
}
.review-card {
  min-width: 100%;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 32px;
  text-align: center;
}
.review-stars { color: #F59E0B; font-size: 22px; letter-spacing: 6px; margin-bottom: 16px; }
.review-text {
  font-size: 18px;
  color: #1E293B;
  line-height: 1.9;
  max-width: 650px;
  font-style: italic;
  margin: 0 auto 24px;
}
.review-author {
  display: flex;
  align-items: center;
  gap: 12px;
}
.review-avatar {
  width: 44px; height: 44px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  color: #fff; font-weight: 700; font-size: 18px;
}
.review-name { display: block; font-size: 15px; font-weight: 600; color: #0F172A; }
.review-dest { font-size: 13px; color: #94A3B8; }
.reviews-dots {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;
}
.review-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  border: none;
  background: #CBD5E1;
  cursor: pointer;
  transition: all 0.3s;
  padding: 0;
}
.review-dot.active {
  width: 28px;
  border-radius: 4px;
}

/* ─── Related ───────────────────── */
.related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
}
.related-card {
  border-radius: 14px;
  overflow: hidden;
  background: #fff;
  border: 1px solid #F1F5F9;
  cursor: pointer;
  transition: all 0.3s;
}
.related-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.1); }
.rc-visual {
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.rc-emoji { font-size: 38px; }
.rc-body { padding: 12px 14px 14px; }
.rc-body h4 { font-size: 15px; font-weight: 700; color: #0F172A; margin: 0 0 2px; }
.rc-body span { font-size: 12px; color: #64748B; display: block; margin-bottom: 4px; }
.rc-body p { font-size: 12px; color: #94A3B8; margin: 0; line-height: 1.4; }

/* ─── Fixed Bottom Bar ──────────── */
.fixed-bottom-bar {
  position: fixed;
  bottom: 0;
  left: 240px;
  right: 0;
  z-index: 40;
  background: rgba(255,255,255,0.92);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-top: 1px solid rgba(0,0,0,0.06);
  padding: 0 32px;
  animation: barSlideUp 0.4s ease-out;
}
@keyframes barSlideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}
.bar-inner {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 0;
}
.bar-info {
  display: flex;
  align-items: center;
  gap: 12px;
}
.bar-emoji { font-size: 32px; }
.bar-info div strong { display: block; font-size: 16px; color: #0F172A; }
.bar-info div span { font-size: 13px; color: #64748B; }
.bar-actions { display: flex; gap: 12px; }
.bar-btn {
  padding: 10px 24px;
  border-radius: 12px;
  border: none;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: inherit;
}
.bar-plan {
  background: linear-gradient(135deg, var(--bar-accent, #0EA5E9), color-mix(in srgb, var(--bar-accent, #0EA5E9) 80%, white));
  color: #fff;
  box-shadow: 0 4px 12px color-mix(in srgb, var(--bar-accent, #0EA5E9) 40%, transparent);
}
.bar-plan:hover { transform: translateY(-2px); }

/* ─── Responsive ────────────────── */
@media (max-width: 1024px) {
  .overview-grid { grid-template-columns: 1fr; gap: 32px; }
  .fixed-bottom-bar { left: 0; }
}
@media (max-width: 768px) {
  .section-inner { padding: 48px 20px; }
  .hero-content { padding: 24px; }
  .hero-emoji { font-size: 40px; }
  .hero-stats { gap: 16px; }
  .overview-metrics { grid-template-columns: 1fr 1fr; }
  .highlights-grid { grid-template-columns: 1fr; }
  .hotels-grid { grid-template-columns: 1fr; }
  .foods-grid { grid-template-columns: 1fr; }
  .timeline { padding: 24px; }
  .timeline-day { gap: 16px; }
  .activity-item { flex-direction: column; }
  .sticky-nav-inner { padding: 0 16px; }
  .nav-btn { padding: 12px 14px; font-size: 12px; }
  .related-grid { grid-template-columns: 1fr 1fr; }
  .detail-hero { height: 55vh; min-height: 400px; }
  .hero-bg { background-attachment: scroll; }
  .fixed-bottom-bar { padding: 0 16px; }
  .bar-info .bar-emoji { display: none; }
}
</style>
