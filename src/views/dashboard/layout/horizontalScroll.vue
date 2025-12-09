<!-- 水平滚动布局 -->
<template>
  <div class="p-10 w-full h-full overflow-x-auto">
    <div class="flex gap-4 w-max h-full" ref="scrollContainerRef">
      <!-- 使用 w-max 让容器宽度适应内容 -->
      <div class="w-[300px] rounded-2xl bg-white/25" v-for="item in 5" :key="item"></div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import BScroll from '@better-scroll/core'
const scrollContainerRef = ref<HTMLElement | null>(null)
const bs = ref<BScroll | null>(null)
onMounted(() => {
  if (scrollContainerRef.value) {
    bs.value = new BScroll(scrollContainerRef.value, {
      probeType: 3,
      click: true,
    })
  }
})
</script>
<style lang="scss" scoped></style>