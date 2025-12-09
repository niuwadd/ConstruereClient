<!-- 卡片网格布局 -->
<template>
  <div class="h-full p-10 flex flex-col gap-4">
    <Chat class="rounded-2xl bg-white/25 p-4 h-[200px]" />
    <div class="flex flex-1 gap-4">
      <!-- <div class="rounded-2xl bg-white/25 p-4 flex-1" v-for="item in 2"></div> -->
    </div>
  </div>
</template>
<script lang="ts" setup>
import Chat from '../template/chat.vue'
</script>
<style lang="scss" scoped></style>