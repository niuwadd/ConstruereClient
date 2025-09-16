<template>
  <router-view v-slot="{ Component, route }">
    <Transition :name="typeof route.meta.transition === 'string'
      ? route.meta.transition
      : undefined
      " mode="out-in">
      <component :is="Component" />
    </Transition>
  </router-view>
</template>
<script setup lang="ts">
</script>
<style scoped>
html,
body,
#app {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.chat-enter-active,
.chat-leave-active {
  transition: all 0.3s ease-out;
}

.chat-enter-from {
  opacity: 0;
  transform: translateX(100%);
}
</style>
