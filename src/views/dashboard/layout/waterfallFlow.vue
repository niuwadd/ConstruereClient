<!-- 瀑布流布局 -->
<template>
  <div class="size-full flex flex-col gap-2">
    <div class="flex-1 flex flex-col gap-2">
      <div v-for="(card) in allCards" :key="card.id"
        class="rounded-2xl bg-white/25 p-2 transition-all duration-300 h-1/2 text-white">
        <component :is='card.component' v-bind="card.componentProps"></component>
      </div>
    </div>
    <div class="h-[200px]">
      <Chat class="rounded-2xl bg-white/25 p-2 transition-all duration-300" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { markRaw, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import Fan from '@/assets/svg/fan.svg'
import Chat from '../template/chat.vue'
import Temp from '../template/temp.vue'
import Photo from '../template/photo.vue'
const TempComponent = markRaw(Temp)
const PhotoComponent = markRaw(Photo)
const { t } = useI18n()
const allCards = reactive([
  {
    id: '2',
    column: [1, 1],
    row: [3, 1],
    component: TempComponent,
    componentProps: {
      icon: Fan,
      title: t('card.temperature'),
      value: 20.5,
      unit: '℃'
    }
  },
  {
    id: '4',
    column: [3, 1],
    row: [2, 1],
    component: PhotoComponent,
    componentProps: {
      photoList: [
        {
          description: '',
          image: 'https://picsum.photos/760/130',
          title: ''
        }
      ]
    }
  }
])
</script>
<style lang="scss" scoped></style>