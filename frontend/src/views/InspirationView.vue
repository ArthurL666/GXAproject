<template>
  <div class="inspire-page">
    <!-- ========== LOADING ========== -->
    <div v-if="loading" class="loading-overlay">
      <div class="skeleton-header" />
      <div class="skeleton-cats"><span v-for="i in 4" :key="i" class="skeleton-cat-card" /></div>
      <div class="skeleton-feat" />
      <div class="skeleton-articles">
        <div v-for="i in 4" :key="i" class="skeleton-art" />
      </div>
    </div>

    <!-- ========== MAIN ========== -->
    <div v-show="!loading" class="content-wrapper">
      <!-- Page Header -->
      <header class="inspire-header">
        <div class="header-bg" style="background: url('https://images.pexels.com/photos/29614950/pexels-photo-29614950.jpeg?auto=compress&cs=tinysrgb&w=1200'), radial-gradient(ellipse at 10% 90%, rgba(14,165,233,0.12) 0%, transparent 50%), radial-gradient(ellipse at 90% 10%, rgba(245,158,11,0.08) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(255,255,255,0.02) 0%, transparent 70%); background-size: cover, auto, auto, auto; background-position: center, 0 0, 0 0, 0 0;"></div>
        <div class="header-content">
          <span class="header-badge">✨ 灵感</span>
          <h1 class="header-title">旅行灵感</h1>
          <p class="header-sub">从别人的旅程里，找到你的下一次出发</p>
        </div>
      </header>

      <!-- Inspiration Categories -->
      <section class="inspire-categories">
        <div class="categories-grid">
          <article
            v-for="cat in categories"
            :key="cat.key"
            class="cat-card"
            :style="{ background: cat.gradient }"
            @click="handleCategoryClick(cat)"
          >
            <span class="cat-emoji">{{ cat.emoji }}</span>
            <h3 class="cat-title">{{ cat.title }}</h3>
            <p class="cat-count">{{ cat.count }} 篇灵感</p>
          </article>
        </div>
      </section>

      <!-- Trending Section -->
      <section class="trending-section">
        <div class="section-header">
          <h2>🔥 热门灵感 · 本周最受欢迎</h2>
        </div>
        <div class="trending-grid">
          <article class="trending-hero" @click="openArticle(featuredArticle)">
            <div class="trending-hero-visual" :style="{ background: `url(${featuredArticle.image}), ${featuredArticle.gradient}`, backgroundSize: 'cover, auto', backgroundPosition: 'center, 0 0' }">
              <span class="trending-hero-icon">{{ featuredArticle.icon }}</span>
              <div class="trending-hero-overlay" />
            </div>
            <div class="trending-hero-body">
              <div class="trending-hero-meta">
                <span class="th-meta">⭐ {{ featuredArticle.rating }}</span>
                <span class="th-meta">👁️ {{ featuredArticle.views }} 阅读</span>
                <span class="th-meta">📍 {{ featuredArticle.location }}</span>
              </div>
              <h3 class="trending-hero-title">{{ featuredArticle.title }}</h3>
              <p class="trending-hero-desc">{{ featuredArticle.summary }}</p>
              <div class="trending-hero-author">
                <div class="author-avatar" :style="{ background: featuredArticle.authorColor }">{{ featuredArticle.author[0] }}</div>
                <div>
                  <span class="author-name">{{ featuredArticle.author }}</span>
                  <span class="author-date">{{ featuredArticle.date }}</span>
                </div>
              </div>
            </div>
          </article>

          <div class="trending-sidebar">
            <article
              v-for="(article, i) in trendingArticles"
              :key="article.title"
              class="trending-side-card"
              @click="openArticle(article)"
            >
              <span class="trending-number">{{ String(i + 1).padStart(2, '0') }}</span>
              <div class="trending-side-body">
                <h4>{{ article.title }}</h4>
                <div class="trending-side-meta">
                  <span>⭐ {{ article.rating }}</span>
                  <span>👁️ {{ article.views }}</span>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <!-- Seasonal Collections -->
      <section class="collections-section">
        <div class="section-header">
          <h2>📅 精选专题</h2>
          <span class="section-link" @click="handleViewAll">查看全部 →</span>
        </div>
        <div class="collections-grid">
          <div
            v-for="col in collections"
            :key="col.title"
            class="collection-card"
            :style="{ background: col.gradient }"
            @click="handleCollectionClick(col)"
          >
            <span class="collection-icon">{{ col.icon }}</span>
            <h3 class="collection-title">{{ col.title }}</h3>
            <p class="collection-desc">{{ col.desc }}</p>
          </div>
        </div>
      </section>

      <!-- Masonry Article Feed -->
      <section class="articles-section">
        <div class="section-header">
          <h2>📝 探索更多灵感</h2>
        </div>
        <div class="masonry-grid">
          <article
            v-for="article in articles"
            :key="article.title"
            class="article-card"
            :class="`article-card--${article.size}`"
            @click="openArticle(article)"
          >
            <div class="article-visual" :style="{ background: `url(${article.image}), ${article.gradient}`, backgroundSize: 'cover, auto', backgroundPosition: 'center, 0 0' }">
              <span class="article-emoji">{{ article.icon }}</span>
            </div>
            <div class="article-body">
              <div class="article-tags">
                <span v-for="tag in article.tags" :key="tag" class="article-tag">{{ tag }}</span>
              </div>
              <h3 class="article-title">{{ article.title }}</h3>
              <p class="article-desc">{{ article.summary }}</p>
              <div class="article-footer">
                <span class="article-readtime">⏱ {{ article.readTime }} 分钟</span>
                <span class="article-likes">❤️ {{ article.likes }}</span>
              </div>
            </div>
          </article>
        </div>
      </section>

      <!-- User Reviews Carousel -->
      <section class="reviews-section">
        <div class="section-header">
          <h2>💬 旅行者说</h2>
        </div>
        <div class="reviews-carousel">
          <div
            class="reviews-track"
            :style="{ transform: `translateX(-${reviewIndex * 100}%)` }"
          >
            <div
              v-for="(review, i) in reviews"
              :key="i"
              class="review-card"
            >
              <div class="review-stars">★★★★★</div>
              <blockquote class="review-text">"{{ review.text }}"</blockquote>
              <div class="review-author">
                <div class="review-avatar" :style="{ background: review.avatarColor }">{{ review.name[0] }}</div>
                <div>
                  <span class="review-name">{{ review.name }}</span>
                  <span class="review-dest">去了 {{ review.destination }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="reviews-dots">
            <button
              v-for="(_, i) in reviews"
              :key="i"
              class="review-dot"
              :class="{ active: reviewIndex === i }"
              @click="reviewIndex = i"
            />
          </div>
        </div>
      </section>

      <!-- AI Recommendation -->
      <section class="ai-recommend">
        <div class="ai-recommend-bg" />
        <div class="ai-recommend-content">
          <span class="ai-badge"><AiIcon :size="14" variant="primary" style="margin-right:4px" /> AI 推荐</span>
          <h2>为你量身推荐</h2>
          <p>告诉我你的旅行偏好，AI 为你精选最合适的灵感内容</p>
          <div class="ai-prefs">
            <button
              v-for="p in aiPrefs"
              :key="p"
              class="ai-pref-btn"
              :class="{ selected: selectedAIPrefs.includes(p) }"
              @click="toggleAIPref(p)"
            >{{ p }}</button>
          </div>
          <button class="ai-cta" :disabled="!selectedAIPrefs.length" @click="handleAIRecommend">
            ✨ 生成推荐
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AiIcon from '../components/AiIcon.vue'

const router = useRouter()
const loading = ref(true)
const reviewIndex = ref(0)
const selectedAIPrefs = ref([])
let reviewInterval = null

// ─── Data ─────────────────────────────────────────
const unsplash = (id) => `https://images.unsplash.com/photo-${id}?w=600&h=400&fit=crop&auto=format`
const pexels = (id) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=600`

const categories = [
  { key: 'island',  emoji: '🏖️', title: '海岛度假', count: 128, gradient: 'linear-gradient(135deg, #D1FAE5 0%, #6EE7B7 50%, #34D399 100%)' },
  { key: 'food',    emoji: '🍜', title: '美食之旅', count: 96,  gradient: 'linear-gradient(135deg, #FEF3C7 0%, #FCD34D 50%, #FBBF24 100%)' },
  { key: 'photo',   emoji: '📸', title: '摄影之旅', count: 74,  gradient: 'linear-gradient(135deg, #E0F2FE 0%, #93C5FD 50%, #60A5FA 100%)' },
  { key: 'healing', emoji: '🧘', title: '治愈之旅', count: 82,  gradient: 'linear-gradient(135deg, #FCE7F3 0%, #F9A8D4 50%, #F472B6 100%)' },
]

const featuredArticle = {
  slug: 'iceland-road-trip',
  title: '一个人的冰岛自驾',
  summary: '在最孤独的公路驶向世界的尽头——冰岛环岛自驾 12 天全记录，遇见极光、冰川与黑沙滩的震撼',
  icon: '🌌',
  image: pexels('33705542'),
  gradient: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 30%, #6D28D9 60%, #A78BFA 100%)',
  rating: 4.9,
  views: '12.3k',
  location: '冰岛',
  author: '陈晓',
  authorColor: '#7C3AED',
  date: '2026年6月',
}

const trendingArticles = [
  { slug: 'kyoto-autumn-leaves', title: '京都赏枫全攻略',     rating: 4.8, views: '9.8k', icon: '🍁' },
  { slug: 'bali-hidden-gems', title: '巴厘岛隐藏版秘境',   rating: 4.9, views: '8.2k', icon: '🏝️' },
  { slug: 'switzerland-golden-pass', title: '瑞士黄金列车之旅',   rating: 4.7, views: '7.6k', icon: '🚂' },
  { slug: 'chiangmai-slow-life', title: '清迈慢生活日记',     rating: 4.8, views: '6.9k', icon: '🌴' },
  { slug: 'paris-cafe-guide', title: '巴黎最美咖啡馆巡礼', rating: 4.6, views: '5.4k', icon: '☕' },
]

const collections = [
  { icon: '🌸', slug: 'spring-blossom', title: '春日赏花指南', desc: '樱花、油菜花、薰衣草，赴一场花事之约', gradient: 'linear-gradient(135deg, #FFF1F2 0%, #FBCFE8 50%, #FDA4AF 100%)' },
  { icon: '🍂', slug: 'autumn-red-leaves', title: '秋日红叶物语', desc: '漫山红遍，层林尽染，寻找最美秋色',   gradient: 'linear-gradient(135deg, #FEF3C7 0%, #FCD34D 50%, #F59E0B 100%)' },
  { icon: '❄️', slug: 'winter-snow-wonderland', title: '冬日雪境奇遇', desc: '雪国列车、极光小屋，许你一个白色童话', gradient: 'linear-gradient(135deg, #F1F5F9 0%, #CBD5E1 50%, #94A3B8 100%)' },
]

const wmedia = (url) => url
const articles = [
  { slug: 'lost-in-chiangmai', title: '迷失在清迈的慢时光',       icon: '🌴', image: pexels('32763116'),  gradient: 'linear-gradient(135deg, #D1FAE5 0%, #34D399 100%)',       summary: '在清迈的寺庙与夜市之间，找到了生活的另一种节奏',             tags: ['城市漫游', '文化'], readTime: 5,  likes: 234, size: 'tall',  location: '清迈' },
  { slug: 'tuscany-sun', title: '托斯卡纳的艳阳下',         icon: '🍷', image: pexels('32647226'),       gradient: 'linear-gradient(135deg, #FEF3C7 0%, #F59E0B 100%)',       summary: '意大利最美的乡村，葡萄酒庄与橄榄树的无尽夏日',             tags: ['美食', '自然'],   readTime: 7,  likes: 189, size: 'wide', location: '意大利' },
  { slug: 'tokyo-night-food', title: '东京深夜食堂巡礼',         icon: '🍜', image: pexels('18848537'),  gradient: 'linear-gradient(135deg, #FCE7F3 0%, #F472B6 100%)',       summary: '从新宿到浅草，寻找那些藏在巷子深处的米其林味道',           tags: ['美食之旅'],       readTime: 4,  likes: 312, size: 'reg',  location: '东京' },
  { slug: 'new-zealand-campervan', title: '新西兰南岛房车之旅',       icon: '🚐', image: pexels('28142481'),       gradient: 'linear-gradient(135deg, #E0F2FE 0%, #38BDF8 100%)',       summary: '开着房车穿越中土世界，星空与冰川是每晚的标配',             tags: ['自然风光'],       readTime: 8,  likes: 267, size: 'tall',  location: '新西兰' },
  { slug: 'morocco-fez-maze', title: '摩洛哥迷城记',            icon: '🐪', image: pexels('30485125'),       gradient: 'linear-gradient(135deg, #FED7AA 0%, #FB923C 100%)',        summary: '在菲斯古城的一千零一夜里迷路，是最好的旅行方式',           tags: ['文化历史'],       readTime: 6,  likes: 156, size: 'reg',  location: '摩洛哥' },
  { slug: 'dali-erhai-cycling', title: '大理洱海骑行环湖指南',     icon: '🚲', image: pexels('33970874'),       gradient: 'linear-gradient(135deg, #E0F2FE 0%, #7DD3FC 100%)',       summary: '120公里环湖路，苍山为伴，洱海为邻，遇见最美的云南',         tags: ['自然', '户外'],   readTime: 5,  likes: 198, size: 'reg',  location: '大理' },
  { slug: 'tibet-holy-land', title: '西藏，离天堂最近的地方',    icon: '🏔️', image: wmedia('https://upload.wikimedia.org/wikipedia/commons/4/4f/Potala.jpg'), gradient: 'linear-gradient(135deg, #F3E8FF 0%, #A78BFA 100%)',      summary: '在海拔5000米的冈仁波齐，遇见最纯粹的自己',                 tags: ['自然风光', '文化'], readTime: 10, likes: 423, size: 'wide', location: '西藏' },
  { slug: 'bangkok-street-food', title: '曼谷街头美食地图',         icon: '🌶️', image: pexels('33202938'),       gradient: 'linear-gradient(135deg, #FEE2E2 0%, #F87171 100%)',      summary: '从唐人街到考山路，50块钱吃遍曼谷最佳街头小吃',             tags: ['美食之旅'],       readTime: 3,  likes: 145, size: 'reg',  location: '曼谷' },
]

const reviews = [
  { text: '用了游伴AI规划的泰国行程太完美了！连隐藏在小巷子里的网红餐厅都找到了，朋友都以为我是旅游达人', name: '小雨妈妈', avatarColor: '#0EA5E9', destination: '泰国' },
  { text: '本来以为AI规划的行程会很死板，结果每一天的安排都恰到好处，还预留了自由探索的时间，太惊喜了',    name: '背包客小王', avatarColor: '#10B981', destination: '日本' },
  { text: '带爸妈去云南，AI推荐的路线轻松又精彩，老人家玩得非常开心。已经推荐给所有要旅游的同事了',     name: '阳光丽丽', avatarColor: '#F59E0B', destination: '云南' },
  { text: '瑞士10天的行程，每个衔接都很顺畅，连火车时刻表都自动优化了。省了我至少一周的攻略时间',      name: '旅行摄影师', avatarColor: '#7C3AED', destination: '瑞士' },
  { text: '最惊喜的是AI推荐的冰岛小众瀑布，完全没有旅行团，独享整片风景。这体验花钱都买不到',         name: '极光追逐者', avatarColor: '#EC4899', destination: '冰岛' },
]

const aiPrefs = ['🏔️ 自然风光', '🏙️ 城市漫游', '🍜 美食达人', '📸 摄影控', '🧘 放松度假', '🎭 文化体验']

// ─── Methods ─────────────────────────────────────
function openArticle(article) {
  const s = article.slug || article.title
  router.push('/app/article/' + encodeURIComponent(s))
}

function handleCategoryClick(cat) {
  const q = `推荐${cat.title}相关的旅行目的地`
  router.push({ path: '/app/chat', query: { q } })
}

function handleCollectionClick(col) {
  router.push('/app/collection/' + col.slug)
}

function handleViewAll() {
  router.push({ path: '/app/explore' })
}

function toggleAIPref(pref) {
  const idx = selectedAIPrefs.value.indexOf(pref)
  if (idx >= 0) selectedAIPrefs.value.splice(idx, 1)
  else if (selectedAIPrefs.value.length < 3) selectedAIPrefs.value.push(pref)
}

function handleAIRecommend() {
  if (!selectedAIPrefs.value.length) return
  const prefs = selectedAIPrefs.value.join('、')
  const q = `我偏爱${prefs}，请为我推荐适合的旅行目的地和灵感内容`
  router.push({ path: '/app/chat', query: { q } })
}

// ─── Lifecycle ────────────────────────────────────
onMounted(() => {
  setTimeout(() => { loading.value = false }, 600)
  reviewInterval = setInterval(() => {
    reviewIndex.value = (reviewIndex.value + 1) % reviews.length
  }, 4000)
})

// Cleanup
import { onUnmounted } from 'vue'
onUnmounted(() => {
  if (reviewInterval) clearInterval(reviewInterval)
})
</script>

<style scoped>
/* ================================================
   INSPIRE PAGE — 旅行灵感 (Travel Magazine Style)
   ================================================ */
.inspire-page {
  --page-padding: 32px;
  height: 100%;
  overflow-y: auto;
  position: relative;
}

/* ─── Header ───────────────────────────────────── */
.inspire-header {
  position: relative;
  padding: 52px var(--page-padding) 44px;
  background: linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%);
  overflow: hidden;
}
.header-bg {
  position: absolute; inset: 0;
  background:
    radial-gradient(ellipse at 10% 90%, rgba(14,165,233,0.12) 0%, transparent 50%),
    radial-gradient(ellipse at 90% 10%, rgba(245,158,11,0.08) 0%, transparent 50%),
    radial-gradient(circle at 50% 50%, rgba(255,255,255,0.02) 0%, transparent 70%);
  pointer-events: none;
}
.header-content { position: relative; z-index: 1; }
.header-badge {
  display: inline-flex;
  padding: 4px 14px;
  border-radius: 20px;
  background: rgba(255,255,255,0.08);
  color: rgba(255,255,255,0.8);
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 14px;
  backdrop-filter: blur(4px);
}
.header-title {
  font-size: clamp(32px, 5vw, 48px);
  font-weight: 800;
  letter-spacing: -0.03em;
  color: #fff;
  margin: 0 0 8px;
  text-wrap: balance;
}
.header-sub {
  font-size: 16px;
  color: rgba(255,255,255,0.6);
  margin: 0;
  line-height: 1.6;
}

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
.section-link {
  font-size: 13px;
  color: #0EA5E9;
  font-weight: 600;
  cursor: pointer;
  transition: gap 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.section-link:hover { gap: 8px; }

/* ─── Categories ───────────────────────────────── */
.inspire-categories { padding: 28px var(--page-padding); }
.categories-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}
.cat-card {
  border-radius: 20px;
  padding: 28px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  overflow: hidden;
}
.cat-card::before {
  content: '';
  position: absolute; inset: 0;
  background: rgba(255,255,255,0.15);
  opacity: 0;
  transition: opacity 0.3s;
}
.cat-card:hover {
  transform: translateY(-6px) scale(1.02);
  box-shadow: 0 16px 40px rgba(0,0,0,0.12);
}
.cat-card:hover::before { opacity: 1; }
.cat-emoji { font-size: 44px; display: block; margin-bottom: 12px; }
.cat-title { font-size: 17px; font-weight: 700; color: #0F172A; margin: 0 0 4px; }
.cat-count { font-size: 13px; color: #475569; margin: 0; font-weight: 500; }

/* ─── Trending ─────────────────────────────────── */
.trending-section { padding: 0 var(--page-padding) 32px; }
.trending-grid {
  display: grid;
  grid-template-columns: 1.6fr 1fr;
  gap: 20px;
}

.trending-hero {
  border-radius: 20px;
  overflow: hidden;
  background: #fff;
  border: 1px solid #F1F5F9;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.trending-hero:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 40px rgba(0,0,0,0.1);
}
.trending-hero-visual {
  position: relative;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.trending-hero-icon { font-size: 64px; position: relative; z-index: 1; filter: drop-shadow(0 4px 12px rgba(0,0,0,0.3)); }
.trending-hero-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.3) 100%);
}
.trending-hero-body { padding: 20px 24px 24px; }
.trending-hero-meta {
  display: flex;
  gap: 16px;
  margin-bottom: 10px;
}
.th-meta { font-size: 12px; color: #94A3B8; font-weight: 500; }
.trending-hero-title {
  font-size: 22px;
  font-weight: 700;
  color: #0F172A;
  margin: 0 0 8px;
  letter-spacing: -0.01em;
}
.trending-hero-desc {
  font-size: 14px;
  color: #64748B;
  line-height: 1.6;
  margin: 0 0 16px;
}
.trending-hero-author {
  display: flex;
  align-items: center;
  gap: 10px;
}
.trending-hero-author .author-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 700;
  font-size: 14px;
}
.author-name { display: block; font-size: 13px; font-weight: 600; color: #0F172A; }
.author-date { font-size: 12px; color: #94A3B8; }

.trending-sidebar {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.trending-side-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 18px;
  border-radius: 16px;
  background: #fff;
  border: 1px solid #F1F5F9;
  cursor: pointer;
  transition: all 0.25s;
}
.trending-side-card:hover {
  transform: translateX(4px);
  border-color: #0EA5E9;
  box-shadow: 0 4px 12px rgba(14,165,233,0.1);
}
.trending-number {
  font-size: 20px;
  font-weight: 800;
  color: #CBD5E1;
  width: 32px;
  flex-shrink: 0;
  font-feature-settings: 'tnum';
}
.trending-side-card:first-child .trending-number { color: #0EA5E9; }
.trending-side-card:nth-child(2) .trending-number { color: #38BDF8; }
.trending-side-card:nth-child(3) .trending-number { color: #7DD3FC; }
.trending-side-body { flex: 1; min-width: 0; }
.trending-side-body h4 {
  font-size: 14px;
  font-weight: 600;
  color: #0F172A;
  margin: 0 0 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.trending-side-meta {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #94A3B8;
}

/* ─── Collections ──────────────────────────────── */
.collections-section { padding: 32px var(--page-padding); }
.collections-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
.collection-card {
  border-radius: 18px;
  padding: 28px 24px;
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.collection-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0,0,0,0.1);
}
.collection-icon { font-size: 36px; display: block; margin-bottom: 12px; }
.collection-title { font-size: 17px; font-weight: 700; color: #0F172A; margin: 0 0 4px; }
.collection-desc { font-size: 13px; color: #475569; margin: 0; line-height: 1.5; }

/* ─── Articles (Masonry) ───────────────────────── */
.articles-section { padding: 0 var(--page-padding) 32px; }
.masonry-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
  align-items: start;
}
.article-card {
  border-radius: 18px;
  overflow: hidden;
  background: #fff;
  border: 1px solid #F1F5F9;
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.article-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0,0,0,0.1);
}
.trending-hero-visual { overflow: hidden; }
.trending-hero-visual > *,
.article-visual > * { position: relative; z-index: 1; }
.collection-card { overflow: hidden; position: relative; }
.collection-card > * { position: relative; z-index: 1; }

.article-card:hover .article-visual,
.trending-hero:hover .trending-hero-visual { background-size: 110%, auto !important; }
.article-card--tall .article-visual { height: 220px; }
.article-card--wide .article-visual { height: 140px; }
.article-card--reg .article-visual  { height: 160px; }

.article-visual {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: height 0.3s;
}
.article-card:hover .article-visual { height: 120px !important; }
.article-emoji { font-size: 48px; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.1)); }
.article-body { padding: 14px 16px 16px; }
.article-tags {
  display: flex;
  gap: 5px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}
.article-tag {
  padding: 2px 8px;
  border-radius: 20px;
  background: #F1F5F9;
  color: #64748B;
  font-size: 10px;
  font-weight: 600;
}
.article-title {
  font-size: 15px;
  font-weight: 700;
  color: #0F172A;
  margin: 0 0 4px;
  line-height: 1.4;
}
.article-desc {
  font-size: 13px;
  color: #64748B;
  line-height: 1.5;
  margin: 0 0 10px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.article-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  color: #94A3B8;
}

/* ─── Reviews ──────────────────────────────────── */
.reviews-section {
  padding: 32px var(--page-padding);
  background: #F8FAFC;
  border-top: 1px solid #F1F5F9;
  border-bottom: 1px solid #F1F5F9;
}
.reviews-carousel {
  overflow: hidden;
  position: relative;
  width: 100%;
}
.reviews-track {
  display: flex;
  width: 100%;
  transition: transform 0.5s ease-out;
}
.review-card {
  min-width: 100%;
  width: 100%;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 24px;
  text-align: center;
  box-sizing: border-box;
}
.review-stars {
  color: #F59E0B;
  font-size: 22px;
  letter-spacing: 6px;
  margin-bottom: 12px;
}
.review-text {
  font-size: 16px;
  color: #1E293B;
  line-height: 1.7;
  margin: 0 auto 20px;
  max-width: 560px;
  font-style: italic;
}
.review-author {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}
.review-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 700;
  font-size: 16px;
}
.review-name { display: block; font-size: 14px; font-weight: 600; color: #0F172A; }
.review-dest { font-size: 12px; color: #94A3B8; }

.reviews-dots {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 16px;
}
.review-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: none;
  background: #CBD5E1;
  cursor: pointer;
  transition: all 0.3s;
  padding: 0;
}
.review-dot.active {
  width: 24px;
  border-radius: 4px;
  background: linear-gradient(90deg, #0EA5E9, #38BDF8);
}

/* ─── AI Recommend ─────────────────────────────── */
.ai-recommend {
  position: relative;
  margin: 32px var(--page-padding) 48px;
  border-radius: 24px;
  overflow: hidden;
  background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
  padding: 48px 40px;
  text-align: center;
}
.ai-recommend-bg {
  position: absolute; inset: 0;
  background:
    radial-gradient(ellipse at 20% 80%, rgba(14,165,233,0.1) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(245,158,11,0.08) 0%, transparent 50%);
  pointer-events: none;
}
.ai-recommend-content { position: relative; z-index: 1; max-width: 600px; margin: 0 auto; }
.ai-badge {
  display: inline-block;
  padding: 4px 14px;
  border-radius: 20px;
  background: rgba(255,255,255,0.08);
  color: rgba(255,255,255,0.8);
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 16px;
}
.ai-recommend-content h2 {
  font-size: 26px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 8px;
}
.ai-recommend-content p {
  font-size: 14px;
  color: rgba(255,255,255,0.6);
  margin: 0 0 24px;
}
.ai-prefs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  margin-bottom: 24px;
}
.ai-pref-btn {
  padding: 8px 18px;
  border-radius: 100px;
  border: 1px solid rgba(255,255,255,0.15);
  background: rgba(255,255,255,0.05);
  color: rgba(255,255,255,0.7);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}
.ai-pref-btn:hover { border-color: rgba(255,255,255,0.3); color: #fff; }
.ai-pref-btn.selected {
  border-color: transparent;
  background: linear-gradient(135deg, #0EA5E9, #38BDF8);
  color: #fff;
}
.ai-cta {
  padding: 12px 32px;
  border-radius: 14px;
  border: none;
  background: linear-gradient(135deg, #0EA5E9, #38BDF8);
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}
.ai-cta:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(14,165,233,0.3);
}
.ai-cta:disabled { opacity: 0.4; cursor: not-allowed; }

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
.skeleton-header {
  height: 180px;
  margin: 0 var(--page-padding);
  border-radius: 20px;
  background: linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 50%, #F1F5F9 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
.skeleton-cats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  padding: 28px var(--page-padding);
}
.skeleton-cat-card {
  height: 140px;
  border-radius: 20px;
  background: linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 50%, #F1F5F9 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
.skeleton-feat {
  height: 280px;
  margin: 0 var(--page-padding);
  border-radius: 20px;
  background: linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 50%, #F1F5F9 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
.skeleton-articles {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
  padding: 32px var(--page-padding);
}
.skeleton-art {
  height: 280px;
  border-radius: 18px;
  background: linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 50%, #F1F5F9 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  from { background-position: 200% 0; }
  to { background-position: -200% 0; }
}

/* ─── Responsive ───────────────────────────────── */
@media (max-width: 1024px) {
  .categories-grid { grid-template-columns: repeat(2, 1fr); }
  .trending-grid { grid-template-columns: 1fr; }
  .masonry-grid { grid-template-columns: repeat(2, 1fr); }
  .collections-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 768px) {
  .inspire-page { --page-padding: 16px; }
  .inspire-header { padding: 36px var(--page-padding) 32px; }
  .categories-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
  .cat-card { padding: 20px 14px; }
  .cat-emoji { font-size: 32px; }
  .trending-grid { grid-template-columns: 1fr; }
  .trending-hero-visual { height: 160px; }
  .masonry-grid { grid-template-columns: 1fr; }
  .collections-grid { grid-template-columns: 1fr; }
  .ai-recommend { padding: 32px 24px; margin: 24px var(--page-padding) 36px; }
  .ai-prefs { gap: 6px; }
  .ai-pref-btn { padding: 6px 14px; font-size: 12px; }
}
</style>
