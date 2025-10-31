<template>
  <div>
    <div class="flex justify-center">
      <img :src="Music" alt="">
    </div>
    <div class="flex justify-center py-4">
      <Sonic class="w-[180px]" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import Music from '@/assets/image/music.png'
import Sonic from '@/assets/svg/sonic.svg'
</script>
<style lang="scss" scoped></style>