<template>
  <div class="h-full flex flex-col justify-between">
    <component class="size-[30px] fill-white" :is='icon'></component>
    <div>
      <p class="text-white">{{ title }}</p>
      <p class="text-xl">{{ value }}<span>{{ unit }}</span></p>
    </div>
  </div>
</template>
<script lang="ts" setup>
const props = defineProps<{ title: string, value: number, unit: string, icon: string }>();
const { title, value, unit, icon } = props;
</script>
<style lang="scss" scoped></style>