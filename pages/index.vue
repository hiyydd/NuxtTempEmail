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
            <div class="flex-1 bg-gray-50 px-4 py-3 rounded-md border border-gray-200 font-medium text-gray-900 truncate flex items-center min-h-[42px]">
              {{ emailAddress || '等待生成邮箱...' }}
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
              :disabled="isCreatingEmail"
            >
              <span v-if="!isCreatingEmail" class="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                创建邮箱
              </span>
              <span v-else class="flex items-center justify-center gap-1">
                <span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                创建中...
              </span>
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
              <div class="flex-1 overflow-y-auto prose prose-sm max-w-none" v-if="selectedEmail">
                <!-- 使用安全的方式渲染HTML内容 -->
                <div v-if="isSafeHtml" v-html="sanitizedHtml"></div>
                <pre v-else>{{ selectedEmail.content }}</pre>
              </div>
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
const emailAddress = ref('')
const emails = ref<Email[]>([])
const selectedEmail = ref<Email | null>(null)
const isChecking = ref(false)
const isCreatingEmail = ref(false)
const notification = reactive({
  show: false,
  message: '',
  type: 'success' as 'success' | 'error'
})

// HTML 安全相关
const isSafeHtml = ref(false)
const sanitizedHtml = ref('')

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
  
  while (retries < MAX_RETRIES) {
    try {
      const url = `/api/email/emails?address=${encodeURIComponent(emailAddress.value.trim())}`;
      console.log('发送请求:', url);
      
      const response = await fetch(url);
      
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
      console.error('获取邮件失败:', error);
      retries++;
      
      if (retries >= MAX_RETRIES) {
        showNotification('获取邮件失败，请稍后重试', 'error');
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
    const address = `${username}@liaoxiang.fun`;
    emailAddress.value = address
    
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
  isChecking.value = true
  
  if (!emailAddress.value) {
    showNotification('请先创建邮箱地址', 'error')
    isChecking.value = false
    return
  }
  
  try {
    await fetchEmails()
    
    if (emails.value.length > 0) {
      showNotification(`找到 ${emails.value.length} 封邮件`)
    } else {
      showNotification('未找到邮件，请确认邮箱地址并稍后再试', 'error')
    }
  } catch (err) {
    showNotification('检查邮件失败', 'error')
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