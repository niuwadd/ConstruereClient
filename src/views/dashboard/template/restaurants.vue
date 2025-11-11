<template>
  <div class="h-[calc(100%-32px)]">
    <div class="hidden-scroll grid grid-cols-1 gap-4 h-[calc(100%-32px)] overflow-auto">
      <div class="flex flex-col gap-2 rounded-2xl shadow-[0_0_10px_4px_rgba(0,0,0,0.1)]"
        v-for="item in restaurantsList">
        <div class="w-full min-h-[100px] flex-1">
          <img class="w-full rounded-t-2xl" :src="item.logo" alt="">
        </div>
        <h3 class="text-sm px-4">{{ item.storeName }}</h3>
        <div class="flex justify-between items-end px-4 pb-4">
          <p class="text-xs w-[70%] truncate">{{ item.address }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { toRefs } from 'vue'
const props = defineProps<{
  restaurantsList: any[]
}>()
const { restaurantsList } = toRefs(props)
</script>
<style lang="scss" scoped></style>