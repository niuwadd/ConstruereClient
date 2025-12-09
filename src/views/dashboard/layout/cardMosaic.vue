<!-- 卡片马赛克布局 -->
<template>
  <div class="size-full flex gap-4 p-10 portrait:flex-col">
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
  </div>
</template>

<script lang="ts" setup>
import { ref, markRaw, onMounted, reactive, watchEffect, type Component } from 'vue'
// 工具
import { sendIntent, socketState } from '@/utils/AIOSService'
import autoAnimate from "@formkit/auto-animate"
import { useI18n } from 'vue-i18n'
// 组件
import Chat from '../template/chat.vue'
import Temp from '../template/temp.vue'
import Calendar from '../template/calendar.vue'
import Battery from '../template/battery.vue'
import Music from '../template/music.vue'
import Photo from '../template/photo.vue'
import Navigation from '../template/navigation.vue'
import Restaurants from '../template/restaurants.vue'
import Fan from "@/assets/svg/fan.svg";
import BloodSugar from "@/assets/svg/blood-sugar.svg";
import { IntentType, modeType, TaskType, ShowRightType } from '@/types/enum'
// 逻辑
const { t } = useI18n()
// 标记组件为非响应式
const ChatComponent = markRaw(Chat)
const TempComponent = markRaw(Temp)
const CalendarComponent = markRaw(Calendar)
const BalendarComponent = markRaw(Battery)
const PhotoComponent = markRaw(Photo)
const NavigationComponent = markRaw(Navigation)
const MusicComponent = markRaw(Music)
const RestaurantsComponent = markRaw(Restaurants)

const templateCardRef = ref<HTMLElement | null>(null)
onMounted(() => {
  // 发送一个modeType
  if (templateCardRef.value) autoAnimate(templateCardRef.value)
  return
  sendIntent(IntentType.MODETYPE, { modeType: modeType.AIOSMODE })
})

watchEffect(async () => {
  try {
    if (!socketState.message) return
    console.log(JSON.parse(socketState.message))
    const { type, msg, id, token, nodeTitle, content, srType, imageUrl } = JSON.parse(socketState.message)
    const tokenId = id + token
    // 如果消息为空，不执行后面代码
    if (msg === '') return
    // 当接收到不同类型时的处理
    switch (type) {
      case TaskType.SHOWR:
        switch (srType) {
          case ShowRightType.IMAGE:
            const cardFind = allCards.find(item => item.id === tokenId)
            if (cardFind) {
              cardFind.componentProps.photoList.push(
                {
                  description: "",
                  image: imageUrl,
                  title: content
                }
              )
            } else {
              allCards.push(
                {
                  title: nodeTitle,
                  id: tokenId,
                  column: [1, 2],
                  row: [1, 1],
                  component: PhotoComponent,
                  componentProps: {
                    photoList: [
                      {
                        description: "",
                        image: imageUrl,
                        title: content
                      }
                    ]
                  },
                }
              )
            }
            break;
          case ShowRightType.NAVIGATE:
            const { location, des } = JSON.parse(content)
            pushTemplateCard({
              id: token,
              title: t('card.navigation'),
              column: [1, 2],
              row: [1, 1],
              component: NavigationComponent,
              componentProps: {
                location,
                des
              },
            })
            break
          case ShowRightType.MUSIC:
            pushTemplateCard({
              id: token,
              title: t('card.music'),
              column: [1, 2],
              row: [1, 1],
              component: MusicComponent,
              componentProps: {
                musicUrl: content,
                musicName: ''
              },
            })
            break
          case ShowRightType.RESTAURANT:
            pushTemplateCard({
              id: token,
              title: t('card.shop'),
              column: [3, 1],
              row: [1, 3],
              component: RestaurantsComponent,
              componentProps: {
                restaurantsList: JSON.parse(content)
              },
            })
            break
        }
        break
    }
  } catch (error) {
    console.error('不是一个有效的JSON数据', error)
    const p = socketState.message.split(',')
    console.log(p)
  }
})
interface TemplateCard {
  column: [number, number] // [起始列索引, 占用列数]
  row: [number, number]    // [起始行索引, 占用行数]
  component: string | Component
  id: number
  title?: string
  componentProps?: any
}

const allCards = reactive<TemplateCard[]>([
  {
    id: Date.now() + Math.random(),
    // 从第1列开始占2列，从第1行开始占2行
    column: [1, 2],
    row: [1, 2],
    component: ChatComponent,
  },
  {
    id: Date.now() + Math.random(),
    column: [1, 1],
    row: [3, 1],
    component: TempComponent,
    componentProps: {
      icon: Fan,
      title: '温度',
      value: 20.5,
      unit: '℃'
    }
  },
  {
    id: Date.now() + Math.random(),
    column: [2, 1],
    row: [3, 1],
    component: TempComponent,
    componentProps: {
      icon: BloodSugar,
      title: '湿度',
      value: 60,
      unit: '%'
    }
  },
  {
    id: Date.now() + Math.random(),
    column: [3, 2],
    row: [1, 1],
    // component: Music,
    component: BalendarComponent,
  },
  {
    id: Date.now() + Math.random(),
    column: [3, 2],
    row: [2, 2],
    component: CalendarComponent,
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
  console.log(allCards);
  // 处理溢出 - 移除超出容量的卡片
  /* while (needToRemoveCard()) {
    allCards.pop()
  } */
}

// 判断是否需要移除卡片
/* const needToRemoveCard = () => {
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
} */

</script>
<style lang="scss" scoped>
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
