<template>
  <div class="dashboard size-full flex gap-4 p-10 portrait:flex-col">
    <div ref="templateCardRef" class="flex flex-1 gap-4 text-white">
      <!-- 单一容器，使用 grid 布局 -->
      <div v-auto-animate class="grid grid-cols-4 grid-rows-3 gap-4 size-full">
        <div v-for="(card) in allCards" :key="card.id" :class="[
          'rounded-2xl bg-white/25 p-4 transition-all duration-300',
        ]" :style="getCardGridStyle(card)">
          <!-- <h2 class="pb-2 font-bold text-lg">{{ card.title }}</h2> -->
          <component :is='card.component' v-bind="card.componentProps"></component>
        </div>
      </div>
    </div>
    <div @click="router.push('/')" class="absolute top-2 right-2 rounded-3xl text-white text-sm ">
      {{ $t('mode.agentMode') }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, markRaw, onMounted, reactive, type Component } from 'vue'
// 工具
import { sendIntent } from '@/utils/AIOSService'
import autoAnimate from "@formkit/auto-animate"
import { useI18n } from 'vue-i18n'
// 组件
import Restaurants from './template/restaurants.vue'
import Photo from './template/photo.vue'
import Navigation from './template/navigation.vue'
import Music from './template/music.vue'
// import Weather from './template/weather.vue'
import ShopCom from './template/shop.vue'
import ProductCom from './template/product.vue'
import Chat from './template/chat.vue'
import Temp from './template/temp.vue'
import Calendar from './template/calendar.vue'
import Battery from './template/battery.vue'
import Fan from "@/assets/svg/fan.svg";
import BloodSugar from "@/assets/svg/blood-sugar.svg";
import { IntentType, modeType } from '@/types/enum'
import router from '@/router'
// 逻辑
const { t } = useI18n()
// 标记组件为非响应式
// const photoComponent = markRaw(Photo)
const NavigationComponent = markRaw(Navigation)
// const WeatherComponent = markRaw(Weather)
const MusicComponent = markRaw(Music)
const ShopComponent = markRaw(ShopCom)
const ProductComponent = markRaw(ProductCom)
const RestaurantsComponent = markRaw(Restaurants)
const ChatComponent = markRaw(Chat)
const TempComponent = markRaw(Temp)
const calendarComponent = markRaw(Calendar)
const batteryComponent = markRaw(Battery)

const templateCardRef = ref<HTMLElement | null>(null)
onMounted(() => {
  // 发送一个modeType
  sendIntent(IntentType.MODETYPE, { modeType: modeType.AIOSMODE })
  if (templateCardRef.value) autoAnimate(templateCardRef.value)
})

interface TemplateCard {
  column: [number, number] // [起始列索引, 占用列数]
  row: [number, number]    // [起始行索引, 占用行数]
  component: string | Component
  id: number
  title: string
  componentProps?: any
}

const allCards = reactive<TemplateCard[]>([
  {
    id: Date.now() + Math.random(),
    title: t('card.template'),
    // 从第1列开始占2列，从第1行开始占2行
    column: [1, 2],
    row: [1, 2],
    component: ChatComponent,
  },
  {
    id: Date.now() + Math.random(),
    title: t('card.template'),
    column: [1, 1],
    row: [3, 1],
    component: TempComponent,
    componentProps: {
      icon: Fan,
      title: '温度',
      value: '20.5',
      unit: '℃'
    }
  },
  {
    id: Date.now() + Math.random(),
    title: t('card.template'),
    column: [2, 1],
    row: [3, 1],
    component: TempComponent,
    componentProps: {
      icon: BloodSugar,
      title: '湿度',
      value: '60.5',
      unit: '%'
    }
  },
  {
    id: Date.now() + Math.random(),
    title: t('card.template'),
    column: [3, 2],
    row: [1, 1],
    component: batteryComponent,
  },
  {
    id: Date.now() + Math.random(),
    title: t('card.template'),
    column: [3, 2],
    row: [2, 2],
    component: calendarComponent,
  },
])
const getCardGridStyle = (card: TemplateCard,) => {
  // column: [起始列索引, 占用列数] 例如 [1, 2] 表示从第1列开始占2列
  // row: [起始行索引, 占用行数] 例如 [2, 2] 表示从第2行开始占2行
  const [startColumn, columnSpan] = card.column
  const [startRow, rowSpan] = card.row

  return {
    'grid-column': `${startColumn} / span ${columnSpan}`,
    'grid-row': `${startRow} / span ${rowSpan}`
  }
}

// 添加卡片
const pushTemplateCard = (newCard: TemplateCard) => {
  // 添加到所有卡片的开头
  allCards.unshift(newCard)
  // 处理溢出 - 移除超出容量的卡片
  while (needToRemoveCard()) {
    allCards.pop()
  }
}

// 判断是否需要移除卡片
const needToRemoveCard = () => {
  // 检查是否有卡片超出网格边界
  for (const card of allCards) {
    const [startColumn, columnSpan] = card.column
    const [startRow, rowSpan] = card.row

    // 检查是否超出3列4行的边界
    if (startColumn + columnSpan - 1 > 3 || startRow + rowSpan - 1 > 4) {
      return true
    }
  }

  // 检查卡片总数是否过多（可选的限制）
  return allCards.length > 6 // 例如最多6个卡片
}

</script>
<style lang="scss" scoped>
.dashboard {
  background-image: url('@/assets/image/banner.jpg');
  background-size: cover;
}

.hidden-scroll {
  /* IE 10+ */
  -ms-overflow-style: none;

  /* Firefox */
  scrollbar-width: none;
}

.hidden-scroll::-webkit-scrollbar {
  /* Webkit browsers */
  display: none;
}

.recorder-bg-1 {
  animation: recorderbg1 1s linear infinite;
  animation-delay: 1s;
}

.recorder-bg-2 {
  animation: recorderbg2 1s ease-in infinite;
  animation-delay: 1s;
}

@keyframes recorderbg1 {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.2);
  }

  100% {
    transform: scale(1);
  }
}

@keyframes recorderbg2 {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.5);
  }

  100% {
    transform: scale(1);
  }
}
</style>
