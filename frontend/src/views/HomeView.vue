<template>
  <div class="home">
    <div class="video-wrapper">
      <video class="bg-video" src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260329_050842_be71947f-f16e-4a14-810c-06e83d23ddb5.mp4" muted loop playsinline preload="auto" autoplay></video>
      <div class="video-overlay"></div>
    </div>

    <nav class="navbar">
      <div class="nav-inner">
        <div class="nav-left">
          <span class="logo" style="cursor:pointer;" @click="goTo('/')">游伴AI</span>
          <div class="nav-menu">
            <a class="nav-link" @click="goTo('/app/chat')">AI 规划</a>
            <a class="nav-link" @click="goTo('/app/explore')">发现目的地</a>
            <a class="nav-link" @click="goTo('/app/plans')">我的行程</a>
            <a class="nav-link" @click="goTo('/app/inspiration')">旅行灵感</a>
          </div>
        </div>
        <div class="nav-right">
          <router-link to="/login" class="btn-signup">注册</router-link>
          <router-link to="/login" class="btn-login">登录</router-link>
        </div>
      </div>
    </nav>

    <section class="hero">
      <div class="hero-content">
        <div class="badge-row">
          <span class="badge-new"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>全新上线</span>
          <span class="badge-text">AI 旅行规划</span>
        </div>
        <h1 class="headline">探索世界<br/>从这开始</h1>
        <p class="subtitle">让 AI 为你定制专属旅行计划，发现目的地的无限精彩</p>

        <div class="search-box">
          <div class="search-top">
            <div class="credits-info"><span class="credits-count">免费体验</span><span class="upgrade-btn" @click="goTo('/login')">升级</span></div>
            <div class="ai-info">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" opacity="0.8"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
              <span>由 DeepSeek 驱动</span>
            </div>
          </div>

          <div class="search-input-area">
            <input class="search-input" type="text" placeholder="搜索目的地或输入旅行需求..." v-model="searchText" @keydown.enter="handleSearch" />
            <button class="search-btn" @click="handleSearch"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg></button>
          </div>

          <div class="search-bottom">
            <div class="action-buttons">
              <button class="action-btn" @click="goTo('/app/chat')">智能规划</button>
              <button class="action-btn" @click="goTo('/app/explore')">发现目的地</button>
              <button class="action-btn" @click="goTo('/app/plans')">我的行程</button>
            </div>
            <span class="char-count">0/3,000</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const searchText = ref('')
function goTo(path) {
  const token = localStorage.getItem('token')
  if (path.startsWith('/app/') && !token) { router.push('/login') }
  else { router.push(path) }
}
function handleSearch() {
  const token = localStorage.getItem('token')
  const q = searchText.value.trim()
  if (token) {
    router.push({ path: '/app/chat', query: { q } })
  } else {
    router.push({ path: '/login', query: { q } })
  }
}
</script>

<style scoped>
.home { position:relative; width:100%; min-height:100vh; overflow:hidden; font-family:'Schibsted Grotesk','Inter','Noto Sans','PingFang SC','Microsoft YaHei',sans-serif; background:#000; }
.video-wrapper { position:fixed; top:0; left:0; width:100%; height:100%; overflow:hidden; z-index:0; }
.bg-video { position:absolute; top:0; left:50%; transform:translateX(-50%); width:115%; height:115%; object-fit:cover; object-position:center top; }
.video-overlay { position:absolute; inset:0; background:rgba(0,0,0,0.24); z-index:1; }
.navbar { position:fixed; top:0; left:0; right:0; z-index:100; padding:16px 120px; }
.nav-inner { display:flex; align-items:center; justify-content:space-between; max-width:1440px; margin:0 auto; }
.nav-left { display:flex; align-items:center; gap:48px; }
.logo { font-family:'Schibsted Grotesk',sans-serif; font-weight:600; font-size:24px; letter-spacing:-1.44px; color:#fff; }
.nav-menu { display:flex; align-items:center; gap:32px; }
.nav-link { font-family:'Schibsted Grotesk',sans-serif; font-weight:500; font-size:16px; letter-spacing:-0.2px; color:rgba(255,255,255,0.85); text-decoration:none; cursor:pointer; }
.nav-link:hover { color:#fff; }
.nav-right { display:flex; align-items:center; gap:0; }
.btn-signup { font-family:'Schibsted Grotesk',sans-serif; font-weight:500; font-size:16px; letter-spacing:-0.2px; color:rgba(255,255,255,0.85); text-decoration:none; padding:8px 0; width:82px; text-align:center; }
.btn-login { font-family:'Schibsted Grotesk',sans-serif; font-weight:500; font-size:16px; letter-spacing:-0.2px; color:#fff; text-decoration:none; background:#000; padding:8px 0; width:101px; text-align:center; border-radius:6px; }
.hero { position:relative; z-index:10; display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:100vh; padding:120px; margin-top:-50px; }
.hero-content { display:flex; flex-direction:column; align-items:center; text-align:center; max-width:900px; width:100%; }
.badge-row { display:flex; align-items:center; gap:8px; margin-bottom:34px; }
.badge-new { display:inline-flex; align-items:center; gap:4px; background:#0e1311; color:#fff; font-family:'Inter',sans-serif; font-weight:400; font-size:14px; padding:4px 12px; border-radius:20px; }
.badge-text { font-family:'Inter',sans-serif; font-weight:400; font-size:14px; color:#505050; background:#f8f8f8; padding:4px 12px; border-radius:20px; }
.headline { font-family:'Fustat',sans-serif; font-weight:700; font-size:80px; letter-spacing:-4.8px; color:#fff; margin:0 0 34px 0; line-height:1.1; }
.subtitle { font-family:'Fustat',sans-serif; font-weight:500; font-size:20px; letter-spacing:-0.4px; color:rgba(255,255,255,0.7); max-width:736px; width:542px; margin:0 0 44px 0; line-height:1.5; }
.search-box { width:100%; max-width:728px; background:rgba(0,0,0,0.24); backdrop-filter:blur(20px); border-radius:18px; padding:20px; display:flex; flex-direction:column; gap:12px; }
.search-top { display:flex; align-items:center; justify-content:space-between; }
.credits-info { display:flex; align-items:center; gap:8px; font-family:'Schibsted Grotesk',sans-serif; font-weight:500; font-size:12px; color:#fff; }
.upgrade-btn { background:rgba(90,225,76,0.89); color:#000; padding:2px 10px; border-radius:10px; font-weight:600; font-size:11px; cursor:pointer; }
.ai-info { display:flex; align-items:center; gap:6px; font-family:'Schibsted Grotesk',sans-serif; font-weight:500; font-size:12px; color:rgba(255,255,255,0.8); }
.search-input-area { display:flex; align-items:center; gap:8px; background:#fff; border-radius:12px; padding:4px; box-shadow:0 4px 12px rgba(0,0,0,0.1); }
.search-input { flex:1; border:none; outline:none; padding:10px 16px; font-size:16px; font-family:'Inter','Noto Sans',sans-serif; color:#000; background:transparent; }
.search-input::placeholder { color:rgba(0,0,0,0.6); }
.search-btn { width:36px; height:36px; border-radius:50%; background:#000; border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; color:#fff; flex-shrink:0; }
.search-bottom { display:flex; align-items:center; justify-content:space-between; }
.action-buttons { display:flex; align-items:center; gap:8px; }
.action-btn { display:inline-flex; align-items:center; gap:4px; background:rgba(255,255,255,0.1); color:rgba(255,255,255,0.8); border:none; padding:4px 10px; border-radius:6px; font-family:'Schibsted Grotesk',sans-serif; font-weight:500; font-size:12px; cursor:pointer; }
.action-btn:hover { background:rgba(255,255,255,0.2); color:#fff; }
.char-count { font-family:'Schibsted Grotesk',sans-serif; font-weight:500; font-size:12px; color:rgba(255,255,255,0.5); }
@media (max-width:768px) { .navbar { padding:16px 20px; } .nav-menu { display:none; } .hero { padding:20px; } .headline { font-size:40px; letter-spacing:-2px; } .subtitle { width:100%; font-size:16px; } .search-box { padding:14px; } }
</style>
