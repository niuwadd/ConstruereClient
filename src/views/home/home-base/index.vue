<template>
  <div class="bg-linear-to-b from-[#E4DBED] via-[#E8EADE] to-[#ECDEDF] h-full overflow-hidden relative">
    <div class="size-full flex items-center justify-center relative">
      <div class="flex flex-col justify-between items-center absolute left-4">
        <ul class="flex gap-6 flex-col portrait:flex-row">
          <li v-for="item in agentList" class="size-16" :class="item.isActive ? '' : 'opacity-50'">
            <img :src="item.icon" alt="" />
          </li>
        </ul>
      </div>
      <img v-show="!isOpen" @click="openModal" class="bot-img w-[480px]" :src="currentAgent?.icon" alt=""></img>
      <transition name="agentImg">
        <img v-show="isOpen" class="bot-img w-[180px]" :src="currentAgent?.icon">
      </transition>
    </div>
    <div @click="router.push('/dashboard')" class="absolute top-4 right-4 p-3 rounded-3xl text-gray-600 bg-white/30 backdrop-blur-2xl">
      AIOS模式
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Agent_medical from '@/assets/image/agent_medical.png'
import Agent_repair from '@/assets/image/agent_repair.png'
import Agent_takeout from '@/assets/image/agent_takeout.png'
import Agent_chat from '@/assets/image/agent_chat.png'
import Blink from '@/assets/image/Blink.gif'
import type { Agent } from '../types'
import { AppName } from '../enum'
const router = useRouter()
const isOpen = ref(false)
// 智能体
const agentList: Agent[] = [
  {
    name: '智能体',
    title: '智能体',
    title_1: '我是您的智能体',
    description: 'Construere：唤醒硬件，智联万物',
    icon: Blink,
    isActive: true,
  },
  {
    name: AppName.CHAT,
    title: '社交助手智能体',
    title_1: '我是您的社交助手',
    description: '我可以为你做',
    // description: '通过摄像头进行拍照，通过AI分析照片，并给出发生到的朋友圈文案',
    icon: Agent_chat,
    isActive: false,
  },
  {
    name: AppName.MEDICAL,
    title: '医疗助理智能体',
    title_1: '我是您的医疗助理',
    description: '我可以为你做',
    icon: Agent_medical,
    isActive: false,
  },
  {
    name: AppName.TAKEOUT,
    title: '点餐助手智能体',
    title_1: '我是您的点餐助手',
    // description: '通过语音交流进行点餐，通过AI分析点餐记录，并给出点餐建议',
    description: '我可以为你做',
    icon: Agent_takeout,
    isActive: false,
  },
  {
    name: AppName.REPAIR,
    title: '车辆健康智能体',
    title_1: '我是您的车辆健康管家',
    description: '我可以为你做',
    icon: Agent_repair,
    isActive: false,
  },
]
const openModal = () => {
  router.push('/home-base')
}
// 当前智能体
const currentAgent = ref<Agent | null>(agentList[0])
</script>
<style lang="scss" scoped>
.container {
  /* IE 10+ */
  -ms-overflow-style: none;

  /* Firefox */
  scrollbar-width: none;
}

.container::-webkit-scrollbar {
  /* Webkit browsers */
  display: none;
}

.agentImg-leave-to,
.agentImg-enter-from {
  opacity: 0;
  transform: translateY(100px);
}

.agentImg-leave-active,
.agentImg-enter-active {
  transition: all 0.3s ease;
}
</style>
