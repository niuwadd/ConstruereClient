<template>
  <div @dblclick="changeMode" class="dashboard size-full bg-radial from-[#aaa6bc] from-15% to-[#616284]">
    <!-- <div @click="$router.push('/')" class="absolute top-2 right-2 rounded-3xl text-white text-sm ">
      {{ $t('mode.agentMode') }}
    </div> -->
    <!-- <div v-if="messageStore.messageList.length" @click="$router.replace('/dashboard/agentList')"
      class="absolute top-2 pl-10 rounded-3xl text-white text-sm">
      <p>{{ messageStore.messageList.length }}{{ t('agent.executing') }}</p>
    </div> -->
    <router-view></router-view>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
// import { useI18n } from 'vue-i18n'
// import { useMessageStore } from "@/store/message"

import HomePage from './homePage.vue'
import CardStacking from './layout/cardStacking.vue'
import HorizontalScroll from './layout/horizontalScroll.vue'
// const { t } = useI18n()
// const messageStore = useMessageStore()
const currentCom = ref(HomePage)
const components = {
  HomePage,
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
  // background: linear-gradient(#616284, #aaa6bc, #4e4e6c);
  // -background-color: #66667f;
  // background-image: url('@/assets/image/banner_1.png');
  // background-size: cover;
}
</style>