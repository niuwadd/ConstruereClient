<template>
  <div class="bg-linear-to-b from-[#E4DBED] via-[#E8EADE] to-[#ECDEDF] size-full">
    <router-view v-slot="{ Component }">
      <Transition name="fade" mode="out-in">
        <component :is="Component" />
      </Transition>
    </router-view>
  </div>
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

.fade-enter-active {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.fade-leave-active {
  transition: all 0.3s cubic-bezier(0.55, 0.085, 0.68, 0.53);
}

.fade-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>
