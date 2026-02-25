<!-- 水平滚动布局 -->
<template>
  <div class="size-full overflow-x-auto">
    <!--  ref="scrollContainerRef" -->
    <div class="flex gap-4 w-max h-full">
      <Chat class=" rounded-2xl bg-white/25" />
      <!-- 使用 w-max 让容器宽度适应内容 -->
      <div class="w-[300px] rounded-2xl bg-white/25" v-for="card in allCards" :key="card.id">
        <component :is='card.component' v-bind="card.componentProps"></component>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, markRaw, reactive } from 'vue'
import BScroll from '@better-scroll/core'
import Chat from '../template/chat.vue'
import Photo from '../template/photo.vue'
const PhotoComponent = markRaw(Photo)
const scrollContainerRef = ref<HTMLElement | null>(null)
const bs = ref<BScroll | null>(null)
onMounted(() => {
  if (scrollContainerRef.value) {
    bs.value = new BScroll(scrollContainerRef.value, {
      probeType: 3,
      click: true,
    })
  }
})
const allCards = reactive([
  {
    id: '2',
    component: PhotoComponent,
    componentProps: {
      photoList: [
        {
          description: '',
          image: 'https://picsum.photos/300/500',
          title: ''
        }
      ]
    }
  },
  {
    id: '4',
    component: PhotoComponent,
    componentProps: {
      photoList: [
        {
          description: '',
          image: 'https://picsum.photos/300/500',
          title: ''
        }
      ]
    }
  }
])
</script>
<style lang="scss" scoped></style>