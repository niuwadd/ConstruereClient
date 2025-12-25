<!-- 卡片马赛克布局 -->
<template>
  <div class="size-full flex gap-4 p-10 portrait:flex-col">
    <div ref="templateCardRef" class="flex flex-1 gap-4 text-white">
      <!-- 单一容器，使用 grid 布局 -->
      <div v-auto-animate class="grid grid-cols-4 grid-rows-3 gap-4 size-full">
        <div v-for="(card) in animateCards" :key="card.id" :class="[
          'rounded-2xl bg-white/25 p-4 transition-all duration-300',
        ]" :style="getCardGridStyle(card)">
          <!-- <h2 class="pb-2 font-bold text-lg">{{ card.title }}</h2> -->
          <component :is='card.component' v-bind="card.componentProps"></component>
        </div>
      </div>
    </div>
    <!-- <button @click="viewStore" class="absolute top-0 right-20">click</button> -->
  </div>
</template>

<script lang="ts" setup>
import { ref, markRaw, onMounted, reactive, watch, computed, type Component } from 'vue'
// 工具
import { sendIntent } from '@/utils/AIOSService'
import autoAnimate from "@formkit/auto-animate"
import { useMessageStore } from '@/store/message'
import { useI18n } from 'vue-i18n'
import { useToast } from "vue-toastification"

// 组件
import Chat from './template/chat.vue'
import Temp from './template/temp.vue'
import Photo from './template/photo.vue'
import Shop from './template/shop.vue'
import Navigation from './template/navigation.vue'
import Music from './template/music.vue'
import Calendar from './template/calendar.vue'
import Battery from './template/battery.vue'
// import Background from './template/background.vue'
import Fan from "@/assets/svg/fan.svg";
import BloodSugar from "@/assets/svg/blood-sugar.svg";
import { IntentType, modeType, ShowRightType } from '@/types/enum'
import { useRouter } from "vue-router"
import type { Product, Restaurant } from '@/types/types'
const { t } = useI18n()
// 逻辑
const messageStore = useMessageStore()
// 标记组件为非响应式
const ChatComponent = markRaw(Chat)
const TempComponent = markRaw(Temp)
const CalendarComponent = markRaw(Calendar)
const BalendarComponent = markRaw(Battery)
const PhotoComponent = markRaw(Photo)
const ShopComponent = markRaw(Shop)
const NavigationComponent = markRaw(Navigation)
const MusicComponent = markRaw(Music)
// const BackgroundComponent = markRaw(Background)
const toast = useToast();

const router = useRouter()
const templateCardRef = ref<HTMLElement | null>(null)
const animateCards = computed(() => {
  return router.currentRoute.value.query.id ? agentCards : allCards
})
const currentToken = computed(() => {
  return router.currentRoute.value.query.id
})
onMounted(() => {
  // 发送一个modeType
  sendIntent(IntentType.MODETYPE, { modeType: modeType.AIOSMODE })
  if (!currentToken.value) {
    // 发送一个greetings
    // 启动后台运行
    setTimeout(() => {
      sendIntent(IntentType.GREETINGS, { greetings: '' })
    }, 100);
    setTimeout(() => {
      sendIntent(IntentType.BACKGROUNDRUNNING, { backgroundRunning: '' })
    }, 200);
  } else {
    const messageFind = messageStore.messageList.find(item => item.id === currentToken.value)
    const showRightDataFind = messageStore.showRightData.find(item => item.id === currentToken.value)
    if (messageFind) {
      messageFind.list?.forEach(item => {
        animateCards.value[0].componentProps.message.push(item)
      })
    }
    if (showRightDataFind) {
      showRightDataFind.list.forEach(v => {
        handleShowRight(v)
      })
    }
  }
  if (templateCardRef.value) autoAnimate(templateCardRef.value)
})

/* const viewStore = () => {
  console.log(messageStore.messageList);
  console.log(messageStore.showRightData);
  return
  const randomInt = Math.floor(Math.random() * 3) + 1;
  const arr = [CardSize.SMALL, CardSize.MEDIUM, CardSize.LARGE]
  pushTemplateCard({
    id: 'auto-' + Date.now(),
    size: arr[randomInt],
    component: TempComponent,
    componentProps: {
      icon: Fan,
      title: '新温度',
      value: 22.5,
      unit: '℃'
    }
  })
  console.log(arr[randomInt - 1]);
} */
const filterMessageList = computed(() => {
  return messageStore.messageList.filter(v => !messageStore.backgroundTokens.includes(v.id))
})
// 检测一次，是否关闭默认模板
watch(() => filterMessageList.value.length, () => {
  if (filterMessageList.value.length === 1) {
    allCards.splice(1, allCards.length - 1)
    allCards[0].row = [1, 3]
  }
})
// 检测多次，是否跳转到agent列表
watch(() => messageStore.messageList.length, () => {
  if (filterMessageList.value.length >= 2) {
    router.push('/dashboard/agentList')
  }
})
// 监听ShowRigth
watch(() => messageStore.currentShowRigthData, (value) => {
  if (!value) return
  console.log(currentToken.value, value.token);
  if (currentToken.value && currentToken.value !== value.token) return
  handleShowRight(value)
})
watch(() => messageStore.currentMessage, (value) => {
  if (!value) return
  // 判断当前是否有token，如果有表示是从agentList跳转过来的(在跳转过来的agent运行结束后需要清除token)
  if (currentToken.value && currentToken.value !== value.token) return
  if (value.background && !currentToken.value) {
    console.log('背景运行', value);
    // animateCards.value[4].componentProps.currentMessage = { ...value }
    toast(value.msg, {
      timeout: 2000,
    });
  } else {
    animateCards.value[0].componentProps.currentMessage = { ...value }
  }
})
watch(() => messageStore.currentBaseMessage, (value) => {
  allCards[0].componentProps.currentMessage = { ...value }
})
const handleShowRight = (showRigthData: any) => {
  const { srType, tokenId, token, content, imageUrl, nodeTitle } = showRigthData
  if (currentToken.value && currentToken.value !== token) return
  switch (srType) {
    case ShowRightType.IMAGE:
      const cardFind = animateCards.value.find(item => item.id.toString() === tokenId)
      if (cardFind) {
        cardFind.componentProps.photoList.push(
          {
            description: content,
            image: imageUrl,
            title: ''
          }
        )
      } else {
        pushTemplateCard({
          title: nodeTitle,
          id: tokenId,
          size: CardSize.SMALL,
          component: PhotoComponent,
          componentProps: {
            photoList: [
              {
                description: content,
                image: imageUrl,
                title: ''
              }
            ]
          },
        })
      }
      break;
    case ShowRightType.DINNER:
      const shopData = JSON.parse(content)
      pushTemplateCard({
        title: nodeTitle,
        id: tokenId,
        size: CardSize.LARGE,
        component: ShopComponent,
        componentProps: {
          templateShop: shopData.data.shop_list
        },
      })
      break;
    case ShowRightType.MENU:
      const muneData = JSON.parse(content)
      pushTemplateCard({
        title: nodeTitle,
        id: tokenId,
        size: CardSize.LARGE,
        component: ShopComponent,
        componentProps: {
          templateShop: muneData.data.shop.productList.map((v: Product) => {
            return {
              shopName: v.productName,
              shopDescription: v.productContent,
              logo: v.logo
            }
          })
        },
      })
      break;
    case ShowRightType.RESTAURANT:
      const restaurantData = JSON.parse(content)
      console.log(restaurantData);
      pushTemplateCard({
        title: nodeTitle,
        id: tokenId,
        size: CardSize.LARGE,
        component: ShopComponent,
        componentProps: {
          templateShop: restaurantData.map((v: Restaurant) => {
            return {
              shopName: v.storeName,
              shopDescription: v.address,
              logo: v.logo
            }
          })
        },
      })
      break
    case ShowRightType.NAVIGATE:
      const { location, des } = JSON.parse(content)
      pushTemplateCard({
        title: nodeTitle,
        id: tokenId,
        size: CardSize.LARGE,
        component: NavigationComponent,
        componentProps: {
          location,
          des
        },
      })
      break
    case ShowRightType.MUSIC:
      const { music_name, url, music_singer } = JSON.parse(content)
      pushTemplateCard({
        title: nodeTitle,
        id: tokenId,
        size: CardSize.XLARGE,
        component: MusicComponent,
        componentProps: {
          musicName: music_name,
          musicUrl: url,
          musicSinger: music_singer
        },
      })
      break
  }
}
// 定义网格常量
const GRID_ROWS = 3
const CardSize = {
  SMALL: 'small',    // 1x1
  MEDIUM: 'medium',  // 1x2
  LARGE: 'large',     // 1x3
  XLARGE: 'xlarge'
} as const
type CardSize = typeof CardSize[keyof typeof CardSize]
// 尺寸对应的网格占用
const SIZE_TO_GRID = {
  [CardSize.SMALL]: { columns: 1, rows: 1 },   // 1x1
  [CardSize.MEDIUM]: { columns: 1, rows: 2 },  // 1x2
  [CardSize.LARGE]: { columns: 1, rows: 3 },   // 1x3
  [CardSize.XLARGE]: { columns: 2, rows: 3 }   // 2x3
} as const
interface TemplateCard {
  component: string | Component
  id: string
  title?: string
  componentProps?: any

  // 两种定位方式二选一
  column?: [number, number] // [起始列索引, 占用列数]
  row?: [number, number]    // [起始行索引, 占用行数]
  size?: CardSize          // 自动定位时使用的尺寸
}

const allCards = reactive<TemplateCard[]>([
  {
    id: '1',
    // 从第1列开始占2列，从第1行开始占2行
    column: [1, 2],
    row: [1, 2],
    component: ChatComponent,
    componentProps: {
      message: [],
      currentMessage: {},
    }
  },
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
    id: '3',
    column: [2, 1],
    row: [3, 1],
    component: TempComponent,
    componentProps: {
      icon: BloodSugar,
      title: t('card.humidity'),
      value: 60,
      unit: '%'
    }
  },
  {
    id: '5',
    column: [3, 2],
    row: [1, 2],
    component: CalendarComponent,
  },
  /* {
    id: '6',
    column: [3, 1],
    row: [1, 2],
    component: BackgroundComponent,
    componentProps: {
      currentMessage: {},
    }
  }, */
  {
    id: '4',
    column: [3, 2],
    row: [3, 1],
    component: BalendarComponent,
  },

])
const agentCards = reactive<TemplateCard[]>([
  {
    id: '1',
    column: [1, 2],
    row: [1, 3],
    component: ChatComponent,
    componentProps: {
      message: []
    }
  },
])

const getCardGridStyle = (card: TemplateCard,) => {
  // column: [起始列索引, 占用列数] 例如 [1, 2] 表示从第1列开始占2列
  // row: [起始行索引, 占用行数] 例如 [2, 2] 表示从第2行开始占2行
  if (!card.column || !card.row) {
    return {};
  }
  const [startColumn, columnSpan] = card.column;
  const [startRow, rowSpan] = card.row;

  return {
    'grid-column': `${startColumn} / span ${columnSpan}`,
    'grid-row': `${startRow} / span ${rowSpan}`
  }
}
// 记录右侧两列的当前高度
const rightColumnHeights = reactive({
  col3: 0, // 第3列当前高度
  col4: 0  // 第4列当前高度
})

// 计算自动定位的函数 - 修改为右侧两列瀑布流布局
const calculateAutoPosition = (size: CardSize, existingCards: TemplateCard[]) => {
  const { rows: newCardRowSpan } = SIZE_TO_GRID[size]

  // 只处理右侧的卡片（第3、4列）
  const rightCards = existingCards.filter(card =>
    card.column && (card.column[0] === 3 || card.column[0] === 4)
  ).sort((a, b) => {
    // 按添加顺序排序（假设id越大越新）
    return parseInt(a.id) - parseInt(b.id)
  })

  // 模拟布局过程
  const layout = {
    col3: [] as Array<{ id: string, rowSpan: number, startRow: number }>,
    col4: [] as Array<{ id: string, rowSpan: number, startRow: number }>
  }

  let currentCol3Height = 0
  let currentCol4Height = 0

  // 先将新卡片放在第3列第1行
  if (newCardRowSpan <= GRID_ROWS) {
    layout.col3.push({
      id: 'NEW_CARD',
      rowSpan: newCardRowSpan,
      startRow: 1
    })
    currentCol3Height = newCardRowSpan
  } else {
    // 新卡片本身就太大，直接删除最旧卡片
    handleColumnOverflow(rightCards)
    return calculateAutoPosition(size, existingCards)
  }

  // 尝试排列现有卡片
  for (const card of rightCards) {
    if (!card.row) continue

    const cardRowSpan = card.row[1]

    // 先尝试放在第3列
    if (currentCol3Height + cardRowSpan <= GRID_ROWS) {
      layout.col3.push({
        id: card.id,
        rowSpan: cardRowSpan,
        startRow: currentCol3Height + 1
      })
      currentCol3Height += cardRowSpan
    }
    // 第3列放不下，尝试第4列
    else if (currentCol4Height + cardRowSpan <= GRID_ROWS) {
      layout.col4.push({
        id: card.id,
        rowSpan: cardRowSpan,
        startRow: currentCol4Height + 1
      })
      currentCol4Height += cardRowSpan
    }
    // 两列都放不下，需要删除最旧卡片
    else {
      handleColumnOverflow(rightCards)
      return calculateAutoPosition(size, existingCards)
    }
  }

  // 构建位置映射
  const positionMap = new Map()

  // 新卡片的位置（总是第3列第1行）
  positionMap.set('NEW_CARD', {
    column: [3, 1] as [number, number],
    row: [1, newCardRowSpan] as [number, number]
  })

  // 现有卡片的位置
  for (const item of layout.col3) {
    if (item.id !== 'NEW_CARD') {
      positionMap.set(item.id, {
        column: [3, 1] as [number, number],
        row: [item.startRow, item.rowSpan] as [number, number]
      })
    }
  }

  for (const item of layout.col4) {
    positionMap.set(item.id, {
      column: [4, 1] as [number, number],
      row: [item.startRow, item.rowSpan] as [number, number]
    })
  }

  return positionMap
}
// 完善后的添加卡片函数
const pushTemplateCard = (newCard: Omit<TemplateCard, 'column' | 'row'> & { size: CardSize }) => {
  // 只处理自动定位的卡片
  if (!newCard.size) {
    console.error('自动定位卡片必须包含 size')
    return
  }

  // 计算所有卡片的新位置
  const positionMap = calculateAutoPosition(newCard.size, animateCards.value)

  if (!positionMap) return

  // 更新现有卡片的位置
  animateCards.value.forEach(card => {
    if (card.column && (card.column[0] === 3 || card.column[0] === 4)) {
      const newPosition = positionMap.get(card.id)
      if (newPosition) {
        card.column = newPosition.column
        card.row = newPosition.row
      }
    }
  })

  // 添加新卡片
  const newPosition = positionMap.get('NEW_CARD')
  if (newPosition) {
    const finalCard: TemplateCard = {
      ...newCard,
      column: newPosition.column,
      row: newPosition.row
    }

    // 添加到卡片列表（插入到右侧卡片组的开头）
    const firstRightColumnIndex = animateCards.value.findIndex(card =>
      card.column && card.column[0] >= 3
    )

    if (firstRightColumnIndex === -1) {
      animateCards.value.push(finalCard)
    } else {
      animateCards.value.splice(firstRightColumnIndex, 0, finalCard)
    }
  }

  // 更新高度记录
  updateColumnHeights()
}
const updateColumnHeights = () => {
  rightColumnHeights.col3 = 0
  rightColumnHeights.col4 = 0

  animateCards.value.forEach(card => {
    if (card.column && card.row) {
      const [column] = card.column
      const [, rowSpan] = card.row

      if (column === 3) {
        rightColumnHeights.col3 += rowSpan
      } else if (column === 4) {
        rightColumnHeights.col4 += rowSpan
      }
    }
  })
}
// 检查并删除溢出卡片
const handleColumnOverflow = (rightCards: TemplateCard[]) => {
  if (rightCards.length === 0) return

  // 找到最旧的卡片（id最小的）
  const oldestCard = rightCards.reduce((oldest, current) => {
    return parseInt(current.id) < parseInt(oldest.id) ? current : oldest
  })

  removeCard(oldestCard.id)
  console.log(`删除最旧卡片: ${oldestCard.id}`)
}

// 修正移除卡片方法
const removeCard = (cardId: string) => {
  const currentCards = animateCards.value
  const cardIndex = currentCards.findIndex(card => card.id === cardId)

  if (cardIndex !== -1) {
    const removedCard = currentCards[cardIndex]

    // 如果是右侧卡片，更新高度记录
    if (removedCard.column && (removedCard.column[0] === 3 || removedCard.column[0] === 4) && removedCard.row) {
      const columnKey = removedCard.column[0] === 3 ? 'col3' : 'col4'
      rightColumnHeights[columnKey] = Math.max(0, rightColumnHeights[columnKey] - removedCard.row[1])
    }

    currentCards.splice(cardIndex, 1)
  }
}

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
