<template>
  <div class="h-[calc(100%-24px)] flex flex-col gap-2 flex-1">
    <MapContainer :startPoint="location" :endPoint="des" @updateDistance="updateDistance" @updateTime="updateTime"
      class="rounded-xl overflow-hidden" />
    <div class="bg-gray-500 rounded-xl p-2 text-base">
      <p>{{ t('unit.distance') }}：</p>
      <p class="break-all">{{ distance }}</p>
      <p class="break-all">{{ time }}</p>
    </div>
  </div>
</template>
<script setup lang="ts">
import { toRefs, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import MapContainer from '@/components/MapContainer.vue'
const { t } = useI18n()
const distance = ref('')
const time = ref('')
const props = defineProps<{
  location: string
  des: string
}>()
const { location, des } = toRefs(props)
const updateDistance = (data: string) => {
  console.log('distance', data)
  distance.value = data
}
const updateTime = (data: string) => {
  console.log('time', data)
  time.value = data
}
</script>
<style scoped lang="scss"></style>