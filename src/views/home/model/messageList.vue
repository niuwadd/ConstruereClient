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
        class="bg-white/60 text-gray-600 p-4 max-w-[70%] rounded-tr-3xl rounded-b-3xl self-start flex items-start gap-2"
        v-else-if="item.type === 'agent'">
        <img class="w-5" :src="ChatBot">
        <img v-if="item.img && typeof item.text === 'string'" class="w-[calc(100%-30px)] max-w-[300px]"
          :src="item.text">
        <div v-else-if="item.loading" class="flex items-center self-center gap-2">
          <div class="size-1.5 bg-[#2EDAF9] rounded-full loading"></div>
          <div class="size-1.5 bg-[#FEA6FF] rounded-full loading2"></div>
          <div class="size-1.5 bg-[#FFDE9C] rounded-full loading3"></div>
        </div>
        <div v-else-if="Array.isArray(item.text)" class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div class="flex flex-col gap-2 rounded-2xl shadow-[0_0_10px_4px_rgba(0,0,0,0.1)]"
            v-for="product in item.text">
            <img class="w-full rounded-2xl" :src="product.logo" alt="">
            <h3 class="text-sm px-4">{{ product.productName }}</h3>
            <div class="flex justify-between items-end px-4 pb-4">
              <p class="text-xs w-[70%]">{{ product.productContent }}</p>
              <p class="text-xs">{{ product.productPrice }}￥</p>
            </div>
          </div>
        </div>
        <pre v-else class="whitespace-break-spaces font-[auto] text-sm">{{ item.text }}</pre>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">

import type { Message } from '../types'
import { toRef } from 'vue'
import ChatBot from '@/assets/image/agent_default.png'
const props = defineProps({
  agentMessageList: Array<Message>,
})
const agentMessageList = toRef(props, 'agentMessageList')
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
