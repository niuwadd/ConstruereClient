<template>
  <div>
    <div class="flex justify-center">
      <img :src="Weathe" alt=""></img>
    </div>
    <p class="py-4">{{ templateWeather }}</p>
    <!-- <div v-show="hiddenTemplate" class="relative flex flex-col gap-4 w-[50%]">
        <transition name="template1">
          <div v-if="!templateShop.length" class="rounded-2xl bg-white/25 p-4 h-[100%]">
            <h3 class="font-bold pb-2">天气预报</h3>
            <div class="flex justify-center">
              <img :src="Weathe" alt=""></img>
            </div>
            <p class="py-4">{{ templateWeather }}</p>
          </div>
          <div v-else-if="templateShop.length" class="rounded-2xl bg-white/25 p-4 h-[100%]">
            <h3 class="font-bold pb-2">餐厅推荐</h3>
            <div class="hidden-scroll grid grid-cols-2 gap-4 h-[calc(100%-32px)] overflow-auto">
              <div class="flex flex-col gap-2 rounded-2xl shadow-[0_0_10px_4px_rgba(0,0,0,0.1)]"
                v-for="item in templateShop">
                <div class="w-full min-h-[100px] flex-1">
                  <img class="w-full rounded-t-2xl" :src="item.logo" alt="">
                </div>
                <h3 class="text-sm px-4">{{ item.shopName }}</h3>
                <div class="flex justify-between items-end px-4 pb-4">
                  <p class="text-xs w-[70%] truncate">{{ item.shopDescription }}</p>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
      <div v-show="hiddenTemplate" class="relative flex flex-col gap-4 w-[50%]">
        <transition name="template1">
          <div v-if="!templateProduct.length" class="rounded-2xl bg-white/25 p-4 h-[100%]">
            <h3 class="font-bold pb-2">音乐播放</h3>
            <div class="flex justify-center">
              <img :src="Music" alt="">
            </div>
            <div class="flex justify-center py-4">
              <Sonic class="w-[180px]" />
            </div>
          </div>
          <div v-else-if="templateProduct.length" class="rounded-2xl bg-white/25 p-4 h-[100%]">
            <h3 v-if="templateProduct.length" class="font-bold pb-2">菜单</h3>
            <div class="hidden-scroll grid grid-cols-2 gap-4 h-[calc(100%-32px)] overflow-auto">
              <div class="flex flex-col gap-2 rounded-2xl shadow-[0_0_10px_4px_rgba(0,0,0,0.1)]"
                v-for="item in templateProduct">
                <div class="w-full min-h-[100px] flex-1">
                  <img class="w-full rounded-t-2xl" :src="item.logo" alt="">
                </div>
                <h3 class="text-sm px-4">{{ item.productName }}</h3>
                <div class="flex justify-between items-end px-4 pb-4">
                  <p class="text-xs w-[70%] truncate">{{ item.productContent }}</p>
                  <p class="text-xs">{{ item.productPrice }}￥</p>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div> -->
  </div>
</template>
<script setup lang="ts">
import Weathe from '@/assets/image/weathe.png'
import { toRefs } from 'vue';
const props = defineProps<{
  templateWeather: string
}>()
const { templateWeather } = toRefs(props)
console.log('templateWeather---', templateWeather.value);

</script>
<style scoped lang="scss"></style>