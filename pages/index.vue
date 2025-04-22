<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 relative">
    <!-- 结构化数据 -->
    <SchemaOrg />
    
    <!-- 背景动效 Canvas -->
    <!-- <canvas ref="backgroundCanvas" class="absolute inset-0 w-full h-full pointer-events-none z-0"></canvas> -->
    
    <!-- 导航栏 -->
    <nav class="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <div class="flex-shrink-0 flex items-center cursor-pointer" @click="scrollToTop">
              <!-- <img src="/email-logo.png" alt="临时邮箱 Logo" class="h-10 w-auto" /> -->
              <UIcon name="ic:twotone-email" class="h-12 w-12" style="color: #8e67f6" />
              <span class="ml-2 text-xl font-semibold text-gray-800 dark:text-gray-100">{{ $t('appName') }}</span>
            </div>
            <!-- 桌面端导航链接 -->
            <div class="hidden md:ml-8 md:flex md:space-x-8">
              <a href="#features" 
                 @click.prevent="scrollToSection('features')" 
                 class="inline-flex items-center px-1 pt-1 text-lg font-medium text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white cursor-pointer"
                 :aria-label="$t('nav.features')">
                {{ $t('nav.features') }}
              </a>
              <a href="#how-to" 
                 @click.prevent="scrollToSection('how-to')" 
                 class="inline-flex items-center px-1 pt-1 text-lg font-medium text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white cursor-pointer"
                 :aria-label="$t('nav.howto')">
                {{ $t('nav.howto') }}
              </a>
              <a href="#faq" 
                 @click.prevent="scrollToSection('faq')" 
                 class="inline-flex items-center px-1 pt-1 text-lg font-medium text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white cursor-pointer"
                 :aria-label="$t('nav.faq')">
                {{ $t('nav.faq') }}
              </a>
            </div>
          </div>
          
          <!-- 添加主题切换按钮和语言切换按钮 -->
          <div class="flex items-center">
            <LanguageSwitcher class="mr-2" />
            <ThemeSwitcher class="mr-4" />
            
            <!-- 移动导航按钮 -->
            <div class="md:hidden">
              <button @click="isMobileMenuOpen = !isMobileMenuOpen" class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700">
                <UIcon v-if="!isMobileMenuOpen" name="solar:hamburger-menu-bold" class="h-6 w-6" />
                <UIcon v-else name="solar:close-circle-bold" class="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 移动菜单 -->
      <div v-show="isMobileMenuOpen" class="md:hidden bg-white dark:bg-gray-800">
        <div class="pt-2 pb-3 space-y-1">
          <a href="#features" 
             @click.prevent="scrollToSection('features'); isMobileMenuOpen = false" 
             class="block pl-3 pr-4 py-2 text-lg font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-white cursor-pointer"
             :aria-label="$t('nav.features')">
            {{ $t('nav.features') }}
          </a>
          <a href="#how-to" 
             @click.prevent="scrollToSection('how-to'); isMobileMenuOpen = false" 
             class="block pl-3 pr-4 py-2 text-lg font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-white cursor-pointer"
             :aria-label="$t('nav.howto')">
            {{ $t('nav.howto') }}
          </a>
          <a href="#faq" 
             @click.prevent="scrollToSection('faq'); isMobileMenuOpen = false" 
             class="block pl-3 pr-4 py-2 text-lg font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-white cursor-pointer"
             :aria-label="$t('nav.faq')">
            {{ $t('nav.faq') }}
          </a>
          <!-- 在移动菜单中添加语言切换 -->
          <div class="pl-3 pr-4 py-2">
            <div class="flex items-center">
              <span class="text-lg font-medium text-gray-500 dark:text-gray-300 mr-2">{{ $t('footer.nav.language', '语言') }}</span>
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </div>
    </nav>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <!-- 英雄区域 - Hero Section -->
      <section ref="heroRef" id="hero" class="py-4">
        <header class="text-center mb-4 mt-2">
          <h1 class="text-4xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight leading-tight" id="main-title" v-html="$t('hero.titleHtml')">
          </h1>
          <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto text-center" id="main-description">
            {{ $t('hero.description') }}
          </p>
        </header>
      </section>

      <!-- 应用区域 - App Section -->
      <section ref="appRef" id="app" class="py-2" aria-labelledby="app-heading">
        <h2 id="app-heading" class="sr-only">临时邮箱应用</h2>
        <!-- 应用界面包装器 -->
        <div class="space-y-8">
          <!-- 邮箱地址卡片 -->
          <section class="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 sm:p-8 space-y-5 border border-gray-100 dark:border-gray-700" aria-labelledby="email-address-heading">
            <h2 id="email-address-heading" class="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-100">{{ $t('app.emailCard.title') }}</h2>
            <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div @click="copyEmail" class="flex-1 bg-gray-50 dark:bg-gray-700 px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 font-medium text-gray-900 dark:text-gray-100 truncate flex items-center min-h-[42px] select-all group hover:border-indigo-300 dark:hover:border-indigo-500 transition-colors">
                <span class="truncate" :aria-label="$t('app.emailCard.title')">{{ emailAddress || $t('app.emailCard.placeholder') }}</span>
              </div>
              <button
                @click="copyEmail"
                class="sm:min-h-[42px] w-full sm:w-32 flex items-center justify-center gap-1 px-3 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50"
                :aria-label="$t('actions.copy')"
              >
                <UIcon name="solar:copy-bold" class="size-5" aria-hidden="true" />
                <span class="text-base">{{ $t('actions.copy') }}</span>
              </button>
            </div>
            <div class="flex flex-col sm:flex-row gap-3 pt-1">
              <button
                @click="refreshEmail"
                class="w-full sm:w-auto flex items-center justify-center gap-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                :disabled="isCreatingEmail"
                :class="{'opacity-70 cursor-not-allowed': isCreatingEmail}"
                :aria-label="$t('app.emailCard.buttons.create')"
              >
                <span v-if="!isCreatingEmail" class="flex items-center gap-1">
                  <UIcon name="solar:add-square-bold" class="size-6" aria-hidden="true" />
                  {{ $t('app.emailCard.buttons.create') }}
                </span>
                <span v-else class="flex items-center justify-center gap-1">
                  <span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" aria-hidden="true"></span>
                  {{ $t('app.emailCard.buttons.creating') }}
                </span>
              </button>
              <button
                @click="startAutoCheck"
                class="w-full sm:w-auto flex items-center justify-center gap-1 px-4 py-2.5 border-2 border-indigo-500 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-30"
                :disabled="isChecking"
                :class="{'opacity-70 cursor-not-allowed': isChecking}"
                :aria-label="$t('app.emailCard.buttons.check')"
              >
                <span v-if="!isChecking" class="flex items-center gap-1">
                  <UIcon name="solar:refresh-bold" class="size-6" aria-hidden="true" />
                  {{ $t('app.emailCard.buttons.check') }}
                </span>
                <span v-else class="flex items-center justify-center gap-1">
                  <span class="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" aria-hidden="true"></span>
                  {{ $t('app.emailCard.buttons.checking') }}
                </span>
              </button>
            </div>
          </section>

          <!-- 收件箱区域 -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- 邮件列表 -->
            <section class="lg:col-span-1 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 h-[550px] flex flex-col border border-gray-100 dark:border-gray-700" aria-labelledby="inbox-heading">
              <div class="flex justify-between items-center mb-5">
                <h2 id="inbox-heading" class="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                  <UIcon name="solar:inbox-bold" class="text-indigo-500 dark:text-indigo-400 size-8" aria-hidden="true" />
                  {{ $t('app.inbox.title') }}
                </h2>
                <UButton
                  v-if="emails.length > 0"
                  color="error"
                  variant="soft"
                  icon="solar:trash-bin-minimalistic-bold"
                  size="sm"
                  @click="clearEmails"
                  :aria-label="$t('app.inbox.buttons.clear')"
                >
                  {{ $t('app.inbox.buttons.clear') }}
                </UButton>
              </div>
              <UScrollbar v-if="emails.length > 0" class="flex-1 -mx-2 px-2">
                <ul class="space-y-2">
                  <li
                    v-for="email in emails"
                    :key="email.id"
                    @click="selectEmail(email)"
                    class="p-3 rounded-lg cursor-pointer transition-all duration-200 border"
                    :class="selectedEmail?.id === email.id
                      ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-300 dark:border-indigo-700 ring-1 ring-indigo-500 shadow-sm'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700 border-transparent hover:border-gray-200 dark:hover:border-gray-600'"
                  >
                    <div class="flex justify-between items-start gap-2 mb-1">
                      <span class="font-medium text-gray-900 dark:text-gray-100 truncate flex-1">{{ email.from }}</span>
                      <span class="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">{{ formatDate(email.receivedAt) }}</span>
                    </div>
                    <div class="font-medium text-gray-800 dark:text-gray-200 truncate">{{ email.subject }}</div>
                    <div class="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">{{ email.preview }}</div>
                  </li>
                </ul>
              </UScrollbar>
              <div v-else class="flex-1 flex items-center justify-center">
                <div class="text-center max-w-xs py-6">
                  <div class="flex justify-center mb-4">
                    <UIcon name="solar:inbox-linear" class="text-indigo-300 dark:text-indigo-400 size-16" />
                  </div>
                  <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">{{ $t('app.inbox.empty.title') }}</h3>
                  <p class="text-gray-500 dark:text-gray-400">{{ $t('app.inbox.empty.description') }}</p>
                </div>
              </div>
            </section>

            <!-- 邮件内容 -->
            <section class="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 h-[550px] flex flex-col border border-gray-100 dark:border-gray-700" aria-labelledby="email-content-heading">
              <h2 id="email-content-heading" class="sr-only">{{ $t('app.content.heading') }}</h2>
              <div v-if="selectedEmail" class="h-full flex flex-col">
                <div class="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
                  <h3 class="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2 break-words">{{ selectedEmail.subject }}</h3>
                  <div class="flex flex-wrap justify-between text-sm text-gray-500 dark:text-gray-400 gap-2">
                    <span class="truncate max-w-full sm:max-w-[70%] flex items-center gap-1">
                      <UIcon name="solar:user-circle-bold" class="w-4 h-4" />
                      {{ selectedEmail.from }}
                    </span>
                    <span class="text-gray-400 dark:text-gray-500 flex items-center gap-1">
                      <UIcon name="solar:clock-circle-bold" class="w-4 h-4" />
                      {{ formatDate(selectedEmail.receivedAt) || selectedEmail.time }}
                    </span>
                  </div>
                </div>
                <div class="flex-1 overflow-auto">
                  <div class="prose prose-sm dark:prose-invert max-w-none">
                    <div v-if="isSafeHtml" v-html="sanitizedHtml" class="prose-indigo dark:prose-indigo"></div>
                    <pre v-else class="whitespace-pre-wrap text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">{{ selectedEmail.content }}</pre>
                  </div>
                </div>
              </div>
              <div v-else class="h-full flex items-center justify-center">
                <div class="text-center max-w-xs py-6">
                  <div class="flex justify-center mb-4">
                    <UIcon name="solar:inbox-linear" class="text-indigo-300 dark:text-indigo-400 size-16" />
                  </div>
                  <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">{{ $t('app.content.empty.title') }}</h3>
                  <p class="text-gray-500 dark:text-gray-400">{{ $t('app.content.empty.description') }}</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>

      <!-- 应用场景部分 -->
      <section id="use-cases" class="py-12 border-t border-gray-100 dark:border-gray-700 mt-8" aria-labelledby="use-cases-heading">
        <h2 id="use-cases-heading" class="text-3xl font-bold text-center text-gray-900 dark:text-white mb-4">{{ $t('useCases.title') }}</h2>
        <p class="text-lg text-gray-600 dark:text-gray-300 text-center max-w-3xl mx-auto mb-12">
          {{ $t('useCases.description') }}
        </p>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- 网络购物 -->
          <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100 dark:border-gray-700">
            <div class="w-16 h-16 bg-pink-100 dark:bg-pink-900/30 rounded-full flex items-center justify-center mb-5 mx-auto">
              <UIcon name="solar:cart-large-bold" class="text-indigo-600 dark:text-indigo-400 size-8" />
            </div>
            <h3 class="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-3 text-center">{{ $t('useCases.shopping.title') }}</h3>
            <p class="text-gray-600 dark:text-gray-300">
              {{ $t('useCases.shopping.description') }}
            </p>
          </div>
          
          <!-- 社交媒体注册 -->
          <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100 dark:border-gray-700">
            <div class="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-5 mx-auto">
              <UIcon name="solar:users-group-rounded-bold" class="text-indigo-600 dark:text-indigo-400 size-8" />
            </div>
            <h3 class="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-3 text-center">{{ $t('useCases.social.title') }}</h3>
            <p class="text-gray-600 dark:text-gray-300">
              {{ $t('useCases.social.description') }}
            </p>
          </div>
          
          <!-- 论坛参与 -->
          <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100 dark:border-gray-700">
            <div class="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-5 mx-auto">
              <UIcon name="solar:chat-round-dots-bold" class="text-indigo-600 dark:text-indigo-400 size-8" />
            </div>
            <h3 class="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-3 text-center">{{ $t('useCases.forum.title') }}</h3>
            <p class="text-gray-600 dark:text-gray-300">
              {{ $t('useCases.forum.description') }}
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          <!-- 免费试用服务 -->
          <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100 dark:border-gray-700">
            <div class="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mb-5 mx-auto">
              <UIcon name="i-heroicons-gift" class="text-indigo-600 dark:text-indigo-400 size-8" />
            </div>
            <h3 class="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-3 text-center">{{ $t('useCases.trial.title') }}</h3>
            <p class="text-gray-600 dark:text-gray-300">
              {{ $t('useCases.trial.description') }}
            </p>
          </div>
          
          <!-- 一次性验证 -->
          <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100 dark:border-gray-700">
            <div class="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-5 mx-auto">
              <UIcon name="ic:outline-check-box" class="text-indigo-600 dark:text-indigo-400 size-8" />
            </div>
            <h3 class="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-3 text-center">{{ $t('useCases.verification.title') }}</h3>
            <p class="text-gray-600 dark:text-gray-300">
              {{ $t('useCases.verification.description') }}
            </p>
          </div>
          
          <!-- 软件测试 -->
          <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100 dark:border-gray-700">
            <div class="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mb-5 mx-auto">
              <UIcon name="solar:code-bold" class="text-indigo-600 dark:text-indigo-400 size-8" />
            </div>
            <h3 class="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-3 text-center">{{ $t('useCases.testing.title') }}</h3>
            <p class="text-gray-600 dark:text-gray-300">
              {{ $t('useCases.testing.description') }}
            </p>
          </div>
        </div>
      </section>

      <!-- 功能特点部分 -->
      <section ref="featuresRef" id="features" class="py-12 border-t border-gray-100 dark:border-gray-700 mt-8" aria-labelledby="features-heading">
        <h2 id="features-heading" class="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">{{ $t('features.title') }}</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- 功能卡片1：即时可用 -->
          <article class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100 dark:border-gray-700">
            <div class="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center mb-4">
              <UIcon name="solar:clock-circle-bold" class="text-indigo-600 dark:text-indigo-400 size-6" aria-hidden="true" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">{{ $t('features.instant.title') }}</h3>
            <p class="text-gray-600 dark:text-gray-300">{{ $t('features.instant.description') }}</p>
          </article>
          
          <!-- 功能卡片2：隐私保护 -->
          <article class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100 dark:border-gray-700">
            <div class="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center mb-4">
              <UIcon name="solar:shield-keyhole-bold" class="text-indigo-600 dark:text-indigo-400 size-6" aria-hidden="true" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">{{ $t('features.privacy.title') }}</h3>
            <p class="text-gray-600 dark:text-gray-300">{{ $t('features.privacy.description') }}</p>
          </article>
          
          <!-- 功能卡片3：简洁易用 -->
          <article class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100 dark:border-gray-700">
            <div class="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center mb-4">
              <UIcon name="openmoji:simple" class="text-indigo-600 dark:text-indigo-400 size-6" aria-hidden="true" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">{{ $t('features.simple.title') }}</h3>
            <p class="text-gray-600 dark:text-gray-300">{{ $t('features.simple.description') }}</p>
          </article>
          
          <!-- 功能卡片4：安全可靠 -->
          <article class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100 dark:border-gray-700">
            <div class="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center mb-4">
              <UIcon name="solar:shield-check-bold" class="text-indigo-600 dark:text-indigo-400 size-6" aria-hidden="true" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">{{ $t('features.secure.title') }}</h3>
            <p class="text-gray-600 dark:text-gray-300">{{ $t('features.secure.description') }}</p>
          </article>
          
          <!-- 功能卡片5：完全免费 -->
          <article class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100 dark:border-gray-700">
            <div class="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center mb-4">
              <UIcon name="solar:dollar-bold" class="text-indigo-600 dark:text-indigo-400 size-6" aria-hidden="true" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">{{ $t('features.free.title') }}</h3>
            <p class="text-gray-600 dark:text-gray-300">{{ $t('features.free.description') }}</p>
          </article>
          
          <!-- 功能卡片6：自动检查 -->
          <article class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100 dark:border-gray-700">
            <div class="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center mb-4">
              <UIcon name="solar:refresh-bold" class="text-indigo-600 dark:text-indigo-400 size-6" aria-hidden="true" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">{{ $t('features.auto.title') }}</h3>
            <p class="text-gray-600 dark:text-gray-300">{{ $t('features.auto.description') }}</p>
          </article>
        </div>
      </section>

      <!-- 使用说明部分 -->
      <section ref="howToRef" id="how-to" class="py-12 border-t border-gray-100 dark:border-gray-700 mt-8" aria-labelledby="how-to-heading">
        <h2 id="how-to-heading" class="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">{{ $t('howto.title') }}</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <article class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 relative">
            <div class="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-indigo-600 dark:bg-indigo-500 text-white flex items-center justify-center font-bold text-lg" aria-hidden="true">1</div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3 mt-2">{{ $t('howto.step1.title') }}</h3>
            <p class="text-gray-600 dark:text-gray-300 mb-4">{{ $t('howto.step1.description') }}</p>
          </article>
          
          <article class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 relative">
            <div class="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-indigo-600 dark:bg-indigo-500 text-white flex items-center justify-center font-bold text-lg" aria-hidden="true">2</div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3 mt-2">{{ $t('howto.step2.title') }}</h3>
            <p class="text-gray-600 dark:text-gray-300 mb-4">{{ $t('howto.step2.description') }}</p>
          </article>
          
          <article class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 relative">
            <div class="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-indigo-600 dark:bg-indigo-500 text-white flex items-center justify-center font-bold text-lg" aria-hidden="true">3</div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3 mt-2">{{ $t('howto.step3.title') }}</h3>
            <p class="text-gray-600 dark:text-gray-300 mb-4">{{ $t('howto.step3.description') }}</p>
          </article>
        </div>
      </section>

       <!-- 用户评价部分 -->
       <section id="testimonials" class="py-12 border-t border-gray-100 dark:border-gray-700 mt-8" aria-labelledby="testimonials-heading">
        <h2 id="testimonials-heading" class="text-3xl font-bold text-center text-gray-900 dark:text-white mb-4">
          {{ $t('testimonials.titlePrefix') }}<span class="text-purple-600 dark:text-purple-400">{{ $t('testimonials.titleHighlight') }}</span>
        </h2>
        <p class="text-lg text-gray-600 dark:text-gray-300 text-center max-w-3xl mx-auto mb-12">
          {{ $t('testimonials.description') }}
        </p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <!-- 用户评价1 -->
          <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100 dark:border-gray-700">
            <div class="text-purple-500 dark:text-purple-400 mb-4">
              <UIcon name="heroicons:chat-bubble-left-right" class="size-10" />
            </div>
            <p class="text-gray-700 dark:text-gray-300 text-lg mb-6">
              {{ $t('testimonials.user1.comment') }}
            </p>
            <div class="flex items-center">
              <img src="https://i.pravatar.cc/150?img=32" :alt="$t('testimonials.user1.name') + ' ' + $t('userAvatarAlt')" class="w-12 h-12 rounded-full mr-4" width="48" height="48" loading="lazy">
              <div>
                <h4 class="font-semibold text-gray-900 dark:text-gray-100">{{ $t('testimonials.user1.name') }}</h4>
                <p class="text-gray-500 dark:text-gray-400 text-sm">{{ $t('testimonials.user1.profession') }}</p>
              </div>
            </div>
          </div>
          
          <!-- 用户评价2 -->
          <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100 dark:border-gray-700">
            <div class="text-purple-500 dark:text-purple-400 mb-4">
              <UIcon name="heroicons:chat-bubble-left-right" class="size-10" />
            </div>
            <p class="text-gray-700 dark:text-gray-300 text-lg mb-6">
              {{ $t('testimonials.user2.comment') }}
            </p>
            <div class="flex items-center">
              <img src="https://i.pravatar.cc/150?img=59" :alt="$t('testimonials.user2.name') + ' ' + $t('userAvatarAlt')" class="w-12 h-12 rounded-full mr-4" width="48" height="48" loading="lazy">
              <div>
                <h4 class="font-semibold text-gray-900 dark:text-gray-100">{{ $t('testimonials.user2.name') }}</h4>
                <p class="text-gray-500 dark:text-gray-400 text-sm">{{ $t('testimonials.user2.profession') }}</p>
              </div>
            </div>
          </div>
          
          <!-- 用户评价3 -->
          <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100 dark:border-gray-700">
            <div class="text-purple-500 dark:text-purple-400 mb-4">
              <UIcon name="heroicons:chat-bubble-left-right" class="size-10" />
            </div>
            <p class="text-gray-700 dark:text-gray-300 text-lg mb-6">
              {{ $t('testimonials.user3.comment') }}
            </p>
            <div class="flex items-center">
              <img src="https://i.pravatar.cc/150?img=68" :alt="$t('testimonials.user3.name') + ' ' + $t('userAvatarAlt')" class="w-12 h-12 rounded-full mr-4" width="48" height="48" loading="lazy">
              <div>
                <h4 class="font-semibold text-gray-900 dark:text-gray-100">{{ $t('testimonials.user3.name') }}</h4>
                <p class="text-gray-500 dark:text-gray-400 text-sm">{{ $t('testimonials.user3.profession') }}</p>
              </div>
            </div>
          </div>
          
          <!-- 用户评价4（新增） -->
          <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100 dark:border-gray-700">
            <div class="text-purple-500 dark:text-purple-400 mb-4">
              <UIcon name="heroicons:chat-bubble-left-right" class="size-10" />
            </div>
            <p class="text-gray-700 dark:text-gray-300 text-lg mb-6">
              {{ $t('testimonials.user4.comment') }}
            </p>
            <div class="flex items-center">
              <img src="https://i.pravatar.cc/150?img=47" :alt="$t('testimonials.user4.name') + ' ' + $t('userAvatarAlt')" class="w-12 h-12 rounded-full mr-4" width="48" height="48" loading="lazy">
              <div>
                <h4 class="font-semibold text-gray-900 dark:text-gray-100">{{ $t('testimonials.user4.name') }}</h4>
                <p class="text-gray-500 dark:text-gray-400 text-sm">{{ $t('testimonials.user4.profession') }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 常见问题部分 -->
      <section ref="faqRef" id="faq" class="py-12 border-t border-gray-100 dark:border-gray-700 mt-8" aria-labelledby="faq-heading">
        <h2 id="faq-heading" class="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">{{ $t('faq.title') }}</h2>
        
        <div class="max-w-3xl mx-auto space-y-6" itemscope itemtype="https://schema.org/FAQPage">
          <!-- FAQ 1 -->
          <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700" itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
            <h3 itemprop="name" class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">{{ $t('faq.q1.question') }}</h3>
            <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
              <p itemprop="text" class="text-gray-600 dark:text-gray-300">{{ $t('faq.q1.answer') }}</p>
            </div>
          </div>
          
          <!-- FAQ 2 -->
          <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700" itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
            <h3 itemprop="name" class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">{{ $t('faq.q2.question') }}</h3>
            <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
              <p itemprop="text" class="text-gray-600 dark:text-gray-300">{{ $t('faq.q2.answer') }}</p>
            </div>
          </div>
          
          <!-- FAQ 3 -->
          <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700" itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
            <h3 itemprop="name" class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">{{ $t('faq.q3.question') }}</h3>
            <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
              <p itemprop="text" class="text-gray-600 dark:text-gray-300">{{ $t('faq.q3.answer') }}</p>
            </div>
          </div>
          
          <!-- FAQ 4 -->
          <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700" itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
            <h3 itemprop="name" class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">{{ $t('faq.q4.question') }}</h3>
            <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
              <p itemprop="text" class="text-gray-600 dark:text-gray-300">{{ $t('faq.q4.answer') }}</p>
            </div>
          </div>
          
          <!-- FAQ 5 -->
          <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700" itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
            <h3 itemprop="name" class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">{{ $t('faq.q5.question') }}</h3>
            <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
              <p itemprop="text" class="text-gray-600 dark:text-gray-300">{{ $t('faq.q5.answer') }}</p>
            </div>
          </div>
          
          <!-- FAQ 6 -->
          <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700" itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
            <h3 itemprop="name" class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">{{ $t('faq.q6.question') }}</h3>
            <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
              <p itemprop="text" class="text-gray-600 dark:text-gray-300">{{ $t('faq.q6.answer') }}</p>
            </div>
          </div>
        </div>
        
        <div class="mt-16 text-center">
          <button
            @click="scrollToTop"
            class="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50"
          >
            {{ $t('cta.useNow') }}
          </button>
        </div>
      </section>

      <!-- 页脚 -->
      <footer class="mt-20 pt-10 border-t border-gray-200 dark:border-gray-700">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div class="md:col-span-2">
            <div class="flex items-center mb-4">
              <UIcon name="solar:letter-bold" class="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
              <span class="ml-2 text-xl font-bold text-indigo-600 dark:text-indigo-400">{{ $t('appName') }}</span>
            </div>
            <p class="text-gray-500 dark:text-gray-400 mb-4">{{ $t('footer.description') }}</p>
            <p class="text-gray-500 dark:text-gray-400">© {{ new Date().getFullYear() }} {{ $t('appName') }} {{ $t('footer.serviceSuffix') }} {{ $t('footer.rights') }}</p>
          </div>
          
          <!-- 服务导航 -->
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-gray-100 mb-4">{{ $t('footer.nav.service') }}</h3>
            <ul class="space-y-2">
              <li>
                <a href="#hero" 
                   @click.prevent="scrollToSection('hero')" 
                   class="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer"
                   :aria-label="$t('footer.nav.emailService')">
                  {{ $t('footer.nav.emailService') }}
                </a>
              </li>
              <li>
                <a href="#features" 
                   @click.prevent="scrollToSection('features')" 
                   class="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer"
                   :aria-label="$t('nav.features')">
                  {{ $t('nav.features') }}
                </a>
              </li>
              <li>
                <a href="#how-to" 
                   @click.prevent="scrollToSection('how-to')" 
                   class="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer"
                   :aria-label="$t('nav.howto')">
                  {{ $t('nav.howto') }}
                </a>
              </li>
              <li>
                <a href="#faq" 
                   @click.prevent="scrollToSection('faq')" 
                   class="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer"
                   :aria-label="$t('nav.faq')">
                  {{ $t('nav.faq') }}
                </a>
              </li>
            </ul>
          </div>
          
          <!-- 法律导航 -->
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-gray-100 mb-4">{{ $t('footer.nav.legal') }}</h3>
            <ul class="space-y-2">
              <li>
                <a href="#" 
                   @click.prevent="scrollToSection('hero')" 
                   class="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                   :aria-label="$t('footer.nav.privacy')">
                  {{ $t('footer.nav.privacy') }}
                </a>
              </li>
              <li>
                <a href="#" 
                   @click.prevent="scrollToSection('hero')" 
                   class="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                   :aria-label="$t('footer.nav.terms')">
                  {{ $t('footer.nav.terms') }}
                </a>
              </li>
              <li>
                <a href="#" 
                   @click.prevent="scrollToSection('hero')" 
                   class="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                   :aria-label="$t('footer.nav.disclaimer')">
                  {{ $t('footer.nav.disclaimer') }}
                </a>
              </li>
              <li>
                <a href="#" 
                   @click.prevent="showContactModal" 
                   class="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer"
                   :aria-label="$t('footer.nav.contact')">
                  {{ $t('footer.nav.contact') }}
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div class="text-center text-sm text-gray-500 dark:text-gray-400 pt-6 border-t border-gray-100 dark:border-gray-700">
          <p>{{ $t('footer.warning') }}</p>
        </div>
      </footer>
    </div>

    <!-- 通知提示 -->
    <div
      v-if="notification.show"
      :class="[
        'fixed bottom-4 right-4 px-6 py-4 rounded-lg text-white shadow-xl transition-all transform duration-300 flex items-center gap-2 max-w-md z-50',
        notification.type === 'success' ? 'bg-emerald-600' : 'bg-red-600',
        notification.show ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      ]"
    >
      <UIcon v-if="notification.type === 'success'" name="solar:check-circle-bold" class="size-5" />
      <UIcon v-else name="solar:danger-circle-bold" class="size-5" />
      {{ notification.message }}
    </div>

    <!-- 联系我们模态框 -->
    <div
      v-if="isContactModalOpen"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="isContactModalOpen = false"
    >
      <div 
        class="bg-white rounded-xl shadow-xl p-6 max-w-md w-full m-4 transform transition-all"
        @click.stop
      >
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <UIcon name="solar:user-speak-bold" class="text-indigo-600 dark:text-indigo-400 size-6" />
            {{ $t('contactUs.title') }}
          </h3>
          <button @click="isContactModalOpen = false" class="text-gray-500 hover:text-gray-700">
            <UIcon name="solar:close-circle-bold" class="size-6" />
          </button>
        </div>
        
        <div class="space-y-4 py-2">
          <div class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors">
            <UIcon name="i-heroicons-chat-bubble-left-right" class="text-indigo-600 dark:text-indigo-400 size-8 flex-shrink-0" />
            <div>
              <div class="font-medium text-gray-900 dark:text-gray-100">{{ $t('contactUs.qq') }}</div>
              <div class="text-gray-600 dark:text-gray-400 group flex items-center gap-1">
                <span>2668812066</span>
                <button 
                  @click="copyText('2668812066')" 
                  class="ml-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 opacity-70 hover:opacity-100"
                >
                  <UIcon name="solar:copy-bold" class="size-4" />
                </button>
              </div>
            </div>
          </div>
          
          <div class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors">
            <UIcon name="ic:baseline-email" class="text-indigo-600 dark:text-indigo-400 size-8 flex-shrink-0" />
            <div>
              <div class="font-medium text-gray-900 dark:text-gray-100">{{ $t('contactUs.email') }}</div>
              <div class="text-gray-600 dark:text-gray-400 group flex items-center gap-1">
                <span>2668812066@qq.com</span>
                <button 
                  @click="copyText('2668812066@qq.com')" 
                  class="ml-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 opacity-70 hover:opacity-100"
                >
                  <UIcon name="solar:copy-bold" class="size-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 导入语言切换组件
// import LanguageSwitcher from '../components/LanguageSwitcher.vue'
const { t } = useI18n();

// 定义页面元数据
definePageMeta({
  title: '临时邮箱服务'
})

// 首页特定的SEO设置
useSeoMeta({
  title: '临时邮箱 - 免费、安全的一次性电子邮箱服务',
  ogTitle: '临时邮箱 - 免费、安全的一次性电子邮箱服务',
  description: '使用我们的免费临时邮箱服务，无需注册即可获得一个安全的一次性邮箱地址，保护您的隐私免受垃圾邮件骚扰。',
  ogDescription: '使用我们的免费临时邮箱服务，无需注册即可获得一个安全的一次性邮箱地址，保护您的隐私免受垃圾邮件骚扰。',
  ogImage: '/email-logo.png',
  ogUrl: 'https://temp-email.top',
  ogType: 'website',
  ogLocale: 'zh_CN',
  twitterCard: 'summary_large_image',
  twitterTitle: '临时邮箱 - 免费、安全的一次性电子邮箱服务',
  twitterDescription: '使用我们的免费临时邮箱服务，无需注册即可获得一个安全的一次性邮箱地址，保护您的隐私免受垃圾邮件骚扰。',
  twitterImage: '/email-logo.png',
  keywords: '临时邮箱,一次性邮箱,匿名邮箱,隐私保护,垃圾邮件过滤',
})

// 使用useHead添加其他标签
useHead({
  htmlAttrs: {
    lang: 'zh-CN'
  },
  link: [
    { rel: 'canonical', href: 'https://temp-email.top' },
    { rel: 'icon', type: 'image/png', href: '/email-logo.png' }
  ],
  meta: [
    { name: 'robots', content: 'index, follow' },
    { name: 'description', content: '临时邮箱，免费、安全、一次性邮箱服务，无需注册即可获得邮箱地址，保护隐私，防止垃圾邮件。' },
    { name: 'keywords', content: '临时邮箱,一次性邮箱,匿名邮箱,隐私保护,垃圾邮件过滤,邮箱注册,验证码邮箱,测试邮箱,邮箱防护,邮箱安全,邮箱工具,邮箱临时,邮箱匿名,邮箱防骚扰' }
  ]
})

// 引入Schema.org结构化数据组件
const { default: SchemaOrg } = await import('~/components/SchemaOrg.vue')

interface Email {
  id: number
  sender: string
  senderEmail: string
  time: string
  subject: string
  preview: string
  content: string
  from: string
  receivedAt: number
}

// 状态管理
const emailAddress = ref('')
const emails = ref<Email[]>([])
const selectedEmail = ref<Email | null>(null)
const isChecking = ref(false)
const isCreatingEmail = ref(false)
const autoCheckTimer = ref<number | null>(null)
const autoCheckEndTimer = ref<number | null>(null)
const notification = reactive({
  show: false,
  message: '',
  type: 'success' as 'success' | 'error'
})

const config = useRuntimeConfig();

// 导航和落地页相关
const currentSection = ref('hero') // 'hero', 'app', 'features', 'how-to', 'faq'
const isMobileMenuOpen = ref(false) // 移动端菜单状态

// 部分引用
const heroRef = ref<HTMLElement | null>(null)
const appRef = ref<HTMLElement | null>(null)
const featuresRef = ref<HTMLElement | null>(null)
const howToRef = ref<HTMLElement | null>(null)
const faqRef = ref<HTMLElement | null>(null)

// HTML 安全相关
const isSafeHtml = ref(false)
const sanitizedHtml = ref('')

// 模态框状态
const isContactModalOpen = ref(false)

// 滚动到指定部分
function scrollToSection(section: string): void {
  // 关闭移动菜单
  isMobileMenuOpen.value = false
  
  // 获取对应的部分引用
  let targetRef = null
  switch (section) {
    case 'hero':
      targetRef = heroRef.value
      break
    case 'app':
      targetRef = appRef.value
      break
    case 'features':
      targetRef = featuresRef.value
      break
    case 'how-to':
      targetRef = howToRef.value
      break
    case 'faq':
      targetRef = faqRef.value
      break
  }
  
  // 滚动到目标位置，并考虑导航栏的高度
  if (targetRef) {
    // 获取目标元素的位置
    const targetPosition = targetRef.getBoundingClientRect().top + window.pageYOffset
    // 获取导航栏高度（16 * 4 = 64px，根据导航栏的h-16计算）
    const navHeight = 64
    // 添加一些额外的空间，使内容不会紧贴导航栏底部
    const offset = navHeight + 16 // 16px的额外空间
    
    // 使用scrollTo代替scrollIntoView，以便应用偏移量
    window.scrollTo({
      top: targetPosition - offset,
      behavior: 'smooth'
    })
  }
}

// 简单的HTML净化函数
function sanitizeHtml(html: string): string {
  // 移除脚本和危险属性
  let sanitized = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/onerror=/gi, '')
    .replace(/onclick=/gi, '')
    .replace(/onload=/gi, '')
    .replace(/onmouseover=/gi, '');
  
  return sanitized;
}

// 监听选中邮件的变化，处理HTML内容
watch(selectedEmail, (email) => {
  if (email) {
    // 检查内容是否为HTML
    const isHtml = email.content.trim().startsWith('<') && email.content.includes('</');
    isSafeHtml.value = isHtml;
    
    if (isHtml) {
      // 简单的HTML净化，移除危险标签和属性
      sanitizedHtml.value = sanitizeHtml(email.content);
    } else {
      sanitizedHtml.value = '';
    }
  }
});

// 监听滚动位置决定当前部分
onMounted(() => {
  // 尝试从 localStorage 读取上次生成的邮件地址
  const savedEmail = localStorage.getItem('tempEmailAddress')
  
  if (savedEmail) {
    // 如果本地存在邮件地址，则使用它
    emailAddress.value = savedEmail
    // 尝试获取该邮箱的邮件
    checkNewMails()
  } else {
    // 如果本地没有存储邮件地址，则创建一个新的
    refreshEmail()
  }
  
})

onUnmounted(() => {
  // 清除邮件检查定时器
  stopAutoCheck()
})

// 获取邮件列表
async function fetchEmails(skipCache = false) {
  const MAX_RETRIES = 3;
  let retries = 0;
  // debugger
  const WORKER_URL = config.public.workerUrl;
  while (retries < MAX_RETRIES) {
    try {
      // 添加可选的no_cache参数，用于强制刷新
      const cacheParam = skipCache ? '&no_cache=true' : '';
      const url = `${WORKER_URL}/emails?address=${encodeURIComponent(emailAddress.value.trim())}${cacheParam}`;
      console.log('发送请求:', url);
      
      // 创建一个 AbortController 用于可能的手动取消请求
      const controller = new AbortController();
      const signal = controller.signal;
      
      const response = await fetch(url, { signal });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API错误:', response.status, errorText);
        throw new Error(`获取邮件失败: ${response.status} ${errorText}`);
      }
      
      const data = await response.json();
      console.log('API返回数据:', data);
      
      if (data && Array.isArray(data)) {
        emails.value = data;
        
        if (data.length > 0 && !selectedEmail.value) {
          selectedEmail.value = data[0];
        }
      } else {
        console.error('返回数据格式不正确:', data);
        throw new Error('返回数据格式不正确');
      }
      
      return; // 成功获取
    } catch (error) {
      // 检查是否是手动取消错误
      if ((error as Error).name === 'AbortError') {
        console.error('请求被取消');
        // 不再重试，直接进入下一轮检查
        break;
      }
      
      console.error('获取邮件失败:', error);
      retries++;
      
      if (retries >= MAX_RETRIES) {
        // 只在界面手动点击检查时显示错误通知，自动轮询时不显示
        if (!isChecking.value) {
          showNotification('获取邮件失败，请稍后重试', 'error');
        }
        break;
      }
      
      // 等待一段时间后重试
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}

// 复制邮箱地址并开始自动轮询邮件
async function copyEmail() {
  try {
    await navigator.clipboard.writeText(emailAddress.value)
    showNotification( t('copySuccess'))
    
    // 复制成功后自动开始轮询邮件，传入true表示是自动触发的轮询,等待2秒再开始检查
    await new Promise(resolve => setTimeout(resolve, 2000));
    startAutoCheck(true)
  } catch (err) {
    // showNotification('复制失败，请手动复制', 'error')
  }
}

// 刷新邮箱地址后立即检查
async function checkEmailsAfterRefresh() {
  // 在生成新邮箱后，先等待2秒让邮件系统初始化
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // 进行首次检查，跳过缓存
  await fetchEmails(true);
  
  // 如果没有邮件，等待3秒再次检查
  if (emails.value.length === 0) {
    await new Promise(resolve => setTimeout(resolve, 3000));
    await fetchEmails(true);
  }
}

// 刷新邮箱地址
async function refreshEmail() {        
  isCreatingEmail.value = true
  try {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let username = '';
    for (let i = 0; i < 8; i++) {
      username += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const address = `${username}@220901.xyz`;
    emailAddress.value = address
    
    // 保存新生成的邮件地址到 localStorage
    localStorage.setItem('tempEmailAddress', address)
    
    emails.value = []
    selectedEmail.value = null
    showNotification('已生成新的临时邮箱地址')
    
    // 立即检查是否有邮件
    checkEmailsAfterRefresh().catch(err => {
      console.error('初始检查失败:', err)
    });
  } catch (error: any) {
    showNotification('生成新邮箱失败', 'error')
  } finally {
    isCreatingEmail.value = false
  }
}

// 检查新邮件
async function checkNewMails() {
  if (!emailAddress.value) {
    showNotification('请先创建邮箱地址', 'error')
    stopAutoCheck()
    return
  }
  
  try {
    // 手动点击检查邮件时，强制跳过缓存获取最新数据
    await fetchEmails(true)
  } catch (err) {
    console.error('邮件检查错误:', err);
    
    // 仅在手动检查邮件时显示错误提示，自动轮询时不显示
    if (!isChecking.value) {
      showNotification('检查邮件失败', 'error')
    }
  }
}

// 开始自动检查邮件
function startAutoCheck(isAuto = false) {
  // 如果已经在检查中，先停止之前的检查
  if (isChecking.value) {
    stopAutoCheck()
  }
  
  isChecking.value = true
  
  // 立即执行一次检查
  checkNewMails()
  
  // 清除可能存在的旧定时器
  if (autoCheckTimer.value !== null) {
    clearInterval(autoCheckTimer.value)
  }
  
  // 清除可能存在的旧的结束定时器
  if (autoCheckEndTimer.value !== null) {
    clearTimeout(autoCheckEndTimer.value)
    autoCheckEndTimer.value = null
  }
  
  // 设置每5秒自动检查一次
  autoCheckTimer.value = window.setInterval(() => {
    checkNewMails()
  }, 5000)
  
  // 设置2分钟后自动停止检查
  autoCheckEndTimer.value = window.setTimeout(() => {
    stopAutoCheck()
    // 只有在手动检查时才显示通知，自动检查时不显示
    if (!isAuto) {
      showNotification(t('app.emailCard.autoCheckComplete', '自动检查已完成'))
    }
  }, 120000) // 120秒 = 2分钟
}

// 停止自动检查
function stopAutoCheck() {
  // 重置检查状态
  isChecking.value = false
  
  // 清除检查邮件定时器
  if (autoCheckTimer.value !== null) {
    clearInterval(autoCheckTimer.value)
    autoCheckTimer.value = null
  }
  
 // 清除结束定时器
  if (autoCheckEndTimer.value !== null) {
    clearTimeout(autoCheckEndTimer.value)
    autoCheckEndTimer.value = null
  }
  
  isChecking.value = false
}

// 选择邮件
function selectEmail(email: Email) {
  selectedEmail.value = email
}

// 显示通知
function showNotification(message: string, type: 'success' | 'error' = 'success') {
  notification.message = message
  notification.type = type
  notification.show = true
  setTimeout(() => {
    notification.show = false
  }, 3000)
}

// 清空收件箱
async function clearEmails() {
  if (emails.value.length === 0) return;
  
  // 先清空前端显示，提供即时反馈
  const emailsBackup = [...emails.value]; // 备份以便出错时可以恢复
  emails.value = [];
  selectedEmail.value = null;
  
  // 显示正在处理的通知
  showNotification('正在清空收件箱...', 'success');
  
  // 调用Worker API删除KV存储中的邮件
  try {
    const WORKER_URL = config.public.workerUrl;
    const url = `${WORKER_URL}/emails/clear?address=${encodeURIComponent(emailAddress.value.trim())}`;
    
    const controller = new AbortController();
    const signal = controller.signal;
    
    const response = await fetch(url, { 
      method: 'DELETE',
      signal 
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API错误:', response.status, errorText);
      throw new Error(`清空邮件失败: ${response.status} ${errorText}`);
    }
    
    const data = await response.json();
    console.log('清空邮件返回数据:', data);
    
    // 成功清空
    showNotification('收件箱已清空', 'success');
  } catch (error) {
    console.error('清空邮件失败:', error);
    
    // 恢复邮件列表
    emails.value = emailsBackup;
    if (emailsBackup.length > 0) {
      selectedEmail.value = emailsBackup[0];
    }
    
    // 显示错误通知
    showNotification('清空邮件失败，请稍后重试', 'error');
  }
}

// 滚动到页面顶部
function scrollToTop(): void {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

// 格式化邮件接收时间
function formatDate(timestamp: number | string): string {
  if (!timestamp) return '';
  
  let date;
  if (typeof timestamp === 'number') {
    date = new Date(timestamp);
  } else {
    // 如果是字符串，尝试转换为日期
    date = new Date(timestamp);
  }
  
  // 检查日期是否有效
  if (isNaN(date.getTime())) {
    return timestamp as string; // 如果无法解析为日期，直接返回原始字符串
  }
  
  // 如果是今天的日期，只显示时间
  const today = new Date();
  if (date.getDate() === today.getDate() && 
      date.getMonth() === today.getMonth() && 
      date.getFullYear() === today.getFullYear()) {
    return date.toLocaleTimeString('zh-CN', {hour: '2-digit', minute: '2-digit'});
  }
  
  // 其他日期显示日期和时间
  return date.toLocaleDateString('zh-CN', {month: 'numeric', day: 'numeric'}) + ' ' + 
         date.toLocaleTimeString('zh-CN', {hour: '2-digit', minute: '2-digit'});
}

// 显示联系我们模态框
function showContactModal() {
  isContactModalOpen.value = true
}

// 复制文本
async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    showNotification('已复制到剪贴板')
  } catch (err) {
    showNotification('复制失败，请手动复制', 'error')
  }
}
</script>