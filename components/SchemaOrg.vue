<template>
  <!-- 这个组件不需要渲染任何内容，仅用于添加结构化数据 -->
</template>

<script setup lang="ts">
// 使用useHead来添加JSON-LD结构化数据
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "临时邮箱服务",
        "url": "https://your-domain.com",
        "description": "免费、安全、即时可用的临时邮箱服务，保护您的隐私免受垃圾邮件骚扰，无需注册即可使用",
        "applicationCategory": "WebApplication",
        "operatingSystem": "All",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "CNY"
        },
        "screenshot": "https://your-domain.com/email-logo.png",
        "featureList": "即时可用,隐私保护,简洁易用,安全可靠,完全免费,自动检查",
        "potentialAction": {
          "@type": "UseAction",
          "target": "https://your-domain.com"
        }
      })
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "临时邮箱安全吗？",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "是的，我们的临时邮箱服务非常安全。我们不会存储您的个人信息，所有邮件内容都经过安全处理，移除潜在的恶意代码。但请注意，临时邮箱不适合接收敏感或重要信息，因为任何人如果知道邮箱地址都可以查看邮件内容。"
            }
          },
          {
            "@type": "Question",
            "name": "邮件可以保存多久？",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "临时邮箱中的邮件一般保存24小时，到期后会自动删除。如果您需要保存重要信息，请在过期前手动复制或保存邮件内容。"
            }
          },
          {
            "@type": "Question",
            "name": "可以发送邮件吗？",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "目前我们的服务仅支持接收邮件，不支持发送邮件功能。临时邮箱主要用于接收验证码、注册确认等一次性邮件。"
            }
          },
          {
            "@type": "Question",
            "name": "邮件接收需要多长时间？",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "大多数邮件会在几秒到几分钟内收到。如果您在等待重要邮件，建议使用'检查新邮件'按钮或启用自动检查功能，系统会每5秒自动检查一次新邮件。"
            }
          }
        ]
      })
    }
  ]
})
</script> 