<template>
  <div class="collection-page">
    <!-- Loading -->
    <div v-if="loading" class="collection-loading">
      <div class="skeleton-hero" />
      <div class="skeleton-grid"><div v-for="i in 3" :key="i" class="skeleton-card" /></div>
    </div>

    <!-- Not Found -->
    <div v-else-if="!collection" class="collection-notfound">
      <div class="nf-content">
        <span class="nf-icon">📂</span>
        <h2>未找到专题</h2>
        <p>这个专题不存在或已被删除</p>
        <button class="nf-btn" @click="$router.push('/app/inspiration')">← 回到灵感</button>
      </div>
    </div>

    <!-- Main -->
    <div v-else class="collection-main">
      <!-- Hero -->
      <header class="coll-hero" :style="{ background: collection.gradient }">
        <div class="coll-hero-content">
          <span class="coll-icon">{{ collection.icon }}</span>
          <h1 class="coll-title">{{ collection.title }}</h1>
          <p class="coll-desc">{{ collection.desc }}</p>
        </div>
      </header>

      <!-- Description -->
      <section class="coll-intro">
        <div class="coll-intro-inner">
          <div v-for="(block, i) in collection.content" :key="i" class="coll-block">
            <p v-if="block.type === 'text'" class="coll-text">{{ block.value }}</p>
          </div>
        </div>
      </section>

      <!-- Articles Grid -->
      <section class="coll-articles">
        <div class="coll-articles-inner">
          <h2 class="ca-section-title">📖 相关文章</h2>
          <div class="ca-grid">
            <div
              v-for="art in collectionArticles"
              :key="art.slug"
              class="ca-card"
              @click="$router.push(`/app/article/${art.slug}`)"
            >
              <div class="ca-visual" :style="{ background: `url(${art.image}), ${art.gradient}`, backgroundSize: 'cover, auto', backgroundPosition: 'center, 0 0' }">
                <span class="ca-emoji">{{ art.icon }}</span>
              </div>
              <div class="ca-body">
                <h3>{{ art.title }}</h3>
                <p>{{ art.summary.slice(0, 50) }}…</p>
                <div class="ca-footer">
                  <span>⭐ {{ art.rating }}</span>
                  <span>⏱ {{ art.readTime }}分钟</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="coll-cta">
        <div class="coll-cta-inner">
          <span class="cta-icon"><AiIcon :size="48" /></span>
          <h2>还没想好去哪？</h2>
          <p>让 AI 根据你的偏好推荐最合适的旅行灵感</p>
          <button class="cta-btn" @click="$router.push('/app/inspiration')">✨ 回到灵感首页</button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getCollection, getArticle } from '../data/articles'
import AiIcon from '../components/AiIcon.vue'

const route = useRoute()
const loading = ref(true)

const collection = computed(() => getCollection(route.params.slug))

const collectionArticles = computed(() => {
  if (!collection.value?.articles) return []
  return collection.value.articles.map(slug => getArticle(slug)).filter(Boolean)
})

onMounted(() => {
  setTimeout(() => { loading.value = false }, 400)
})
</script>

<style scoped>
.collection-page {
  height: 100%;
  overflow-y: auto;
}

/* Loading */
.collection-loading {}
.skeleton-hero { height: 250px; background: linear-gradient(90deg,#F1F5F9 25%,#E2E8F0 50%,#F1F5F9 75%); background-size:200% 100%; animation: shimmer 1.5s infinite; }
.skeleton-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; padding: 40px 32px; }
.skeleton-card { height: 280px; border-radius: 16px; background: linear-gradient(90deg,#F1F5F9 25%,#E2E8F0 50%,#F1F5F9 75%); background-size:200% 100%; animation: shimmer 1.5s infinite; }
@keyframes shimmer { from { background-position:200% 0; } to { background-position:-200% 0; } }

/* Not Found */
.collection-notfound { display: flex; align-items: center; justify-content: center; height: 70vh; text-align: center; }
.nf-icon { font-size: 64px; display: block; margin-bottom: 16px; }
.nf-content h2 { font-size: 24px; font-weight: 700; color: #0F172A; margin-bottom: 8px; }
.nf-content p { color: #94A3B8; margin-bottom: 24px; }
.nf-btn { padding: 12px 28px; border-radius: 12px; border: none; background: linear-gradient(135deg,#0EA5E9,#38BDF8); color: #fff; font-size: 15px; font-weight: 600; cursor: pointer; font-family: inherit; }

/* Hero */
.coll-hero {
  padding: 64px 32px;
  text-align: center;
}
.coll-hero-content {
  max-width: 560px;
  margin: 0 auto;
}
.coll-icon { font-size: 64px; display: block; margin-bottom: 16px; }
.coll-title {
  font-size: clamp(28px, 4vw, 40px);
  font-weight: 800;
  color: #0F172A;
  letter-spacing: -0.02em;
  margin: 0 0 12px;
}
.coll-desc {
  font-size: 16px;
  color: #475569;
  line-height: 1.6;
  margin: 0;
}

/* Intro */
.coll-intro {
  background: #fff;
  border-bottom: 1px solid #F1F5F9;
}
.coll-intro-inner {
  max-width: 680px;
  margin: 0 auto;
  padding: 32px;
}
.coll-text {
  font-size: 16px;
  color: #475569;
  line-height: 1.8;
  margin: 0 0 16px;
}
.coll-text:last-child { margin-bottom: 0; }

/* Articles */
.coll-articles {
  background: #F8FAFC;
}
.coll-articles-inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 48px 32px;
}
.ca-section-title {
  font-size: 20px;
  font-weight: 700;
  color: #0F172A;
  margin: 0 0 24px;
}
.ca-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}
.ca-card {
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #F1F5F9;
  cursor: pointer;
  transition: all 0.3s;
}
.ca-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.08); }
.ca-visual {
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.ca-emoji { font-size: 48px; }
.ca-body { padding: 16px 18px 18px; }
.ca-body h3 { font-size: 16px; font-weight: 700; color: #0F172A; margin: 0 0 6px; }
.ca-body p { font-size: 13px; color: #64748B; line-height: 1.5; margin: 0 0 12px; }
.ca-footer {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #94A3B8;
}

/* CTA */
.coll-cta {
  background: linear-gradient(135deg, #0F172A, #1E293B);
  text-align: center;
  padding: 56px 32px;
}
.coll-cta-inner { max-width: 500px; margin: 0 auto; }
.cta-icon { font-size: 48px; display: block; margin-bottom: 12px; }
.coll-cta h2 { font-size: 24px; font-weight: 700; color: #fff; margin: 0 0 8px; }
.coll-cta p { font-size: 14px; color: rgba(255,255,255,0.6); margin: 0 0 24px; }
.cta-btn {
  padding: 14px 36px;
  border-radius: 14px;
  border: none;
  background: linear-gradient(135deg, #0EA5E9, #38BDF8);
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s;
}
.cta-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(14,165,233,0.3); }

/* Responsive */
@media (max-width: 768px) {
  .ca-grid { grid-template-columns: 1fr; }
  .coll-hero { padding: 40px 20px; }
  .coll-icon { font-size: 48px; }
  .coll-articles-inner { padding: 32px 16px; }
  .coll-intro-inner { padding: 24px 16px; }
}
</style>
