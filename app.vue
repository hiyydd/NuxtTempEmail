<template>
  <UApp 
    :ui="{ 
      colorMode: { 
        preference: 'system', 
        fallback: 'light',
        cookie: {
          maxAge: 60 * 60 * 24 * 7 // 保存7天
        }
      } 
    }"
  >
    <NuxtPage />
  </UApp>
</template>

<script setup lang="ts">
import Clarity from '@microsoft/clarity';

// 获取网站配置
const config = useRuntimeConfig()
const siteUrl = 'https://temp-email.top'

// SEO 优化配置 - 非响应式部分放在server block中优化性能
if (import.meta.server) {
  useSeoMeta({
    // 基本SEO
    title: '临时邮箱 - 快速安全的一次性电子邮箱服务',
    description: '免费、安全、即时可用的临时邮箱服务，保护您的隐私免受垃圾邮件骚扰，无需注册即可使用',
    
    // 关键词
    keywords: '临时邮箱,一次性邮箱,匿名邮箱,隐私保护,垃圾邮件过滤,临时电子邮件,免费邮箱服务,验证码接收,注册验证',
    
    // 增强robots指令，确保搜索引擎可以抓取
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    
    // Open Graph标签
    ogTitle: '临时邮箱 - 保护您的在线隐私',
    ogDescription: '获取免费临时邮箱地址，即时收发邮件，保护个人信息安全，远离垃圾邮件骚扰',
    ogImage: `${siteUrl}/email-logo.png`,
    ogUrl: siteUrl,
    ogType: 'website',
    ogSiteName: '临时邮箱服务',
    
    // Twitter 卡片
    twitterTitle: '临时邮箱 - 保护您的在线隐私',
    twitterDescription: '获取免费临时邮箱地址，即时收发邮件，保护个人信息安全，远离垃圾邮件骚扰',
    twitterCard: 'summary_large_image',
    twitterImage: `/email-logo.png`,
  })
}

// 设置动态标题模板
useHead({
  // 使用函数形式的titleTemplate，更加灵活
  titleTemplate: (pageTitle) => {
    return pageTitle ? `${pageTitle} - 临时邮箱服务` : '临时邮箱 - 快速安全的一次性电子邮箱服务';
  },
  htmlAttrs: {
    lang: 'zh-CN',
    dir: 'ltr'
  },
  link: [
    { rel: 'canonical', href: siteUrl },
    { rel: 'icon', type: 'image/png', href: '/email-logo.png' },
    { rel: 'apple-touch-icon', href: '/email-logo.png' }
  ],
  meta: [
    { name: 'author', content: 'x-thence' },
    { name: 'theme-color', content: '#4f46e5' }, // 使用网站主题色
    // 确保搜索引擎可以抓取
    { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' },
    { name: 'format-detection', content: 'telephone=no' },
    { name: 'apple-mobile-web-app-capable', content: 'yes' },
    { property: 'og:locale', content: 'zh_CN' }
  ]
})

onMounted(() => {
  const projectId = "r7gss20yxc"
  Clarity.init(projectId);
})

</script>

<style>
html, body {
  margin: 0;
  padding: 0;
}

/* 增加颜色过渡效果 */
:root {
  --ui-background: var(--color-white);
  --ui-text: var(--color-gray-900);
}

.dark {
  --ui-background: var(--color-gray-900);
  --ui-text: var(--color-white);
}

body {
  color: var(--ui-text);
  background-color: var(--ui-background);
  transition: color 0.3s ease, background-color 0.3s ease;
}
</style>
