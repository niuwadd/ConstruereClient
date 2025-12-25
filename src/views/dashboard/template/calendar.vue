<template>
  <vue-cal class="vuecal--date-picker rounded-2xl overflow-hidden" xsmall hide-view-selector :time="false"
    active-view="month" :disable-views="['week']" :locale="getLocale">
  </vue-cal>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'

const isClient = ref(false);

onMounted(() => {
  isClient.value = true;
});
const getLocale = computed(() => {
  const language = sessionStorage.getItem('language');
  console.log(language);

  return language === 'zh-CN' ? 'zh-cn' : 'en';
});
</script>

<style lang="scss" scoped>
.vuecal__cell--today>.vuecal__cell-content {
  border-color: red;
}
</style>