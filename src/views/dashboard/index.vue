<template>
  <div @dblclick="changeMode" class="dashboard size-full">
    <div @click="$router.push('/')" class="absolute top-2 right-2 rounded-3xl text-white text-sm ">
      {{ $t('mode.agentMode') }}
    </div>
    <div v-if="messageStore.messageList.length" @click="$router.replace('/dashboard/agentList')" class="absolute top-2 pl-10 rounded-3xl text-white text-sm">
      <p>{{ messageStore.messageList.length }}{{ t('agent.executing') }}</p>
    </div>
    <router-view></router-view>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessageStore } from "@/store/message"
import HomePage from './homePage.vue'
import CardMosaic from './layout/cardMosaic.vue'
import CardGrid from './layout/cardGrid.vue'
import CardQuartered from './layout/cardQuartered.vue'
import CardStacking from './layout/cardStacking.vue'
import HorizontalScroll from './layout/horizontalScroll.vue'
const { t } = useI18n()
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
  background-image: url('@/assets/image/banner_3.jpg');
  background-size: cover;
}
</style>