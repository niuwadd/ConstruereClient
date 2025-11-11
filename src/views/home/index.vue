<template>
  <div class="bg-linear-to-b from-[#E4DBED] via-[#E8EADE] to-[#ECDEDF] h-full overflow-hidden relative">
    <div class="size-full flex items-center justify-center relative">
      <div class="flex flex-col justify-between items-center absolute left-4 portrait:hidden">
        <ul class="flex gap-6 flex-col portrait:flex-row">
          <li v-for="item in agentList" class="size-16" :class="item.isActive ? '' : 'opacity-50'">
            <img :src="item.icon" alt="" />
          </li>
        </ul>
      </div>
      <img v-show="!isOpen" @click="openModal" class="bot-img w-[480px] portrait:w-[80%]" :src="blink" alt="">
      </img>
      <transition name="agentImg">
        <img v-show="isOpen" class="bot-img w-[180px]" :src="currentAgent?.icon">
      </transition>
    </div>
    <div @click="router.push('/dashboard')"
      class="absolute top-4 right-4 p-3 rounded-3xl text-gray-600 bg-white/30 backdrop-blur-2xl">
      {{ $t('mode.aiosMode') }}
    </div>
    <div class="absolute top-4 right-32 text-right">
      <Menu as="div" class="relative inline-block text-left">
        <div>
          <MenuButton
            class="inline-flex w-full justify-center rounded-md text-sm font-medium text-white hover:bg-black/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75">
            <Translation class="size-[40px] fill-gray-600" />
          </MenuButton>
        </div>
        <transition enter-active-class="transition duration-100 ease-out"
          enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100"
          leave-active-class="transition duration-75 ease-in" leave-from-class="transform scale-100 opacity-100"
          leave-to-class="transform scale-95 opacity-0">
          <MenuItems
            class="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
            <div class="px-1 py-1">
              <MenuItem v-slot="{ active }">
              <button :class="[
                active ? 'bg-linear-to-r from-[#6886fc] to-[#6958fb] text-white' : 'text-gray-900',
                'group flex w-full items-center rounded-md px-2 py-2 text-sm',
              ]" @click="changeLanguage('zh-CN')">
                简体中文
              </button>
              </MenuItem>
              <MenuItem v-slot="{ active }">
              <button :class="[
                active ? 'bg-linear-to-r from-[#6886fc] to-[#6958fb] text-white' : 'text-gray-900',
                'group flex w-full items-center rounded-md px-2 py-2 text-sm',
              ]" @click="changeLanguage('en-US')">
                English
              </button>
              </MenuItem>
            </div>
          </MenuItems>
        </transition>
      </Menu>
    </div>
  </div>
</template>
<script lang="ts" setup>

import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import { useAgent } from './composables/index'
import { IntentType } from '@/views/home/enum'
import { sendIntent } from '@/utils/AIOSService'
import Translation from '@/assets/svg/translation.svg'
import blink from '@/assets/image/Blink.gif'

const router = useRouter()
const isOpen = ref(false)
const { locale } = useI18n()
const { agentList, currentAgent } = useAgent()

const changeLanguage = (lang: string) => {
  locale.value = lang // 切换语言
  console.log(lang === 'zh-CN' ? 'cn' : 'en');
  sendIntent(IntentType.LANGUAGE, { language: lang === 'zh-CN' ? 'cn' : 'en' })
}
const openModal = () => {
  // router.push('/home-specialty')
  router.push('/home-base')
}

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
