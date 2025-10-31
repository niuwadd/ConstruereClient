<template>
  <div class="h-[calc(100%-24px)] flex flex-col gap-2">
    <MapContainer class="rounded-xl overflow-hidden" />
    <div class="bg-gray-500 rounded-xl p-4 text-xl">
      全程：{{ distance }}公里 {{ time }}分
    </div>
  </div>
</template>
<script setup lang="ts">
import MapContainer from '@/components/MapContainer.vue'
const distance = 37
const time = 46
</script>
<style scoped lang="scss"></style>