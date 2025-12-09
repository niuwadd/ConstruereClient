<template>
  <div>
    <lightning class="size-[30px] fill-white pb-2" />
    <div class="flex flex-col gap-y-2">
      <div class="flex justify-between items-center">
        <p>剩余电量</p>
        <p><span class="text-4xl">76</span> %</p>
      </div>
      <div class="h-1 bg-linear-to-r from-[#6886fc] to-[#6958fb]"></div>
      <div class="flex justify-between items-center">
        <p>0%</p>
        <p>100%</p>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import lightning from "@/assets/svg/lightning.svg";

</script>
<style lang="scss" scoped></style>