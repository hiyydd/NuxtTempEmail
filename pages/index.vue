<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 relative">
    <!-- 背景动效 Canvas -->
    <canvas ref="backgroundCanvas" class="absolute inset-0 w-full h-full pointer-events-none z-0"></canvas>
    
    <!-- 导航栏 -->
    <nav class="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <div class="flex-shrink-0 flex items-center cursor-pointer" @click="scrollToTop">
              <UIcon name="mdi:email" class="h-8 w-8 text-indigo-600" />
              <span class="ml-2 text-xl font-bold text-indigo-600">临时邮箱</span>
            </div>
            <!-- 桌面端导航链接 -->
            <div class="hidden md:ml-8 md:flex md:space-x-8">
              <a @click="scrollToSection('hero')" :class="['inline-flex items-center px-1 pt-1 text-base font-medium border-b-2 cursor-pointer', currentSection === 'hero' ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300']">首页</a>
              <a @click="scrollToSection('app')" :class="['inline-flex items-center px-1 pt-1 text-base font-medium border-b-2 cursor-pointer', currentSection === 'app' ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300']">应用</a>
              <a @click="scrollToSection('features')" :class="['inline-flex items-center px-1 pt-1 text-base font-medium border-b-2 cursor-pointer', currentSection === 'features' ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300']">功能特点</a>
              <a @click="scrollToSection('how-to')" :class="['inline-flex items-center px-1 pt-1 text-base font-medium border-b-2 cursor-pointer', currentSection === 'how-to' ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300']">使用说明</a>
              <a @click="scrollToSection('faq')" :class="['inline-flex items-center px-1 pt-1 text-base font-medium border-b-2 cursor-pointer', currentSection === 'faq' ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300']">常见问题</a>
            </div>
          </div>
          <!-- 移动导航按钮 -->
          <div class="flex items-center md:hidden">
            <button @click="isMobileMenuOpen = !isMobileMenuOpen" class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100">
              <UIcon v-if="!isMobileMenuOpen" name="mdi:menu" class="h-6 w-6" />
              <UIcon v-else name="mdi:close" class="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
      
      <!-- 移动菜单 -->
      <div v-show="isMobileMenuOpen" class="md:hidden bg-white">
        <div class="pt-2 pb-3 space-y-1">
          <a @click="scrollToSection('hero'); isMobileMenuOpen = false" :class="['block pl-3 pr-4 py-2 text-base font-medium border-l-4 cursor-pointer', currentSection === 'hero' ? 'border-indigo-500 text-indigo-700 bg-indigo-50' : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700']">
            首页
          </a>
          <a @click="scrollToSection('app'); isMobileMenuOpen = false" :class="['block pl-3 pr-4 py-2 text-lg font-medium border-l-4 cursor-pointer', currentSection === 'app' ? 'border-indigo-500 text-indigo-700 bg-indigo-50' : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700']">
            应用
          </a>
          <a @click="scrollToSection('features'); isMobileMenuOpen = false" :class="['block pl-3 pr-4 py-2 text-lg font-medium border-l-4 cursor-pointer', currentSection === 'features' ? 'border-indigo-500 text-indigo-700 bg-indigo-50' : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700']">
            功能特点
          </a>
          <a @click="scrollToSection('how-to'); isMobileMenuOpen = false" :class="['block pl-3 pr-4 py-2 text-lg font-medium border-l-4 cursor-pointer', currentSection === 'how-to' ? 'border-indigo-500 text-indigo-700 bg-indigo-50' : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700']">
            使用说明
          </a>
          <a @click="scrollToSection('faq'); isMobileMenuOpen = false" :class="['block pl-3 pr-4 py-2 text-lg font-medium border-l-4 cursor-pointer', currentSection === 'faq' ? 'border-indigo-500 text-indigo-700 bg-indigo-50' : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700']">
            常见问题
          </a>
        </div>
      </div>
    </nav>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <!-- 英雄区域 - Hero Section -->
      <section ref="heroRef" id="hero" class="py-4">
        <header class="text-center mb-4 mt-2">
          <h1 class="text-4xl sm:text-6xl font-bold text-gray-900 mb-4 tracking-tight leading-tight">
            快速安全的<span class="text-indigo-600">临时邮箱</span><br>保护您的隐私
          </h1>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            无需注册，即可获得一个临时邮箱地址。保护您的真实邮箱免受垃圾邮件的侵扰，适用于测试、注册和一次性使用场景。
          </p>
        </header>
      </section>

      <!-- 应用区域 - App Section -->
      <section ref="appRef" id="app" class="py-2">
        <!-- 应用界面包装器 -->
        <div class="space-y-8">
          <!-- 邮箱地址卡片 -->
          <section class="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 sm:p-8 space-y-5 border border-gray-100">
            <h2 class="text-xl sm:text-2xl font-semibold text-gray-800">您的临时邮箱地址</h2>
            <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div class="flex-1 bg-gray-50 px-4 py-3 rounded-lg border border-gray-200 font-medium text-gray-900 truncate flex items-center min-h-[42px] select-all group hover:border-indigo-300 transition-colors">
                <span class="truncate">{{ emailAddress || '等待生成邮箱...' }}</span>
              </div>
              <button
                @click="copyEmail"
                class="sm:min-h-[42px] w-full sm:w-32 flex items-center justify-center gap-1 px-3 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50"
              >
                <UIcon name="mdi:content-copy" class="h-4 w-4" />
                复制
              </button>
            </div>
            <div class="flex flex-col sm:flex-row gap-3 pt-1">
              <button
                @click="refreshEmail"
                class="w-full sm:w-auto flex items-center justify-center gap-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                :disabled="isCreatingEmail"
                :class="{'opacity-70 cursor-not-allowed': isCreatingEmail}"
              >
                <span v-if="!isCreatingEmail" class="flex items-center gap-1">
                  <UIcon name="mdi:refresh" class="h-4 w-4" />
                  创建新邮箱
                </span>
                <span v-else class="flex items-center justify-center gap-1">
                  <span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  创建中...
                </span>
              </button>
              <button
                @click="startAutoCheck"
                class="w-full sm:w-auto flex items-center justify-center gap-1 px-4 py-2.5 border-2 border-indigo-500 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-30"
                :disabled="isChecking"
                :class="{'opacity-70 cursor-not-allowed': isChecking}"
              >
                <span v-if="!isChecking" class="flex items-center gap-1">
                  <UIcon name="mdi:email" class="h-4 w-4" />
                  检查新邮件
                </span>
                <span v-else class="flex items-center justify-center gap-1">
                  <span class="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></span>
                  正在检查邮件
                </span>
              </button>
            </div>
          </section>

          <!-- 收件箱区域 -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- 邮件列表 -->
            <section class="lg:col-span-1 bg-white rounded-xl shadow-md p-6 h-[550px] flex flex-col border border-gray-100">
              <div class="flex justify-between items-center mb-5">
                <h2 class="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <UIcon name="mdi:inbox" class="text-indigo-500 w-5 h-5" />
                  收件箱
                </h2>
                <UButton
                  v-if="emails.length > 0"
                  color="error"
                  variant="soft"
                  icon="mdi:delete"
                  size="sm"
                  @click="clearEmails"
                >
                  清空
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
                      ? 'bg-indigo-50 border-indigo-300 ring-1 ring-indigo-500 shadow-sm'
                      : 'hover:bg-gray-50 border-transparent hover:border-gray-200'"
                  >
                    <div class="flex justify-between items-start gap-2 mb-1">
                      <span class="font-medium text-gray-900 truncate flex-1">{{ email.from }}</span>
                      <span class="text-xs text-gray-500 whitespace-nowrap">{{ formatDate(email.receivedAt) }}</span>
                    </div>
                    <div class="font-medium text-gray-800 truncate">{{ email.subject }}</div>
                    <div class="text-sm text-gray-500 truncate mt-1">{{ email.preview }}</div>
                  </li>
                </ul>
              </UScrollbar>
              <div v-else class="flex-1 flex items-center justify-center">
                <UEmpty
                  icon="mdi:inbox-outline"
                  name="暂无邮件"
                  description="创建邮箱后，所有发送到该地址的邮件将显示在这里"
                />
              </div>
            </section>

            <!-- 邮件内容 -->
            <section class="lg:col-span-2 bg-white rounded-xl shadow-md p-6 h-[550px] flex flex-col border border-gray-100">
              <div v-if="selectedEmail" class="h-full flex flex-col">
                <div class="border-b border-gray-200 pb-4 mb-4">
                  <h3 class="text-2xl font-semibold text-gray-900 mb-2 break-words">{{ selectedEmail.subject }}</h3>
                  <div class="flex flex-wrap justify-between text-sm text-gray-500 gap-2">
                    <span class="truncate max-w-full sm:max-w-[70%] flex items-center gap-1">
                      <UIcon name="mdi:account-circle" class="w-4 h-4" />
                      {{ selectedEmail.from }}
                    </span>
                    <span class="text-gray-400 flex items-center gap-1">
                      <UIcon name="mdi:clock-outline" class="w-4 h-4" />
                      {{ formatDate(selectedEmail.receivedAt) || selectedEmail.time }}
                    </span>
                  </div>
                </div>
                <div class="flex-1 overflow-auto">
                  <div class="prose prose-sm max-w-none">
                    <div v-if="isSafeHtml" v-html="sanitizedHtml" class="prose-indigo"></div>
                    <pre v-else class="whitespace-pre-wrap text-gray-700 bg-gray-50 p-3 rounded-lg">{{ selectedEmail.content }}</pre>
                  </div>
                </div>
              </div>
              <div v-else class="h-full flex items-center justify-center">
                <UEmpty
                  icon="mdi:email-outline"
                  name="选择邮件"
                  description="从左侧收件箱选择邮件以查看内容"
                />
              </div>
            </section>
          </div>
        </div>
      </section>

      <!-- 功能特点部分 -->
      <section ref="featuresRef" id="features" class="py-12 border-t border-gray-100 mt-8">
        <h2 class="text-3xl font-bold text-center text-gray-900 mb-12">为什么选择我们的临时邮箱服务？</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- 功能卡片1：即时可用 -->
          <div class="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100">
            <div class="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">即时可用</h3>
            <p class="text-gray-600">无需注册或登录，一键生成临时邮箱地址，立即开始使用，节省您的宝贵时间。</p>
          </div>
          
          <!-- 功能卡片2：隐私保护 -->
          <div class="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100">
            <div class="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">隐私保护</h3>
            <p class="text-gray-600">保护您的真实邮箱地址免受垃圾邮件骚扰，不会泄露您的个人身份信息。</p>
          </div>
          
          <!-- 功能卡片3：简洁易用 -->
          <div class="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100">
            <div class="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">简洁易用</h3>
            <p class="text-gray-600">界面清晰直观，操作简单，适合所有年龄段和技术水平的用户使用。</p>
          </div>
          
          <!-- 功能卡片4：安全可靠 -->
          <div class="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100">
            <div class="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">安全可靠</h3>
            <p class="text-gray-600">所有邮件内容都经过安全处理，移除危险代码，确保您的设备安全。</p>
          </div>
          
          <!-- 功能卡片5：完全免费 -->
          <div class="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100">
            <div class="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">完全免费</h3>
            <p class="text-gray-600">我们的临时邮箱服务对所有用户完全免费，没有任何隐藏费用或广告干扰。</p>
          </div>
          
          <!-- 功能卡片6：自动检查 -->
          <div class="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100">
            <div class="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">自动检查</h3>
            <p class="text-gray-600">自动轮询检查新邮件，无需手动刷新页面，即时接收重要信息。</p>
          </div>
        </div>
        
      </section>

      <!-- 使用说明部分 -->
      <section ref="howToRef" id="how-to" class="py-12 border-t border-gray-100 mt-8">
        <h2 class="text-3xl font-bold text-center text-gray-900 mb-12">如何使用临时邮箱</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div class="bg-white p-6 rounded-xl shadow-md border border-gray-100 relative">
            <div class="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-lg">1</div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3 mt-2">生成邮箱地址</h3>
            <p class="text-gray-600 mb-4">点击"创建新邮箱"按钮，系统会立即为您生成一个随机的临时邮箱地址。</p>
            <div class="bg-indigo-50 p-4 rounded-lg">
              <p class="text-indigo-800 text-sm">提示：您可以随时点击复制按钮将邮箱地址复制到剪贴板。</p>
            </div>
          </div>
          
          <div class="bg-white p-6 rounded-xl shadow-md border border-gray-100 relative">
            <div class="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-lg">2</div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3 mt-2">使用该地址注册</h3>
            <p class="text-gray-600 mb-4">使用生成的临时邮箱地址进行网站注册、订阅或其他需要验证的场景。</p>
            <div class="bg-indigo-50 p-4 rounded-lg">
              <p class="text-indigo-800 text-sm">建议：对于重要账号，请勿使用临时邮箱，应使用您的真实邮箱。</p>
            </div>
          </div>
          
          <div class="bg-white p-6 rounded-xl shadow-md border border-gray-100 relative">
            <div class="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-lg">3</div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3 mt-2">接收和查看邮件</h3>
            <p class="text-gray-600 mb-4">点击"检查新邮件"按钮或开启自动检查，接收到的邮件将显示在收件箱中。</p>
            <div class="bg-indigo-50 p-4 rounded-lg">
              <p class="text-indigo-800 text-sm">注意：临时邮箱中的邮件会在浏览器关闭后清除，请及时保存重要信息。</p>
            </div>
          </div>
        </div>
        
        <div class="bg-indigo-50 p-8 rounded-xl border border-indigo-100 max-w-3xl mx-auto">
          <h3 class="text-xl font-semibold text-indigo-900 mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            重要提示
          </h3>
          <ul class="space-y-2 text-indigo-800">
            <li class="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              临时邮箱适用于一次性验证、测试或不重要的注册。
            </li>
            <li class="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              邮件内容仅在当前浏览器会话中保存，关闭页面后将无法恢复。
            </li>
            <li class="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              如需长期使用邮箱，建议注册正规邮箱服务如Gmail、Outlook等。
            </li>
          </ul>
        </div>
        
      </section>

      <!-- 常见问题部分 -->
      <section ref="faqRef" id="faq" class="py-12 border-t border-gray-100 mt-8">
        <h2 class="text-3xl font-bold text-center text-gray-900 mb-12">常见问题解答</h2>
        
        <div class="max-w-3xl mx-auto space-y-6">
          <!-- FAQ 1 -->
          <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 class="text-xl font-semibold text-gray-900 mb-3">临时邮箱安全吗？</h3>
            <p class="text-gray-600">是的，我们的临时邮箱服务非常安全。我们不会存储您的个人信息，所有邮件内容都经过安全处理，移除潜在的恶意代码。但请注意，临时邮箱不适合接收敏感或重要信息，因为任何人如果知道邮箱地址都可以查看邮件内容。</p>
          </div>
          
          <!-- FAQ 2 -->
          <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 class="text-xl font-semibold text-gray-900 mb-3">邮件可以保存多久？</h3>
            <p class="text-gray-600">临时邮箱中的邮件仅在当前浏览器会话中保存。当您关闭页面或刷新浏览器后，所有邮件将会被清除。如果您需要保存重要信息，请在关闭页面前手动复制或保存。</p>
          </div>
          
          <!-- FAQ 3 -->
          <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 class="text-xl font-semibold text-gray-900 mb-3">可以发送邮件吗？</h3>
            <p class="text-gray-600">目前我们的服务仅支持接收邮件，不支持发送邮件功能。临时邮箱主要用于接收验证码、注册确认等一次性邮件。</p>
          </div>
          
          <!-- FAQ 4 -->
          <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 class="text-xl font-semibold text-gray-900 mb-3">邮件接收需要多长时间？</h3>
            <p class="text-gray-600">大多数邮件会在几秒到几分钟内收到。如果您在等待重要邮件，建议使用"检查新邮件"按钮或启用自动检查功能，系统会每5秒自动检查一次新邮件。</p>
          </div>
          
          <!-- FAQ 5 -->
          <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 class="text-xl font-semibold text-gray-900 mb-3">为什么有些网站不接受临时邮箱？</h3>
            <p class="text-gray-600">一些网站和服务为了防止垃圾注册或滥用，会屏蔽临时邮箱域名。这是正常的安全措施，特别是对于金融、社交媒体等重要平台。对于这些服务，我们建议使用您的真实邮箱进行注册。</p>
          </div>
          
          <!-- FAQ 6 -->
          <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 class="text-xl font-semibold text-gray-900 mb-3">使用临时邮箱有什么限制？</h3>
            <p class="text-gray-600">我们的临时邮箱服务没有使用次数限制，您可以生成多个邮箱地址。但请注意合理使用，避免滥用服务进行垃圾邮件发送或违法活动。我们保留对滥用行为限制服务的权利。</p>
          </div>
        </div>
        
        <div class="mt-16 text-center">
          <button
            @click="scrollToTop"
            class="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50"
          >
            立即使用临时邮箱
          </button>
        </div>
      </section>

      <!-- 页脚 -->
      <footer class="mt-20 pt-10 border-t border-gray-200">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div class="md:col-span-2">
            <div class="flex items-center mb-4">
              <UIcon name="mdi:email" class="h-8 w-8 text-indigo-600" />
              <span class="ml-2 text-xl font-bold text-indigo-600">临时邮箱</span>
            </div>
            <p class="text-gray-500 mb-4">提供快速、安全的临时邮箱服务，保护您的隐私，远离垃圾邮件骚扰。</p>
            <p class="text-gray-500">© {{ new Date().getFullYear() }} 临时邮箱服务。保留所有权利。</p>
          </div>
          
          <div>
            <h3 class="font-semibold text-gray-900 mb-4">服务</h3>
            <ul class="space-y-2">
              <li><a @click="scrollToSection('hero')" class="text-gray-500 hover:text-indigo-600 cursor-pointer">邮箱服务</a></li>
              <li><a @click="scrollToSection('features')" class="text-gray-500 hover:text-indigo-600 cursor-pointer">功能特点</a></li>
              <li><a @click="scrollToSection('how-to')" class="text-gray-500 hover:text-indigo-600 cursor-pointer">使用指南</a></li>
              <li><a @click="scrollToSection('faq')" class="text-gray-500 hover:text-indigo-600 cursor-pointer">常见问题</a></li>
            </ul>
          </div>
          
          <div>
            <h3 class="font-semibold text-gray-900 mb-4">法律</h3>
            <ul class="space-y-2">
              <li><a href="#" class="text-gray-500 hover:text-indigo-600">隐私政策</a></li>
              <li><a href="#" class="text-gray-500 hover:text-indigo-600">服务条款</a></li>
              <li><a href="#" class="text-gray-500 hover:text-indigo-600">免责声明</a></li>
              <li><a href="#" class="text-gray-500 hover:text-indigo-600">联系我们</a></li>
            </ul>
          </div>
        </div>
        
        <div class="text-center text-sm text-gray-500 pt-6 border-t border-gray-100">
          <p>本服务仅用于合法用途，禁止用于发送垃圾邮件或任何违法内容。</p>
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
      <svg v-if="notification.type === 'success'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      {{ notification.message }}
    </div>
  </div>
</template>

<script setup lang="ts">
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

// 背景动效相关
const backgroundCanvas = ref<HTMLCanvasElement | null>(null)
const animationFrame = ref<number | null>(null)

// 初始化背景动效
function initBackgroundAnimation() {
  const canvas = backgroundCanvas.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // 设置画布尺寸
  const resizeCanvas = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }
  
  // 初始调整大小
  resizeCanvas()
  
  // 监听窗口大小变化
  window.addEventListener('resize', resizeCanvas)

  // 粒子数组
  const particles: Particle[] = []
  const particleCount = 50

  // 粒子类
  class Particle {
    x: number
    y: number
    size: number
    speedX: number
    speedY: number
    color: string

    constructor() {
      // 计算中心区域左右两侧的位置
      const centerWidth = canvas!.width * 0.6 // 中心区域宽度，占总宽度的60%
      const sideWidth = (canvas!.width - centerWidth) / 2 // 每侧的宽度
      
      // 随机决定是左侧还是右侧
      const isLeftSide = Math.random() > 0.5
      
      if (isLeftSide) {
        // 左侧区域
        this.x = Math.random() * sideWidth
      } else {
        // 右侧区域
        this.x = canvas!.width - (Math.random() * sideWidth)
      }
      
      this.y = Math.random() * canvas!.height
      this.size = Math.random() * 4 + 1
      this.speedX = (Math.random() - 0.5) * 0.5
      this.speedY = (Math.random() - 0.5) * 0.5
      
      // 加深颜色 - 使用更高的不透明度值(0.5-0.7)
      const colors = [
        'rgba(79, 70, 229, 0.6)', // 靛青色
        'rgba(99, 102, 241, 0.7)', // 蓝色
        'rgba(129, 140, 248, 0.6)', // 浅蓝色
        'rgba(67, 56, 202, 0.7)'  // 深靛青色
      ]
      this.color = colors[Math.floor(Math.random() * colors.length)]
    }

    update() {
      this.x += this.speedX
      this.y += this.speedY

      // 边界检查 - 循环
      const centerWidth = canvas!.width * 0.6
      const sideWidth = (canvas!.width - centerWidth) / 2
      
      // 如果粒子进入中心区域，将其移到另一侧
      if (this.x > sideWidth && this.x < (canvas!.width - sideWidth)) {
        // 如果来自左侧，则移到右侧
        if (this.speedX > 0) {
          this.x = canvas!.width - sideWidth
        } else {
          // 如果来自右侧，则移到左侧
          this.x = sideWidth
        }
      }
      
      // 顶部和底部边界仍然循环
      if (this.y > canvas!.height) this.y = 0
      else if (this.y < 0) this.y = canvas!.height
    }

    draw() {
      if (!ctx) return
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
      ctx.fillStyle = this.color
      ctx.fill()
    }
  }

  // 创建粒子
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle())
  }

  // 连接粒子的函数
  function connectParticles() {
    if (!ctx) return
    
    const maxDistance = 150
    
    for (let i = 0; i < particles.length; i++) {
      for (let j = i; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x
        const dy = particles[i].y - particles[j].y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        if (distance < maxDistance) {
          const opacity = 1 - (distance / maxDistance)
          // 增加连接线的不透明度
          ctx.beginPath()
          ctx.strokeStyle = `rgba(99, 102, 241, ${opacity * 0.35})`
          ctx.lineWidth = 1
          ctx.moveTo(particles[i].x, particles[i].y)
          ctx.lineTo(particles[j].x, particles[j].y)
          ctx.stroke()
        }
      }
    }
  }

  // 动画函数
  function animate() {
    if (!ctx || !canvas) return
    
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    for (const particle of particles) {
      particle.update()
      particle.draw()
    }
    
    connectParticles()
    
    animationFrame.value = requestAnimationFrame(animate)
  }

  // 开始动画
  animate()
}

// 滚动到指定部分
function scrollToSection(section: string): void {
  currentSection.value = section
  
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
  
  // 滚动到目标位置
  if (targetRef) {
    targetRef.scrollIntoView({
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
  
  // 添加滚动监听，根据滚动位置更新当前部分
  window.addEventListener('scroll', handleScroll)

  // 初始化背景动效
  initBackgroundAnimation()
})

onUnmounted(() => {
  // 移除滚动监听
  window.removeEventListener('scroll', handleScroll)
  // 清除邮件检查定时器
  stopAutoCheck()
  // 清除动画定时器
  if (animationFrame.value) {
    cancelAnimationFrame(animationFrame.value)
  }
})

// 处理滚动，自动更新当前部分
function handleScroll() {
  const scrollPosition = window.scrollY + 100 // 添加一点偏移量，确保导航能够正确高亮

  // 获取各部分的位置
  const heroPosition = heroRef.value?.offsetTop || 0
  const appPosition = appRef.value?.offsetTop || 0
  const featuresPosition = featuresRef.value?.offsetTop || 0
  const howToPosition = howToRef.value?.offsetTop || 0
  const faqPosition = faqRef.value?.offsetTop || 0
  
  // 根据滚动位置确定当前部分
  if (scrollPosition < appPosition) {
    currentSection.value = 'hero'
  } else if (scrollPosition < featuresPosition) {
    currentSection.value = 'app'
  } else if (scrollPosition < howToPosition) {
    currentSection.value = 'features'
  } else if (scrollPosition < faqPosition) {
    currentSection.value = 'how-to'
  } else {
    currentSection.value = 'faq'
  }
}

// 获取新的临时邮箱地址
async function generateNewEmail() {
  try {
    const response = await fetch('/api/email/generate')
    const data = await response.json()
    return data.address
  } catch (error) {
    console.error('Error generating email:', error)
    throw error
  }
}

// 获取邮件列表
async function fetchEmails() {
  const MAX_RETRIES = 3;
  let retries = 0;
  const WORKER_URL = 'https://email-worker.2668812066.workers.dev';
  while (retries < MAX_RETRIES) {
    try {
      const url = `${WORKER_URL}/emails?address=${encodeURIComponent(emailAddress.value.trim())}`;
      console.log('发送请求:', url);
      
      // 创建一个 AbortController 用于超时取消请求
      const controller = new AbortController();
      const signal = controller.signal;
      
      // 设置5秒超时
      const timeoutId = setTimeout(() => {
        controller.abort();
        console.warn('请求超时，已取消');
      }, 5000);
      
      const response = await fetch(url, { signal });
      
      // 清除超时定时器
      clearTimeout(timeoutId);
      
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
      // 检查是否是超时错误
      if ((error as Error).name === 'AbortError') {
        console.error('请求超时');
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

// 复制邮箱地址
async function copyEmail() {
  try {
    await navigator.clipboard.writeText(emailAddress.value)
    showNotification('邮箱地址已复制到剪贴板')
  } catch (err) {
    showNotification('复制失败，请手动复制', 'error')
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
    await fetchEmails()
  } catch (err) {
    console.error('邮件检查错误:', err);
    
    // 仅在手动检查邮件时显示错误提示，自动轮询时不显示
    if (!isChecking.value) {
      showNotification('检查邮件失败', 'error')
    }
  }
}

// 开始自动检查邮件
function startAutoCheck() {
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
  
  // 设置1分钟后自动停止检查
  autoCheckEndTimer.value = window.setTimeout(() => {
    stopAutoCheck()
    showNotification('自动检查已完成')
  }, 60000) // 60秒 = 1分钟
}

// 停止自动检查
function stopAutoCheck() {
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
function clearEmails() {
  if (emails.value.length === 0) return;
  
  emails.value = [];
  selectedEmail.value = null;
  showNotification('收件箱已清空');
}

// 滚动到页面顶部
function scrollToTop(): void {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
  currentSection.value = 'hero'
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
</script>