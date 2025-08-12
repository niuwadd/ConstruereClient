<template>
  <div class="h-full p-8 bg-[#f3f2fb] flex flex-col gap-4">
    <!-- nav -->
    <div class="flex items-center justify-between">
      <div @click="router.go(-1)">
        <LeftIcon class="size-6" />
      </div>
      <div
        class="w-[50px] overflow-hidden border-2 rounded-full border-gray-300"
      >
        <img :src="Agent1" alt="" />
      </div>
      <div><MoreIcon class="size-6" /></div>
    </div>
    <!-- chat -->
    <div class="flex-1">
      <div
        class="bg-[#5f40a6] text-white p-4 w-[70%] rounded-br-2xl rounded-t-2xl"
      >
        <pre>
232132132121
        </pre>
      </div>
    </div>
    <!-- input -->
    <div class="bg-white rounded-2xl gap-2 flex justify-between py-4 px-3">
      <input
        class="flex-1 outline-none"
        type="text"
        placeholder="type a message..."
      />
      <SendFillIcon class="size-6" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import Agent1 from '@/assets/image/agent1.webp'
import LeftIcon from '@/assets/svg/left.svg'
import MoreIcon from '@/assets/svg/more.svg'
import SendFillIcon from '@/assets/svg/send-fill.svg'
const router = useRouter()
watchEffect(() => {})
</script>
<style lang="scss" scoped></style>
