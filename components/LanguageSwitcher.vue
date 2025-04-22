<template>
  <div class="relative">
    <!-- 语言切换按钮 -->
    <button 
      @click="isOpen = !isOpen" 
      class="flex items-center px-3 py-2 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white rounded-lg"
    >
      <!-- 添加语言图标 -->
      <UIcon name="i-heroicons-language" class="h-5 w-5 mr-1" />
      <span>{{ currentLanguageName }}</span>
      <span class="ml-1">
        <UIcon v-if="!isOpen" name="i-heroicons-chevron-down-20-solid" class="h-5 w-5" />
        <UIcon v-else name="i-heroicons-chevron-up-20-solid" class="h-5 w-5" />
      </span>
    </button>

    <!-- 语言选择下拉框 -->
    <div 
      v-if="isOpen" 
      class="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-700 rounded-lg shadow-lg z-50 py-1"
      @mouseleave="isOpen = false"
    >
      <button 
        v-for="lang in locales" 
        :key="lang.code"
        @click="switchLanguage(lang.code)" 
        class="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
        :class="{'bg-gray-100 dark:bg-gray-600': locale === lang.code}"
      >
        {{ lang.name }}
      </button>
    </div>
  </div>
</template>

<script setup>
const { locale, locales } = useI18n();

const isOpen = ref(false);

const currentLanguage = computed(() => {
  return locales.value.find(l => l.code === locale.value) || locales.value[0];
});

const currentLanguageName = computed(() => currentLanguage.value?.name || '语言');

function switchLanguage(code) {
  // 直接使用navigateTo更改URL中的语言参数，这是Nuxt i18n的标准方式
  const localePath = useLocalePath();
  const route = useRoute();
  
  // 关闭菜单
  isOpen.value = false;
  
  // 切换语言
  const path = localePath(route.fullPath, code);
  navigateTo(path);
}
</script>

<style scoped>
/* 添加一些过渡效果 */
.absolute {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
</style> 