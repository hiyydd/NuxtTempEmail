<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- 页面头部 -->
      <header class="text-center mb-8">
        <h1 class="text-4xl font-bold text-indigo-600 mb-2">临时邮箱</h1>
        <p class="text-lg text-gray-600">快速、安全、一次性的临时邮箱服务</p>
      </header>

      <main class="space-y-6">
        <!-- 邮箱地址卡片 -->
        <section class="bg-white rounded-lg shadow-sm p-6 space-y-4">
          <h2 class="text-xl font-semibold text-gray-700">您的临时邮箱地址</h2>
          <div class="flex items-center gap-3">
            <div class="flex-1 bg-gray-50 px-4 py-3 rounded-md border border-gray-200 font-medium text-gray-900 truncate">
              {{ emailAddress }}
            </div>
            <button
              @click="copyEmail"
              class="w-32 flex items-center justify-center gap-1 px-2 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors"
            >
              复制
            </button
            >
          </div>
          <div class="flex gap-2">
            <button
              @click="refreshEmail"
              class="w-32 flex items-center justify-center gap-1 px-2 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              刷新邮箱
            </button>
            <button
              @click="checkNewMails"
              class="w-32 flex items-center justify-center gap-1 px-2 py-2 border border-indigo-600 text-indigo-600 hover:bg-gray-50 rounded-md transition-colors"
              :disabled="isChecking"
            >
              <span v-if="!isChecking" class="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                检查新邮件
              </span>
              <span v-else class="flex items-center justify-center gap-1">
                <span class="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></span>
                检查中...
              </span>
            </button>
          </div>
        </section>

        <!-- 收件箱区域 -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- 邮件列表 -->
          <section class="md:col-span-1 bg-white rounded-lg shadow-sm p-6 h-[500px] flex flex-col">
            <h2 class="text-xl font-semibold text-gray-700 mb-4">收件箱</h2>
            <ul class="flex-1 overflow-y-auto space-y-2">
              <li
                v-for="email in emails"
                :key="email.id"
                @click="selectEmail(email)"
                :class="[
                  'p-4 rounded-md cursor-pointer transition-colors',
                  selectedEmail?.id === email.id
                    ? 'bg-indigo-50 border-l-4 border-indigo-600'
                    : 'hover:bg-gray-50'
                ]"
              >
                <div class="flex justify-between mb-1">
                  <span class="font-semibold text-gray-900">{{ email.sender }}</span>
                  <span class="text-sm text-gray-500">{{ email.time }}</span>
                </div>
                <div class="font-medium text-gray-900 truncate">{{ email.subject }}</div>
                <div class="text-sm text-gray-500 truncate">{{ email.preview }}</div>
              </li>
            </ul>
          </section>

          <!-- 邮件内容 -->
          <section class="md:col-span-2 bg-white rounded-lg shadow-sm p-6 h-[500px] flex flex-col">
            <div v-if="selectedEmail" class="h-full flex flex-col">
              <div class="border-b border-gray-200 pb-4 mb-4">
                <h3 class="text-2xl font-semibold text-gray-900 mb-2">{{ selectedEmail.subject }}</h3>
                <div class="flex justify-between text-sm text-gray-500">
                  <span>发件人: {{ selectedEmail.sender }} &lt;{{ selectedEmail.senderEmail }}&gt;</span>
                  <span>{{ selectedEmail.time }}</span>
                </div>
              </div>
              <div class="flex-1 overflow-y-auto prose prose-sm max-w-none" v-html="selectedEmail.content"></div>
            </div>
            <div v-else class="h-full flex items-center justify-center text-gray-400 text-center">
              <div>
                <div class="text-6xl mb-4">📨</div>
                <div>选择一封邮件查看详情</div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>

    <!-- 通知提示 -->
    <div
      v-if="notification.show"
      :class="[
        'fixed bottom-4 right-4 px-6 py-4 rounded-lg text-white shadow-lg transition-all transform',
        notification.type === 'success' ? 'bg-emerald-600' : 'bg-red-600',
        notification.show ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      ]"
    >
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
}

// 状态管理
const emailAddress = ref(generateRandomEmail())
const emails = ref<Email[]>([
  {
    id: 1,
    sender: '系统通知',
    senderEmail: 'system@tempmail.com',
    time: '10:30',
    subject: '欢迎使用临时邮箱服务',
    preview: '感谢您使用我们的临时邮箱服务，这是一封自动发送的欢迎邮件...',
    content: `
      <p>尊敬的用户：</p>
      <br>
      <p>感谢您使用我们的临时邮箱服务！</p>
      <br>
      <p>这是一封自动发送的欢迎邮件，用于确认您的临时邮箱已成功创建并可以正常接收邮件。</p>
      <br>
      <p>临时邮箱的主要特点：</p>
      <ul>
        <li>无需注册，即开即用</li>
        <li>完全免费，没有任何隐藏费用</li>
        <li>保护您的隐私，避免垃圾邮件骚扰</li>
        <li>适用于临时注册、一次性验证等场景</li>
      </ul>
      <br>
      <p>如何使用：</p>
      <ol>
        <li>复制您的临时邮箱地址</li>
        <li>在需要验证邮箱的网站使用此地址</li>
        <li>等待邮件自动显示在您的收件箱中</li>
        <li>查看邮件内容</li>
      </ol>
      <br>
      <p>请注意，临时邮箱的有效期为24小时，过期后邮箱地址将被释放，所有邮件将被永久删除。</p>
      <br>
      <p>祝您使用愉快！</p>
      <br>
      <p>临时邮箱团队</p>
    `
  },
  {
    id: 2,
    sender: '网站注册',
    senderEmail: 'noreply@example.com',
    time: '昨天',
    subject: '您的账号注册验证码',
    preview: '您的验证码是：123456，有效期为5分钟，请勿泄露给他人...',
    content: '验证码邮件内容...'
  },
  {
    id: 3,
    sender: '订阅服务',
    senderEmail: 'subscribe@example.com',
    time: '2天前',
    subject: '感谢您订阅我们的服务',
    preview: '您已成功订阅我们的服务，我们将定期向您发送最新资讯...',
    content: '订阅确认邮件内容...'
  }
])
const selectedEmail = ref<Email | null>(emails.value[0])
const isChecking = ref(false)
const notification = reactive({
  show: false,
  message: '',
  type: 'success' as 'success' | 'error'
})

// 生成随机邮箱地址
function generateRandomEmail() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let username = ''
  for (let i = 0; i < 8; i++) {
    username += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return `${username}@tempmail.com`
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
function refreshEmail() {
  emailAddress.value = generateRandomEmail()
  showNotification('已生成新的临时邮箱地址')
}

// 检查新邮件
async function checkNewMails() {
  isChecking.value = true
  try {
    // 模拟网络请求
    await new Promise(resolve => setTimeout(resolve, 1500))
    showNotification('没有新邮件')
  } finally {
    isChecking.value = false
  }
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
</script>