// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  modules: ['@nuxt/ui'],
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      titleTemplate: '%s - 免费临时邮箱服务',
      htmlAttrs: {
        lang: 'zh-CN'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'theme-color', content: '#4f46e5' }
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/email-logo.png' },
        { rel: 'apple-touch-icon', href: '/email-logo.png' }
      ]
    }
  },
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  // 开启SSR以提高SEO效果
  ssr: true,
  // 路由规则: 对于首页开启预渲染
  nitro: {
    prerender: {
      routes: ['/']
    }
  },
  // 自定义SEO配置
  runtimeConfig: {
    public: {
      siteUrl: 'https://temp-email.top'
    }
  }
})
