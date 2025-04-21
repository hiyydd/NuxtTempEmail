<template>
  <div>
    <UButton
      :icon="colorMode.value === 'dark' ? 'i-heroicons-sun' : 'i-heroicons-moon'"
      :color="colorMode.value === 'dark' ? 'yellow' : 'indigo'"
      :variant="colorMode.value === 'dark' ? 'solid' : 'outline'"
      class="theme-switcher cursor-pointer"
      @click="toggleColorMode"
    >
      {{ colorMode.value === 'dark' ? '切换到浅色' : '切换到深色' }}
    </UButton>
  </div>
</template>

<script setup lang="ts">
const colorMode = useColorMode()

function toggleColorMode() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>

<style scoped>
.theme-switcher {
  transition: all 0.3s ease;
}
</style> 