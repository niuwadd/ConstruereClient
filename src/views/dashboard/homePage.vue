<template>
  <div class="size-full flex flex-col pr-10 pb-10">
    <div class="flex items-center pt-2 pb-6">
      <div id="waveform" class="hidden"></div>
      <div class="relative px-5" @click="toggleRecord">
        <Hexagon class="fill-white size-20" />
        <Sonic class="fill-[#7a44e8] size-4 absolute top-[50%] left-[50%] transform-[translate(-50%,-50%)]" />
      </div>
      <p class="text-white text-lg">{{ dialogueMessage }}</p>
      <audio ref="audioPlayRef" class="hidden"></audio>
    </div>
    <div class="flex flex-1">
      <!-- 侧边按钮 -->
      <div class="flex flex-col justify-between px-10">
        <div v-for="item in sidebarButtons">
          <component class="size-10" :is='item.icon'></component>
        </div>
      </div>
      <!-- 主内容 -->
      <div class="h-full flex-1 flex flex-col gap-8">
        <!-- 堆叠卡片 -->
        <div class="flex gap-8">
          <ul class="flex-1 relative h-[180px]">
            <li class="flex flex-col items-center gap-4 rounded-2xl h-[180px] p-4 text-black bg-[#c7c4d5]">
              <div class="flex justify-between items-center w-full">
                <h2 class="text-5xl font-bold ">29°</h2>
                <div>
                  <p class="text-xl font-bold">成都市·双流区</p>
                  <p class="text-gray-500">阴转雷阵雨</p>
                </div>
                <img class="w-20" :src="Thunderstorm" alt="">
              </div>
              <div class="flex justify-between items-center w-[80%] text-gray-500">
                <div class="flex flex-col items-center">
                  <WindForce class="size-8" />
                  <p>26km/h</p>
                </div>
                <div class="flex flex-col items-center">
                  <Moisture class="size-8" />
                  <p>83%</p>
                </div>
                <div class="flex flex-col items-center">
                  <AirQuality class="size-8" />
                  <p>32</p>
                </div>
              </div>
            </li>
          </ul>
          <ul class="flex-1 relative h-[180px]">
            <div class="stack-container">
              <Swiper class="swiper" :auto-height="true" :direction="'vertical'" :slides-per-view="1" :space-between="0"
                :speed="600" :effect="'slide'" :grab-cursor="true" :mousewheel="true" :initial-slide="slides.length - 1"
                :long-swipes-ratio="0.1" :short-swipes="true" :observer="true" :observe-slide-children="true"
                :observe-parents="true" @swiper="onSwiper" @slide-change="onSlideChange">
                <SwiperSlide v-for="(item, index) in stackRightList" :key="index" :style="swiperSlidePosition(index)">
                  <img v-if="item.type === 'image'" class="w-full" :src="item.content" alt="">
                  <li v-if="item.type === 'music'" class="flex gap-4 rounded-2xl h-[180px] p-4 text-black bg-[#c7c4d5]">
                    <div class="flex flex-col items-center justify-between flex-1">
                      <div>
                        <h2 class="text-2xl font-bold">夜曲</h2>
                        <p class="pt-2">周杰伦</p>
                      </div>
                      <div class="flex gap-4 items-center">
                        <Cycle class="size-6 fill-gray-500" />
                        <Previous class="size-8" />
                        <div class="p-3 rounded-full bg-[#866cf4]">
                          <Play class="size-8 fill-white" />
                        </div>
                        <Next class="size-8" />
                        <Random class="size-6 fill-gray-500" />
                      </div>
                    </div>
                    <div class="w-[118px] h-full rounded-2xl bg-[#866cf4] overflow-hidden">
                      <img class="h-full" :src="Yeiqu">
                    </div>
                    <audio class="hidden" ref="musicPlayRef"></audio>
                  </li>
                  <li v-if="item.type !== 'image' && item.type !== 'music'"
                    class="flex gap-4 rounded-2xl h-[180px] p-4 text-black bg-[#c7c4d5]"></li>
                </SwiperSlide>
              </Swiper>
            </div>
            <!--  <li
              class="flex gap-4 rounded-2xl h-[180px] bg-white/10 backdrop-blur-sm border-[1px] border-solid border-gray-400 p-4">
              <div class="flex flex-col items-center justify-between flex-1 text-white fill-white">
                <div>
                  <h2 class="text-2xl font-bold">夜曲</h2>
                  <p class="pt-2">周杰伦</p>
                </div>
                <div class="flex gap-4 items-center">
                  <Cycle class="size-6" />
                  <Previous class="size-8" />
                  <div class="p-3 rounded-full bg-[#866cf4]">
                    <Play class="size-8" />
                  </div>
                  <Next class="size-8" />
                  <Random class="size-6" />
                </div>
              </div>
              <div class="w-[140px] h-full rounded-2xl bg-[#866cf4] overflow-hidden">
                <img class="w-full" :src="Yeiqu">
              </div>
            </li> -->
          </ul>
        </div>
        <!-- 大图卡片 -->
        <div ref="showContentRef" class="flex-1 grid grid-cols-2 gap-8">
          <template v-for="(item, index) of showContentList" :key="index">
            <div v-if="item.type === 'navigate'">
              <Navigation :location="item.props.location" :des="item.props.des" />
            </div>
            <div v-else-if="item.type === 'dinner' || item.type == 'restaurant'" class="rounded-2xl relative text-black bg-[#c7c4d5] p-4">
              <ul class="w-full flex gap-4 overflow-auto">
                <li v-for="prop in item.props"
                  class="h-[230px] w-[150px] rounded-2xl overflow-hidden relative flex-none">
                  <img class="h-full" :src="prop.imgUrl" alt="">
                  <div
                    class="absolute bottom-0 right-0 bg-black/50 w-full h-[60px] flex flex-col items-center justify-center">
                    <p class="text-white text-base">{{ prop.title }}</p>
                    <p class="text-gray-400 text-sm">{{ prop.description }}</p>
                  </div>
                </li>
              </ul>
            </div>
            <div v-else-if="item.type === 'car'" class="flex-1 rounded-2xl relative text-black bg-[#c7c4d5]">
              <div class="p-4 flex items-center">
                <h2 class="text-xl">已陪伴你度过<span class="text-2xl font-bold px-2">452</span>天</h2>
                <p class="flex items-center text-[#866cf4] pl-6">
                  <Shield class="size-8 fill-[#866cf4]" /><span>全车安全守护中</span>
                </p>
              </div>
              <div class="p-4 flex flex-col gap-4">
                <div class="flex items-center text-xl">
                  <DataIcon class="size-6" />
                  <span class="text-2xl font-bold px-2">4657</span>
                  <span>km</span>
                </div>
                <div class="flex items-center text-xl">
                  <BatteryLevel class="size-6" />
                  <span class="text-2xl font-bold px-2">222</span>
                  <span>km</span>
                </div>
              </div>
              <img class="absolute bottom-0 right-0 w-[350px]" :src="Car3" />
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, watch, nextTick } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import type { Swiper as SwiperType } from 'swiper'
import 'swiper/swiper-bundle.css'
import WaveSurfer from 'wavesurfer.js'
import RecordPlugin from 'wavesurfer.js/dist/plugins/record.esm.js'
import { sendIntent } from '@/utils/AIOSService'
import { TaskType, IntentType, ShowRightType } from '@/types/enum'
import { useMessageStore } from '@/store/message'
// import autoAnimate from "@formkit/auto-animate"
// hooks
import { useAudioConversion } from '@/composables/index'
// 组件
import Navigation from './template/navigation.vue'
// 图片
import Thunderstorm from '@/assets/image/weather/thunderstorm.png'
import Yeiqu from '@/assets/image/yeiqu.webp'
import Car3 from '@/assets/image/car_3.jpeg'
// 图标
import Hexagon from '@/assets/svg/hexagon.svg'
import Sonic from '@/assets/svg/sonic_1.svg'
import AirQuality from '@/assets/svg/air-quality.svg'
import WindForce from '@/assets/svg/wind-force.svg'
import Moisture from '@/assets/svg/moisture.svg'
import MenuPlane from '@/assets/svg/menu_plane.svg'
import NavigationPlane from '@/assets/svg/navigation_plane.svg'
import CarPlane from '@/assets/svg/car_plane.svg'
import MusicPlane from '@/assets/svg/music_plane.svg'
import SettingPlane from '@/assets/svg/setting_plane.svg'
import Play from '@/assets/svg/play.svg'
import Cycle from '@/assets/svg/cycle.svg'
import Previous from '@/assets/svg/previous.svg'
import Next from '@/assets/svg/next.svg'
import Random from '@/assets/svg/random.svg'
import BatteryLevel from '@/assets/svg/battery_level.svg'
import DataIcon from '@/assets/svg/data.svg'
import Shield from '@/assets/svg/shield.svg'
onMounted(() => {
  // if (showContentRef.value) autoAnimate(showContentRef.value)
  initWaveSurfer()
  setTimeout(() => {
    /* showContentList[0].props = {
      location: 'AI 创新中心',
      des: '四川省成都市高新区天府五街19号'
    } */
    /* stackRightList.push({
      type: 'image',
      content: 'https://picsum.photos/300/200'
    },) */
    /* if (swiperInstance.value) {
      swiperInstance.value.slideTo(stackRightList.length - 1, 300)
    } */
    /* showContentList.pop()
    showContentList.unshift({
      type: 'dinner',
      content: '',
      props: [
        {
          logo: '../../assets//image/kfc.png',
          shopName: '肯德基',
          shopDescription: '肯德基',
          shopId: '1000001'
        },
        {
          logo: '../../assets//image/mxbc.png',
          shopName: '蜜雪冰城',
          shopDescription: '蜜雪冰城',
          shopId: '1000002'
        }
      ]
    }) */

  }, 5000);
})
// 侧边栏按钮
const sidebarButtons = reactive([
  {
    icon: CarPlane,
    text: '车机',
    active: false,
  },
  {
    icon: NavigationPlane,
    text: '导航',
    active: true,
  },
  {
    icon: MenuPlane,
    text: '菜单',
    active: false,
  },
  {
    icon: MusicPlane,
    text: '音乐',
    active: false,
  },
  {
    icon: SettingPlane,
    text: '设置',
    active: false,
  },
])
interface showRight {
  type: string,
  content: string
}

// 堆叠区域右侧内容
const stackRightList = reactive<showRight[]>([
  {
    type: 'music',
    content: ''
  },
  /* {
    type: 'image',
    content: 'https://picsum.photos/300/200'
  },
  {
    type: 'image',
    content: 'https://picsum.photos/400/200'
  } */
])
// 堆叠区域左侧内容
// const stackLeftList = reactive([])

interface DinnerProp {
  logo: string;
  shopName: string;
  shopDescription: string;
  shopId: string;
}
/* interface MusicProp {
  music_name: string;
  music_singer: string;
  url: string;
} */
interface NavigateProp {
  location: string;
  des: string;
}
interface RestaurantProp {
  name: string;
  address: string;
  logo: string;
}

interface ShowContentItem {
  type: string;
  content: string;
  props?: any;
}

// const showContentRef = ref<HTMLElement | null>(null)
// 大图区域内容
const showContentList = reactive<ShowContentItem[]>([
  {
    type: 'navigate',
    content: '',
    props: {}
  },
  {
    type: 'car',
    content: ''
  },
])

const slides = ref([])
const currentSlide = ref(0)
const swiperInstance = ref<SwiperType | null>(null)

const onSwiper = (swiper: SwiperType) => {
  swiperInstance.value = swiper
}

const onSlideChange = (swiper: SwiperType) => {
  currentSlide.value = swiper.activeIndex
}
watch(() => stackRightList.length, async (newLength) => {
  if (swiperInstance.value) {
    await nextTick()
    swiperInstance.value.update()
    swiperInstance.value.slideTo(newLength - 1, 300)
  }
}, { immediate: true })

// 对话消息
const dialogueMessage = ref('HI~CHIO 早上好，您可以对我说"导航到公司')
// 音频转换处理 ttsApi,
const { ttsApi, arsApi } = useAudioConversion()
const wavesurfer = ref<WaveSurfer | null>(null)
const recordPlugin = ref<RecordPlugin | null>(null);
// 是否是一个回答
const isUserAnswer = ref(false)
// 当前IntentID
const currentIntentId = ref<string | null>(null)
// 当前IntentToken
const currentIntenToken = ref<string | null>(null)
const musicPlayRef = ref<HTMLAudioElement | null>(null)
// 音频缓存：解决高频请求问题
// let audioCache = [];
// 初始化WaveSurfer
const initWaveSurfer = () => {
  // 创建WaveSurfer实例
  wavesurfer.value = WaveSurfer.create({
    container: '#waveform',
    waveColor: '#4F4A85',
    progressColor: '#383351',
    cursorColor: 'transparent',
    barWidth: 2,
    barGap: 1,
  });
  // 创建录音插件实例
  recordPlugin.value = wavesurfer.value.registerPlugin(RecordPlugin.create({
    renderRecordedAudio: false,
    scrollingWaveform: false,
    continuousWaveform: true,
    continuousWaveformDuration: 5,
    // mediaRecorderTimeslice: 2000
  }));
  // 监听录音开始事件
  recordPlugin.value.on('record-start', () => {
    dialogueMessage.value = ''
    // audioCache = [];
    console.log('✅ 录制已启动');
  });
  // 监听录音结束事件
  recordPlugin.value.on('record-end', () => {
    console.log('✅ 录制已结束', dialogueMessage.value);
  });
  recordPlugin.value.on('record-data-available', async (event) => {
    const asrResult = await arsApi(event as Blob)
    console.log('✅ 录制过程中，数据可用', asrResult);
    dialogueMessage.value += asrResult
    if (isUserAnswer.value) {
      sendIntent(IntentType.USERANSWER, { userAnswer: dialogueMessage.value, id: currentIntentId.value, token: currentIntenToken.value })
      isUserAnswer.value = false
    } else {
      sendIntent(IntentType.ASR, { asrText: dialogueMessage.value })
    }
  });
}

// 是否正在录音
const isProcessing = ref(false)
// 开始录音
const toggleRecord = async () => {
  if (!isProcessing.value) {
    try {
      await recordPlugin.value?.startMic({
        echoCancellation: true, // 车载必备：回声消除
        noiseSuppression: true, // 车载必备：降噪
        autoGainControl: true, // 自动增益
        sampleRate: 16000, // 语音识别最优采样率
        channelCount: 1, // 单声道（省资源）
      });
      // 启动录音（v7核心API）
      await recordPlugin.value?.startRecording();
      isProcessing.value = true
    } catch (err) {
      console.error('启动录音失败：', err);
    }
  } else {
    recordPlugin.value?.stopRecording()
    recordPlugin.value?.stopMic()
    isProcessing.value = false
  }
};
const messageStore = useMessageStore()
// 监听AIOS消息更新
watch(() => messageStore.currentMessage, (value) => {
  switch (value?.messageType) {
    case TaskType.TTS:
      addToPlayQueue(value.msg as string);
      break;
    case TaskType.USER:
      addToPlayQueue(value.msg as string);
      isUserAnswer.value = true
      currentIntentId.value = value.id as string
      currentIntenToken.value = value.token as string
      break;
  }
})

watch(() => messageStore.currentShowRigthData, (value) => {
  let content
  switch (value?.srType) {
    case ShowRightType.IMAGE:
      content = value?.imageUrl
      stackRightList.push({
        type: value?.srType ?? '',
        content: content ?? ''
      })
      break;
    case ShowRightType.DINNER:
      showContentList.pop()
      showContentList.unshift({
        type: value?.srType,
        content: '',
        props: []
      })
      const dinnerJson = (JSON.parse(value?.content)).data.shop_list as DinnerProp[]
      const dinnerFind = showContentList.find(item => item.type === ShowRightType.DINNER)
      if (dinnerFind) {
        dinnerFind.props = dinnerJson.map(item => {
          return {
            imgUrl: item.logo,
            title: item.shopName,
            description: ''
          }
        })
      }
      break;
    case ShowRightType.NAVIGATE:
      const navigateJson = JSON.parse(value?.content) as NavigateProp
      const navigateFind = showContentList.find(item => item.type === ShowRightType.NAVIGATE)
      if (navigateFind) {
        navigateFind.props = navigateJson
      }
      break
    case ShowRightType.MUSIC:
      /* const { music_name, url, music_singer } = JSON.parse(value?.content) as MusicProp
      const musicFind = stackRightList.find(item => item.type === ShowRightType.MUSIC)
      if (musicFind && musicPlayRef.value) {
        musicPlayRef.value.src = url
        musicPlayRef.value.play()
      } */
      break;
    case ShowRightType.RESTAURANT:
      showContentList.pop()
      showContentList.unshift({
        type: value?.srType,
        content: '',
        props: []
      })
      const restaurantJson = JSON.parse(value?.content) as RestaurantProp[]
      const restaurantFind = showContentList.find(item => item.type === ShowRightType.RESTAURANT)
      if (restaurantFind) {
        restaurantFind.props = restaurantJson.map(item => {
          return {
            imgUrl: item.logo,
            title: item.name,
            description: item.address
          }
        })
      }
      break;
  }
  console.log('currentShowRigthData', value);
})
// 音频播放队列
const audioQueue = ref<string[]>([]);
const isPlaying = ref(false);
// 添加到播放队列
const addToPlayQueue = async (message: string) => {
  audioQueue.value.push(message);
  // 如果没有正在播放，则开始播放
  if (!isPlaying.value) {
    await processQueue();
  }
};
// 处理播放队列
const processQueue = async () => {
  if (audioQueue.value.length === 0) {
    isPlaying.value = false;
    return;
  }

  isPlaying.value = true;
  const message = audioQueue.value.shift()!;

  try {
    // 播放完成后更新显示
    dialogueMessage.value = message;
    const res = await ttsApi(message)
    await handleAudioPlay(res.file)
  } catch (error) {
    console.error('播放队列项失败:', error);
  }

  // 继续处理下一个
  await processQueue();
};

const audioPlayRef = ref<HTMLAudioElement | null>(null)

// 处理音频播放
const handleAudioPlay = (filePath: string): Promise<void> => {
  return new Promise((resolve) => {
    if (audioPlayRef.value) {
      audioPlayRef.value.src = location.origin + '/' + filePath
      // 监听播放完成事件
      const onEnded = () => {
        audioPlayRef.value?.removeEventListener('ended', onEnded)
        resolve()
      }
      // 监听播放暂停
      const onPause = () => {
        audioPlayRef.value?.removeEventListener('pause', onPause)
        resolve()
      }
      audioPlayRef.value.addEventListener('ended', onEnded)
      audioPlayRef.value.addEventListener('pause', onPause)
      audioPlayRef.value.play().catch((e) => {
        console.error('播放失败:', e)
        resolve()
      })
    }
  })
}
// 获取轮播图的位置
const swiperSlidePosition = (slideIndex: number) => {
  const diff = slideIndex - currentSlide.value;
  if (diff === 0) return '';

  const absDiff = Math.abs(diff);
  const scale = Math.max(0.7, 1 - absDiff * 0.07);
  const opacity = absDiff >= 3 ? 0 : Math.max(0.3, 1 - absDiff * 0.1);
  const zIndex = 10 - absDiff;
  const translateY = diff > 0 ? -absDiff * 162 : absDiff * 162;

  return {
    transform: `translateY(${translateY}px) scale(${scale})`,
    opacity,
    zIndex,
  };
};
</script>
<style lang="scss" scoped>
.stack-container {
  position: relative;
  width: 100%;
  height: 100%;
  margin: 0 auto;
  // height: calc(100% - 2rem);
  // padding: 10px;
}

.swiper {
  width: 100%;
  height: 100%;
  border-radius: 16px;
  overflow: visible;
}

.swiper-slide {
  border-radius: 16px;
  overflow: hidden;
  transition: transform 0.5s ease, opacity 0.5s ease;
}

.swiper-slide-active {
  z-index: 10;
}

/* 
.swiper-slide-prev {
  transform: translateY(160px) scale(0.95);
  opacity: 0.7;
  z-index: 1;
}

.swiper-slide-next {
  transform: translateY(-160px) scale(0.95);
  opacity: 0.7;
  z-index: 1;
} */
</style>
