<template>
  <div class="flex flex-col gap-4 font-bold">
    <template v-for="(item, index) in agentMessageList" :key="index">
      <!-- user -->
      <div
        class="bg-linear-to-r from-[#6886fc] to-[#6958fb] text-white p-4 max-w-[70%] rounded-bl-3xl rounded-t-3xl self-end"
        v-if="item.type === 'user'">
        <pre class="whitespace-break-spaces font-[auto] text-sm">{{ item.text }}</pre>
      </div>
      <!-- agent -->
      <div
        class="bg-white/60 text-gray-600 p-4 max-w-[100%] rounded-tr-3xl rounded-b-3xl self-start flex items-start gap-2"
        v-else-if="item.type === 'agent'">
        <img class="w-5" :src="ChatBot">
        <div v-if="item.messageType === MessageType.IMAGE" class="w-[calc(100%-30px)] max-w-[300px]">
          <img class="w-full" @load="onImageLoad" :src="typeof item.text === 'string' ? item.text : ''">
        </div>
        <div v-else-if="item.loading" class="flex items-center self-center gap-2">
          <div class="size-1.5 bg-[#2EDAF9] rounded-full loading"></div>
          <div class="size-1.5 bg-[#FEA6FF] rounded-full loading2"></div>
          <div class="size-1.5 bg-[#FFDE9C] rounded-full loading3"></div>
        </div>
        <!-- 当数据是菜单数组 -->
        <div v-else-if="item.messageType === MessageType.JSON_MENU"
          class="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
          <div class="flex flex-col gap-2 rounded-2xl shadow-[0_0_10px_4px_rgba(0,0,0,0.1)]"
            v-for="product in item.text as Product[]">
            <div class="w-full min-h-[100px] flex-1">
              <img class="w-full rounded-2xl" @load="onImageLoad" :src="product.logo" alt="">
            </div>
            <h3 class="text-sm px-4">{{ product.productName }}</h3>
            <div class="flex justify-between items-end px-4 pb-4">
              <p class="text-xs w-[70%] truncate">{{ product.productContent }}</p>
              <p class="text-xs">{{ product.productPrice }}￥</p>
            </div>
          </div>
        </div>
        <!-- 当数据是饭店数组 -->
        <div v-else-if="item.messageType === MessageType.JSON_RESTAURANT"
          class="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
          <div class="flex flex-col gap-2 rounded-2xl shadow-[0_0_10px_4px_rgba(0,0,0,0.1)]"
            v-for="shop in item.text as Shop[]">
            <div class="w-full min-h-[100px] flex-1">
              <img class="w-full rounded-2xl" @load="onImageLoad" :src="shop.logo" alt="">
            </div>
            <h3 class="text-sm px-4">{{ shop.shopName }}</h3>
            <div class="flex justify-between items-end px-4 pb-4">
              <p class="text-xs w-[70%] truncate">{{ shop.shopDescription }}</p>
            </div>
          </div>
        </div>
        <!-- 当数据是餐厅数组 -->
        <div v-else-if="item.messageType === MessageType.JSON_RESTAURANT_X"
          class="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
          <div
            v-if="Array.isArray(item.text)"
            class="flex flex-col gap-2 rounded-2xl shadow-[0_0_10px_4px_rgba(0,0,0,0.1)]"
            v-for="restaurant in item.text as Restaurant[]"
            :key="restaurant.storeId"
          >
            <div class="w-full min-h-[100px] flex-1">
              <img class="w-full rounded-2xl" @load="onImageLoad" :src="restaurant.logo" alt="">
            </div>
            <h3 class="text-sm px-4">{{ restaurant.storeName }}</h3>
            <div class="flex justify-between items-end px-4 pb-4">
              <p class="text-xs w-[70%] truncate">{{ restaurant.address }}</p>
            </div>
          </div>
        </div>
        <!-- 当数据是html -->
        <div v-else-if="item.messageType === MessageType.HTML" v-html="item.text"></div>
        <!-- 当数据是mackdown -->
        <!--  @onHtmlChanged="onHtmlChanged" -->
        <div v-else-if="item.messageType === MessageType.MARKDOWN && typeof item.text === 'string'">
          <MdPreview class="px-2 bg-[#f8f8f6]!" v-model="item.text" />
        </div>
        <pre v-else class="whitespace-break-spaces font-[auto] text-sm">{{ item.text }}</pre>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { Message, Product, Shop, Restaurant } from '../types'
import { MessageType } from '../enum'
import { toRef, onMounted } from 'vue'
import { MdPreview } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import ChatBot from '@/assets/image/agent_default.png'
const props = defineProps({
  agentMessageList: Array<Message>,
})
const emit = defineEmits(['imageLoad'])

onMounted(() => {
})
const agentMessageList = toRef(props, 'agentMessageList')
const onImageLoad = () => {
  emit('imageLoad')
}
/* const onHtmlChanged = () => {
  const previewContainer = document.querySelector('.md-editor-preview');
  const images = previewContainer?.querySelectorAll('img');
  images?.forEach(image => {
    image.addEventListener('load', () => {
      emit('imageLoad')
    })
  });
} */
</script>

<style lang="scss" scoped>
div {
  // 微软雅黑
  font-family: 'Microsoft YaHei';
}

.loading {
  animation: wiggle 1s ease-in-out infinite;
}

.loading2 {
  animation: wiggle 1s ease-in-out infinite;
  animation-delay: 0.3s;
}

.loading3 {
  animation: wiggle 1s ease-in-out infinite;
  animation-delay: 0.5s;
}

@keyframes wiggle {
  0% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-4px);
  }

  100% {
    transform: translateY(0);
  }
}
</style>
