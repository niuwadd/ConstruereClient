<template>
  <div class="h-full flex flex-col justify-between overflow-auto">
    <component class="size-[30px] fill-white shrink-0" :is='icon'></component>
    <div>
      <p class="text-white">{{ title }}</p>
      <p class="text-xl">{{ value }}<span>{{ unit }}</span></p>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import type { Component } from 'vue';
const props = defineProps<{ title: string, value: number, unit: string, icon: string | Component }>();
const { title, value, unit, icon } = props;
</script>
<style lang="scss" scoped></style>