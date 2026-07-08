import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: ['trave123-web.cpolar.cn'],
    proxy: {
      '/api': {
        target: 'https://trave123.cpolar.cn',
        changeOrigin: true
      },
      '/proxy-img': {
        target: 'https://',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/proxy-img\//, '')
      }
    }
  }
})