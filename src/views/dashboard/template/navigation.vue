<template>
  <div class="h-[calc(100%-24px)] flex flex-col gap-2">
    <MapContainer :startPoint="location" :endPoint="des" @updateDistance="updateDistance" @updateTime="updateTime"
      class="rounded-xl overflow-hidden" />
    <div class="bg-gray-500 rounded-xl p-4 text-xl">
      全程：{{ distance }} {{ time }}
    </div>
  </div>
</template>
<script setup lang="ts">
import { toRefs, ref } from 'vue'
import MapContainer from '@/components/MapContainer.vue'
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