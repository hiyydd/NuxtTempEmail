<template>
  <!-- 这个组件不需要渲染任何内容，仅用于添加结构化数据 -->
</template>

<script setup lang="ts">
// 获取网站URL (实际域名)
const siteUrl = 'https://temp-email.top';
const siteName = '临时邮箱';

// 使用useHead来添加JSON-LD结构化数据
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": siteName,
        "alternateName": "Temp Mail",
        "url": siteUrl,
        "description": "免费、安全、即时可用的临时邮箱服务，保护您的隐私免受垃圾邮件骚扰，无需注册即可使用",
        "applicationCategory": "WebApplication",
        "operatingSystem": "All",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "CNY"
        },
        "screenshot": `${siteUrl}/email-logo.png`,
        "featureList": "即时可用,隐私保护,简洁易用,安全可靠,完全免费,自动检查",
        "potentialAction": {
          "@type": "UseAction",
          "target": siteUrl
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.8",
          "reviewCount": "156"
        },
        "applicationSubCategory": "Email Service",
        "availableOnDevice": "Computer, Tablet, Mobile",
        "releaseNotes": "持续优化用户体验和服务稳定性",
        "softwareVersion": "2.0"
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
          },
          {
            "@type": "Question", 
            "name": "为什么有些网站不接受临时邮箱？",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "一些网站和服务为了防止垃圾注册或滥用，会屏蔽临时邮箱域名。这是正常的安全措施，特别是对于金融、社交媒体等重要平台。对于这些服务，我们建议使用您的真实邮箱进行注册。"
            }
          },
          {
            "@type": "Question",
            "name": "使用临时邮箱有什么限制？",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "我们的临时邮箱服务没有使用次数限制，您可以生成多个邮箱地址。但请注意合理使用，避免滥用服务进行垃圾邮件发送或违法活动。我们保留对滥用行为限制服务的权利。"
            }
          }
        ]
      })
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "首页",
            "item": siteUrl
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "临时邮箱服务",
            "item": `${siteUrl}/temp-mail`
          }
        ]
      })
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": siteName,
        "url": siteUrl,
        "logo": `${siteUrl}/email-logo.png`,
        "description": "提供免费、安全的临时邮箱服务，保护用户隐私，远离垃圾邮件骚扰。",
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "customer service",
          "email": "2668812066@qq.com"
        },
        "sameAs": [
          "https://www.facebook.com/tempemail",
          "https://twitter.com/tempemail"
        ]
      })
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": siteName,
        "operatingSystem": "Windows, macOS, iOS, Android",
        "applicationCategory": "UtilitiesApplication",
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.8",
          "ratingCount": "156"
        },
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "CNY"
        },
        "review": [
          {
            "@type": "Review",
            "author": {
              "@type": "Person",
              "name": "约翰"
            },
            "reviewRating": {
              "@type": "Rating",
              "ratingValue": "5"
            },
            "reviewBody": "Temp Mail 彻底改变了我的在线体验。再也不用担心垃圾邮件了！"
          },
          {
            "@type": "Review",
            "author": {
              "@type": "Person",
              "name": "莎拉"
            },
            "reviewRating": {
              "@type": "Rating",
              "ratingValue": "5"
            },
            "reviewBody": "作为开发者，Temp Mail 让我的测试工作变得更加轻松。强烈推荐！"
          }
        ]
      })
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebSite",
        "url": siteUrl,
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": `${siteUrl}/search?q={search_term_string}`
          },
          "query-input": "required name=search_term_string"
        }
      })
    }
  ]
})
</script> 