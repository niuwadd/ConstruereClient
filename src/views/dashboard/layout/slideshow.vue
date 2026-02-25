<!-- 轮播图布局 -->
<template>
  <div class="container">
    <div class="stack-container">
      <Swiper class="swiper">
        <SwiperSlide>
          <ChatComponent class="rounded-2xl bg-white/25 p-2 transition-all duration-300 w-full" />
        </SwiperSlide>
        <SwiperSlide v-for="card in allCards" :key="card.id">
          <div class="rounded-2xl bg-white/25 transition-all duration-300 size-full">
            <component :is='card.component' v-bind="card.componentProps"></component>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, markRaw, onMounted } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import Photo from '../template/photo.vue'
import Navigation from '../template/navigation.vue'
const PhotoComponent = markRaw(Photo)
const NavigationComponent = markRaw(Navigation)
import 'swiper/swiper-bundle.css'
import Chat from '../template/chat.vue'
const ChatComponent = markRaw(Chat)
onMounted(() => {
  setInterval(() => {

  }, 1000);
})
const allCards = reactive([
  {
    id: '6',
    column: [3, 1],
    row: [1, 3],
    component: NavigationComponent,
    componentProps: {
      location: '3150 Paradise Rd, Las Vegas',
      des: 'University Medical center of Southern Nevada'
    },
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

<style scoped lang="scss">
.container {
  width: 100%;
  height: 100%;
}

.stack-container {
  position: relative;
  width: 100%;
  height: 100%;
  // height: calc(100% - 2rem);
  margin: 0 auto;
  overflow: hidden;
  // padding: 10px;
}

.swiper {
  width: 100%;
  height: 100%;
}

.swiper-slide {
  text-align: center;
  /* Center slide text vertically */
  display: flex;
  justify-content: center;
  align-items: center;
}

.swiper-slide img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>