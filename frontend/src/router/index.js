import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import AppLayout from '../components/AppLayout.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomeView.vue'),
    meta: { guest: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue'),
    meta: { guest: true }
  },
  {
    path: '/app',
    component: AppLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'chat',
        name: 'Chat',
        component: () => import('../views/ChatView.vue')
      },
      {
        path: 'explore',
        name: 'Explore',
        component: () => import('../views/ExploreView.vue')
      },
      {
        path: 'inspiration',
        name: 'Inspiration',
        component: () => import('../views/InspirationView.vue')
      },
      {
        path: 'plans',
        name: 'Plans',
        component: () => import('../views/PlansView.vue')
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('../views/ProfileView.vue')
      },
      {
        path: 'destination/:name',
        name: 'DestinationDetail',
        component: () => import('../views/DestinationDetailView.vue')
      },
      {
        path: 'article/:slug',
        name: 'ArticleDetail',
        component: () => import('../views/ArticleDetailView.vue')
      },
      {
        path: 'collection/:slug',
        name: 'CollectionDetail',
        component: () => import('../views/CollectionDetailView.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    next('/login')
  } else if (to.meta.guest && auth.isLoggedIn && to.name === 'Home') {
    next('/app/chat')
  } else if (to.meta.guest && auth.isLoggedIn && to.name === 'Login') {
    next('/app/chat')
  } else {
    next()
  }
})

export default router
