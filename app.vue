<template>
  <UApp>
    <NuxtPage />
  </UApp>
</template>

<script setup lang="ts">
// SEO 优化配置
useSeoMeta({
  // 基本SEO
  title: '临时邮箱 - 快速安全的一次性电子邮箱服务',
  description: '免费、安全、即时可用的临时邮箱服务，保护您的隐私免受垃圾邮件骚扰，无需注册即可使用',
  
  // 关键词
  keywords: '临时邮箱,一次性邮箱,匿名邮箱,隐私保护,垃圾邮件过滤,临时电子邮件',
  
  // Open Graph标签
  ogTitle: '临时邮箱 - 保护您的在线隐私',
  ogDescription: '获取免费临时邮箱地址，即时收发邮件，保护个人信息安全，远离垃圾邮件骚扰',
  ogImage: '/email-logo.png',
  ogUrl: 'https://your-domain.com',
  ogType: 'website',
  ogSiteName: '临时邮箱服务',
  
  // Twitter 卡片
  twitterTitle: '临时邮箱 - 保护您的在线隐私',
  twitterDescription: '获取免费临时邮箱地址，即时收发邮件，保护个人信息安全，远离垃圾邮件骚扰',
  twitterCard: 'summary_large_image',
  twitterImage: '/email-logo.png',
})

// 设置网站语言和额外的头部信息
useHead({
  htmlAttrs: {
    lang: 'zh-CN',
  },
  link: [
    { rel: 'canonical', href: 'https://your-domain.com' }
  ],
  meta: [
    { name: 'author', content: 'x-thence' },
    { name: 'theme-color', content: '#4f46e5' }, // 使用网站主题色
    { name: 'robots', content: 'index, follow' }
  ]
})
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
}
</style>
