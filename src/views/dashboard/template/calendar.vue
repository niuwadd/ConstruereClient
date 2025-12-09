<template>
  <vue-cal class="vuecal--date-picker rounded-2xl overflow-hidden" xsmall hide-view-selector :time="false"
    active-view="month" :disable-views="['week']" locale="zh-cn">
  </vue-cal>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'

const isClient = ref(false);

onMounted(() => {
  isClient.value = true;
});
</script>

<style lang="scss" scoped>

</style>