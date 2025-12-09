<template>
  <div @dblclick="changeMode" class="dashboard size-full">
    <div @click="$router.push('/')" class="absolute top-2 right-2 rounded-3xl text-white text-sm ">
      {{ $t('mode.agentMode') }}
    </div>
    <div @click="$router.push('/dashboard/agentList')" v-if="messageStore.messageList.length" class="absolute top-2 pl-10 rounded-3xl text-white text-sm">
      当前有{{messageStore.messageList.length}}个Agent正在执行
    </div>
    <router-view></router-view>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { useMessageStore } from "@/store/message"
import HomePage from './homePage.vue'
import CardMosaic from './layout/cardMosaic.vue'
import CardGrid from './layout/cardGrid.vue'
import CardQuartered from './layout/cardQuartered.vue'
import CardStacking from './layout/cardStacking.vue'
import HorizontalScroll from './layout/horizontalScroll.vue'
const messageStore = useMessageStore()
const currentCom = ref(HomePage)
const components = {
  HomePage,
  CardMosaic,
  CardGrid,
  CardQuartered,
  CardStacking,
  HorizontalScroll
}
const changeMode = (e: Event) => {
  const value = (e.target as HTMLSelectElement).value as keyof typeof components;
  currentCom.value = components[value]
}
</script>
<style lang="scss" scoped>
.dashboard {
  background-image: url('@/assets/image/banner.jpg');
  background-size: cover;
}
</style>