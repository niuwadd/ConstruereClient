<template>
  <div class="container">
    <div class="stack-container">
      <div class="counter">{{ currentSlide + 1 }} / {{ slides.length }}</div>
      <Swiper :direction="'vertical'" :slides-per-view="1" :space-between="0" :speed="600" :effect="'slide'"
        :grab-cursor="true" :mousewheel="true" :initial-slide="slides.length - 1" :long-swipes-ratio="0.1"
        :short-swipes="true" :observer="true" :observe-slide-children="true" :observe-parents="true" @swiper="onSwiper"
        @slide-change="onSlideChange" class="swiper">
        <SwiperSlide v-for="(slide, index) in slides" :key="slide.id || index">
          <img :src="slide.image" :alt="slide.title">
          <div class="slide-content">
            <h3 class="slide-title">{{ slide.title }}</h3>
            <p class="slide-desc">{{ slide.description }}</p>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import type { Swiper as SwiperType } from 'swiper'
import 'swiper/swiper-bundle.css'

const props = defineProps<{
  photoList: any[]
}>()

const slides = ref(props.photoList)
const currentSlide = ref(0)
const swiperInstance = ref<SwiperType | null>(null)

const onSwiper = (swiper: SwiperType) => {
  swiperInstance.value = swiper
  console.log('Swiper实例:', swiper)
}

const onSlideChange = (swiper: SwiperType) => {
  currentSlide.value = swiper.activeIndex
}

// 监听数组变化
watch(() => slides.value.length, async (newLength, oldLength) => {
  if (newLength > oldLength) {
    await nextTick()

    if (swiperInstance.value) {
      // 直接滑动到最新的一项
      swiperInstance.value.slideTo(newLength - 1, 300)
      console.log('滑动到最新项:', newLength - 1)
    }
  }
})

// 监听photoList prop的变化
watch(() => props.photoList, (newList) => {
  slides.value = newList
}, { deep: true })
</script>

<style scoped lang="scss">
.container {
  width: 100%;
}

.stack-container {
  position: relative;
  width: 100%;
  height: 200px;
  margin: 0 auto;
  overflow: hidden;
  padding: 10px;
}

.swiper {
  width: 100%;
  height: 100%;
  border-radius: 16px;
  overflow: visible;
}

.swiper-slide {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  transition: transform 0.5s ease, opacity 0.5s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.swiper-slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.slide-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, transparent 100%);
  color: white;
  padding: 20px;
}

.slide-title {
  font-size: 1.5rem;
  margin-bottom: 5px;
}

.slide-desc {
  font-size: 0.9rem;
  opacity: 0.8;
}

/* 自定义Swiper样式 */
.swiper-vertical>.swiper-wrapper {
  flex-direction: column;
}

/* 堆叠效果 */
/* .swiper-slide:not(.swiper-slide-active) {
  opacity: 0.7;
  transform: scale(0.9);
} */

.swiper-slide-active {
  z-index: 10;
}

.swiper-slide-prev {
  transform: translateY(100px) scale(0.95);
  opacity: 0.7;
  z-index: 1;
}

.swiper-slide-next {
  transform: translateY(-100px) scale(0.95);
  opacity: 0.7;
  z-index: 1;
}

/* 控制按钮 */
.counter {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  z-index: 10;
  backdrop-filter: blur(5px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .stack-container {
    height: 400px;
  }

  button {
    padding: 12px 25px;
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .stack-container {
    height: 350px;
  }

  .slide-content {
    padding: 15px;
  }

  .slide-title {
    font-size: 1.2rem;
  }

  .controls {
    flex-direction: column;
    align-items: center;
  }

  button {
    width: 80%;
    justify-content: center;
  }
}
</style>