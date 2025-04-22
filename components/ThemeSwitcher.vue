<template>
  <div>
    <UButton
      :icon="colorMode.value === 'dark' ? 'i-heroicons-sun' : 'i-heroicons-moon'"
      :color="colorMode.value === 'dark' ? 'yellow' : 'indigo'"
      :variant="colorMode.value === 'dark' ? 'solid' : 'outline'"
      class="theme-switcher cursor-pointer"
      @click="toggleColorMode"
    >
      {{ colorMode.value === 'dark' ? $t('theme.light') : $t('theme.dark') }}
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