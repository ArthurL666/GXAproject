<template>
  <div class="article-page">
    <!-- Loading -->
    <div v-if="loading" class="article-loading">
      <div class="skeleton-hero" />
      <div class="skeleton-body"><div v-for="i in 4" :key="i" class="skeleton-para" /></div>
    </div>

    <!-- Not Found -->
    <div v-else-if="!article" class="article-notfound">
      <div class="nf-content">
        <span class="nf-icon">📝</span>
        <h2>未找到文章</h2>
        <p>似乎这篇文章不存在或已被删除</p>
        <button class="nf-btn" @click="$router.push('/app/inspiration')">← 回到灵感</button>
      </div>
    </div>

    <!-- Main -->
    <div v-else class="article-main">
      <!-- Hero -->
      <header class="article-hero" ref="heroRef">
        <div class="ah-bg" :style="{ backgroundImage: `url(${article.image})` }" />
        <div class="ah-overlay" :style="{ background: `linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.85) 100%)` }" />
        <div class="ah-content">
          <div class="ah-breadcrumb" @click="$router.push('/app/inspiration')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            <span>旅行灵感</span>
          </div>
          <span class="ah-emoji">{{ article.icon }}</span>
          <h1 class="ah-title">{{ article.title }}</h1>
          <p class="ah-subtitle">{{ article.subtitle || article.summary }}</p>
          <div class="ah-meta">
            <div class="ah-author">
              <div class="ah-avatar" :style="{ background: article.authorColor }">{{ article.author[0] }}</div>
              <div>
                <span class="ah-author-name">{{ article.author }}</span>
                <span class="ah-date">{{ article.date }}</span>
              </div>
            </div>
            <div class="ah-stats">
              <span>👁️ {{ article.views }} 阅读</span>
              <span>❤️ {{ article.likes }} 点赞</span>
              <span>⏱ {{ article.readTime }} 分钟</span>
            </div>
          </div>
        </div>
      </header>

      <!-- Content -->
      <article class="article-body">
        <div class="ab-inner">
          <div class="ab-tags">
            <span v-for="t in article.tags" :key="t" class="ab-tag">{{ t }}</span>
          </div>

          <div
            v-for="(block, i) in article.content"
            :key="i"
            class="ab-block"
            :class="`ab-${block.type}`"
          >
            <h3 v-if="block.type === 'heading'" class="ab-heading">{{ block.value }}</h3>
            <p v-if="block.type === 'text'" class="ab-text">{{ block.value }}</p>
            <figure v-if="block.type === 'image'" class="ab-figure">
              <img :src="block.value" :alt="block.caption || ''" loading="lazy" />
              <figcaption v-if="block.caption">{{ block.caption }}</figcaption>
            </figure>
          </div>

          <!-- Tips -->
          <div v-if="article.tips" class="ab-tips">
            <span class="tips-icon">💡</span>
            <div>
              <strong>实用提示</strong>
              <p>{{ article.tips }}</p>
            </div>
          </div>
        </div>
      </article>

      <!-- Related -->
      <section class="article-related">
        <div class="ab-inner">
          <h2 class="related-title">📖 更多灵感文章</h2>
          <div class="related-grid">
            <div
              v-for="ra in relatedArticles"
              :key="ra.slug"
              class="related-card"
              @click="$router.push(`/app/article/${ra.slug}`)"
            >
              <div class="rc-visual" :style="{ background: `url(${ra.image}), ${ra.gradient}`, backgroundSize: 'cover, auto', backgroundPosition: 'center, 0 0' }">
                <span class="rc-emoji">{{ ra.icon }}</span>
              </div>
              <div class="rc-body">
                <h4>{{ ra.title }}</h4>
                <p>{{ ra.summary.slice(0, 40) }}…</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="article-cta">
        <div class="ab-inner cta-inner">
          <span class="cta-icon"><AiIcon :size="48" /></span>
          <h2>想去 {{ article.location }} 旅行？</h2>
          <p>让 AI 为你定制专属行程，轻松规划完美假期</p>
          <button class="cta-btn" @click="goToChat">✨ AI 规划行程</button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getArticle, getRelatedArticles } from '../data/articles'
import AiIcon from '../components/AiIcon.vue'

const router = useRouter()
const route = useRoute()
const loading = ref(true)

const article = computed(() => getArticle(route.params.slug))

const relatedArticles = computed(() => {
  if (!article.value?.slug) return []
  return getRelatedArticles(article.value.slug, 3)
})

function goToChat() {
  if (!article.value) return
  const q = `我想看关于${article.value.location}的旅行灵感`
  router.push({ path: '/app/chat', query: { q } })
}

onMounted(() => {
  setTimeout(() => { loading.value = false }, 400)
})
</script>

<style scoped>
.article-page {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}

/* Loading */
.article-loading {}
.skeleton-hero { height: 50vh; background: linear-gradient(90deg,#F1F5F9 25%,#E2E8F0 50%,#F1F5F9 75%); background-size:200% 100%; animation: shimmer 1.5s infinite; }
.skeleton-body { max-width: 720px; margin: 0 auto; padding: 40px 32px; }
.skeleton-para { height: 20px; margin-bottom: 16px; border-radius: 8px; background: linear-gradient(90deg,#F1F5F9 25%,#E2E8F0 50%,#F1F5F9 75%); background-size:200% 100%; animation: shimmer 1.5s infinite; }
.skeleton-para:nth-child(2) { width: 85%; }
.skeleton-para:nth-child(3) { width: 70%; }
@keyframes shimmer { from { background-position:200% 0; } to { background-position:-200% 0; } }

/* Not Found */
.article-notfound { display: flex; align-items: center; justify-content: center; height: 70vh; text-align: center; }
.nf-icon { font-size: 64px; display: block; margin-bottom: 16px; }
.nf-content h2 { font-size: 24px; font-weight: 700; color: #0F172A; margin-bottom: 8px; }
.nf-content p { color: #94A3B8; margin-bottom: 24px; }
.nf-btn { padding: 12px 28px; border-radius: 12px; border: none; background: linear-gradient(135deg,#0EA5E9,#38BDF8); color: #fff; font-size: 15px; font-weight: 600; cursor: pointer; font-family: inherit; }

/* Hero */
.article-hero {
  position: relative;
  height: 55vh;
  min-height: 420px;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
}
.ah-bg {
  position: absolute; inset: 0;
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
}
.ah-overlay { position: absolute; inset: 0; }
.ah-content {
  position: relative; z-index: 2;
  padding: 48px;
  color: #fff;
  width: 100%;
  animation: fadeUp 0.8s ease-out;
}
@keyframes fadeUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
.ah-breadcrumb {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 13px; color: rgba(255,255,255,0.7);
  cursor: pointer; margin-bottom: 16px;
  transition: color 0.2s;
}
.ah-breadcrumb:hover { color: #fff; }
.ah-emoji { font-size: 48px; display: block; margin-bottom: 12px; }
.ah-title {
  font-size: clamp(28px, 4.5vw, 48px);
  font-weight: 800;
  letter-spacing: -0.02em;
  margin: 0 0 8px;
  text-shadow: 0 2px 16px rgba(0,0,0,0.3);
}
.ah-subtitle {
  font-size: 18px;
  color: rgba(255,255,255,0.85);
  max-width: 550px;
  margin: 0 0 24px;
  line-height: 1.7;
}
.ah-meta {
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
}
.ah-author { display: flex; align-items: center; gap: 10px; }
.ah-avatar { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 700; font-size: 14px; }
.ah-author-name { display: block; font-size: 14px; font-weight: 600; }
.ah-date { font-size: 12px; color: rgba(255,255,255,0.6); }
.ah-stats { display: flex; gap: 16px; font-size: 13px; color: rgba(255,255,255,0.7); }

/* Body */
.article-body {
  background: #fff;
}
.ab-inner {
  max-width: 720px;
  margin: 0 auto;
  padding: 40px 32px;
}
.ab-tags {
  display: flex;
  gap: 6px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}
.ab-tag {
  padding: 4px 12px;
  border-radius: 20px;
  background: #F1F5F9;
  color: #64748B;
  font-size: 12px;
  font-weight: 600;
}
.ab-block { margin-bottom: 24px; }
.ab-heading {
  font-size: 24px;
  font-weight: 700;
  color: #0F172A;
  margin: 40px 0 16px;
  letter-spacing: -0.01em;
}
.ab-text {
  font-size: 18px;
  color: #334155;
  line-height: 2;
  margin: 0;
}
.ab-figure {
  margin: 32px 0;
  border-radius: 16px;
  overflow: hidden;
}
.ab-figure img {
  width: 100%;
  height: auto;
  display: block;
  border-radius: 16px;
}
.ab-figure figcaption {
  text-align: center;
  font-size: 13px;
  color: #94A3B8;
  margin-top: 8px;
  font-style: italic;
}
.ab-tips {
  display: flex;
  gap: 14px;
  padding: 20px 24px;
  background: linear-gradient(135deg, #FFF7ED, #FFFBEB);
  border-radius: 16px;
  margin: 40px 0;
  border: 1px solid #FED7AA;
}
.tips-icon { font-size: 28px; flex-shrink: 0; }
.ab-tips strong { display: block; font-size: 16px; color: #C2410C; margin-bottom: 4px; }
.ab-tips p { font-size: 15px; color: #9A3412; line-height: 1.7; margin: 0; }

/* Related */
.article-related {
  background: #F8FAFC;
  border-top: 1px solid #F1F5F9;
}
.related-title {
  font-size: 20px;
  font-weight: 700;
  color: #0F172A;
  margin: 0 0 24px;
}
.related-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
.related-card {
  background: #fff;
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid #F1F5F9;
  cursor: pointer;
  transition: all 0.3s;
}
.related-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.08); }
.rc-visual { height: 110px; display: flex; align-items: center; justify-content: center; }
.rc-emoji { font-size: 36px; }
.rc-body { padding: 12px 14px 14px; }
.rc-body h4 { font-size: 14px; font-weight: 700; color: #0F172A; margin: 0 0 4px; }
.rc-body p { font-size: 12px; color: #94A3B8; margin: 0; line-height: 1.4; }

/* CTA */
.article-cta {
  background: linear-gradient(135deg, #0F172A, #1E293B);
}
.cta-inner {
  text-align: center;
  padding: 56px 32px;
}
.cta-icon { font-size: 48px; display: block; margin-bottom: 12px; }
.article-cta h2 { font-size: 26px; font-weight: 700; color: #fff; margin: 0 0 8px; }
.article-cta p { font-size: 16px; color: rgba(255,255,255,0.65); margin: 0 0 24px; }
.cta-btn {
  padding: 14px 36px;
  border-radius: 14px;
  border: none;
  background: linear-gradient(135deg, #0EA5E9, #38BDF8);
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}
.cta-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(14,165,233,0.3); }

/* Responsive */
@media (max-width: 768px) {
  .ah-content { padding: 24px; }
  .ah-emoji { font-size: 36px; }
  .ab-inner { padding: 24px 16px; }
  .ah-stats { flex-wrap: wrap; gap: 8px; }
  .related-grid { grid-template-columns: 1fr; }
  .article-hero { height: 45vh; min-height: 340px; background-attachment: scroll; }
}
</style>
