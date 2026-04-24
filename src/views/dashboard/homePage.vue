<template>
  <div class="size-full flex flex-col pr-10 pb-10">
    <div class="flex items-center py-2">
      <div class="relative px-5" @click="toggleRecord">
        <Hexagon class="fill-white size-20" />
        <div class="absolute top-[50%] left-[50%] transform-[translate(-50%,-50%)] flex items-center gap-[3px]">
          <!--  :class="`h-${height}`" -->
          <div v-for="(height, index) of sonicIcon" :key="index" :style="{ height: `${height * 0.25}rem` }"
            class="w-[3px] rounded-full bg-[#7a44e8] transition-all duration-300 ease-initial">
          </div>
        </div>
        <!-- <Sonic class="fill-[#7a44e8] size-4 absolute top-[50%] left-[50%] transform-[translate(-50%,-50%)]" /> -->
      </div>
      <div ref="messageScrollRef" class="text-white text-lg max-h-[50px] overflow-auto">
        <p ref="messageTextRef">{{ dialogueMessage }}</p>
      </div>
      <div id="waveform" class="hidden"></div>
      <audio ref="audioPlayRef" class="hidden"></audio>
    </div>
    <div class="flex flex-1">
      <!-- 侧边按钮 -->
      <div class="flex flex-col justify-between px-10">
        <div v-for="item in sidebarButtons" @click="handleSidebarButton(item)">
          <component class="size-10" :is='item.icon'></component>
        </div>
      </div>
      <!-- 主内容 -->
      <div class="h-full flex-1 flex flex-col gap-8">
        <!-- 堆叠卡片 -->
        <div class="flex gap-8">
          <!-- 左侧堆叠卡片 -->
          <ul class="flex-1 relative h-[180px]">
            <li class="flex flex-col items-center gap-4 rounded-2xl h-[180px] p-4 text-black bg-[#c7c4d5]">
              <div class="flex justify-between items-center w-full">
                <h2 class="text-5xl font-bold">{{ weatherInfo.temphigh }}°</h2>
                <div>
                  <p class="text-xl font-bold">{{ weatherInfo.city }}</p>
                  <p class="text-gray-500">{{ weatherInfo.weather }}</p>
                </div>
                <img class="w-20" :src="getWeatherImage" alt="">
              </div>
              <div class="flex justify-between items-center w-[80%] text-gray-500">
                <div class="flex flex-col items-center">
                  <WindForce class="size-8" />
                  <p>{{ weatherInfo.windspeed }}km/h</p>
                </div>
                <div class="flex flex-col items-center">
                  <Moisture class="size-8" />
                  <p>{{ weatherInfo.humidity }}%</p>
                </div>
                <div class="flex flex-col items-center">
                  <AirQuality class="size-8" />
                  <p>{{ weatherInfo.aqi }}</p>
                </div>
              </div>
            </li>
          </ul>
          <!-- 右侧堆叠卡片 -->
          <ul class="flex-1 relative h-[180px]">
            <div class="stack-container">
              <Swiper class="swiper" :auto-height="true" :direction="'vertical'" :slides-per-view="1" :space-between="0"
                :speed="600" :effect="'slide'" :grab-cursor="true" :mousewheel="true" :initial-slide="slides.length - 1"
                :long-swipes-ratio="0.1" :short-swipes="true" :observer="true" :observe-slide-children="true"
                :observe-parents="true" @swiper="onSwiper" @slide-change="onSlideChange">
                <SwiperSlide v-for="(item, index) in stackRightList" :key="index" :style="swiperSlidePosition(index)">
                  <div v-if="item.type === 'image'" class="size-full bg-[#c7c4d5] flex justify-center">
                    <img class="h-full" :src="item.content as string"></img>
                  </div>
                  <li v-if="item.type === 'music'" class="flex gap-4 rounded-2xl h-[180px] p-4 text-black bg-[#c7c4d5]">
                    <div class="flex flex-col items-center justify-between flex-1">
                      <div>
                        <h2 class="text-2xl font-bold">{{ (item.content as MusicProp[])[musicIndex]?.music_name }}</h2>
                        <p class="pt-2">{{ (item.content as MusicProp[])[musicIndex]?.music_singer }}</p>
                      </div>
                      <div class="flex gap-4 items-center">
                        <Cycle class="size-6 fill-gray-500" />
                        <Previous @click="musicIndex > 0 ? musicIndex-- : ''" class="size-8" />
                        <div class="p-3 rounded-full bg-[#866cf4]">
                          <Play @click="triggerMusicPlay" v-if="!isMusicPlaying" class="size-8 fill-white" />
                          <Pause @click="triggerMusicPlay" v-else class="size-8 fill-white" />
                        </div>
                        <Next @click="musicIndex < (item.content as MusicProp[]).length - 1 ? musicIndex++ : ''"
                          class="size-8" />
                        <Random class="size-6 fill-gray-500" />
                      </div>
                    </div>
                    <div class="w-[118px] h-full rounded-2xl bg-[#866cf4] overflow-hidden">
                      <img class="h-full" :src="(item.content as MusicProp[])[musicIndex]?.imgUrl">
                    </div>
                  </li>
                  <li v-if="item.type !== 'image' && item.type !== 'music'"
                    class="flex gap-4 rounded-2xl h-[180px] p-4 text-black bg-[#c7c4d5]">
                  </li>
                </SwiperSlide>
              </Swiper>
            </div>
            <audio class="hidden" ref="musicPlayRef"></audio>
          </ul>
        </div>
        <!-- 大图卡片 -->
        <div ref="showContentRef" class="flex-1 grid grid-cols-2 gap-8">
          <template v-for="(item, index) of showContentList" :key="index">
            <div v-if="item.type === 'navigate'">
              <Navigation :location="item.props.location" :des="item.props.des" />
            </div>
            <div v-else-if="item.type === 'dinner' || item.type == 'restaurant' || item.type === 'menu'"
              class="rounded-2xl relative text-black bg-[#c7c4d5] p-4">
              <ul class="size-full flex gap-4 overflow-auto">
                <li v-for="prop in item.props" class="h-full w-[150px] rounded-2xl overflow-hidden relative flex-none">
                  <img class="h-full" :src="prop.imgUrl" alt="">
                  <div
                    class="absolute bottom-0 right-0 p-2 bg-black/50 w-full h-[80px] flex flex-col items-center justify-center">
                    <p class="text-white text-sm">{{ prop.title }}</p>
                    <p class="text-gray-400 text-xs">{{ prop.description }}</p>
                  </div>
                </li>
              </ul>
            </div>
            <div v-else-if="item.type === 'car'" class="rounded-2xl relative text-black bg-[#c7c4d5]">
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
            <div v-else-if="item.type === 'markdown'" class="rounded-2xl bg-[#c7c4d5]">
              <MdPreview class="!max-h-[240px] !bg-transparent !overflow-auto px-2" v-model="item.content" />
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, watch, nextTick, computed } from 'vue'
// import { animate, svg, utils } from 'animejs';
import { Swiper, SwiperSlide } from 'swiper/vue'
import type { Swiper as SwiperType } from 'swiper'
import 'swiper/swiper-bundle.css'
import WaveSurfer from 'wavesurfer.js'
import RecordPlugin from 'wavesurfer.js/dist/plugins/record.esm.js'
import { sendIntent } from '@/utils/AIOSService'
import { TaskType, IntentType, ShowRightType, MessageType, modeType } from '@/types/enum'
import { useMessageStore } from '@/store/message'
// import autoAnimate from "@formkit/auto-animate"
import { MdPreview } from 'md-editor-v3';
import { useToast } from "vue-toastification"

// hooks
import { useAudioConversion } from '@/composables/index'
import { handleTTSMessage } from '@/utils'
// 组件
import Navigation from './template/navigation.vue'
// 图片
import Thunderstorm from '@/assets/image/weather/thunderstorm.png'
import Cloudy from '@/assets/image/weather/cloudy.png'
import Partlycloudy from '@/assets/image/weather/partlycloudy.png'
import Heavyrain from '@/assets/image/weather/heavyrain.png'
import Sunny from '@/assets/image/weather/sunny.png'
import Yeiqu from '@/assets/image/yeiqu.webp'
import Qianlizhiwai from '@/assets/image/qianlizhiwai.webp'
import Qintian from '@/assets/image/qintian.webp'
import Car3 from '@/assets/image/car.jpeg'
// 图标
import Hexagon from '@/assets/svg/hexagon.svg'
// import Sonic from '@/assets/svg/sonic_1.svg'
import AirQuality from '@/assets/svg/air-quality.svg'
import WindForce from '@/assets/svg/wind-force.svg'
import Moisture from '@/assets/svg/moisture.svg'
import MenuPlane from '@/assets/svg/menu_plane.svg'
import NavigationPlane from '@/assets/svg/navigation_plane.svg'
import CarPlane from '@/assets/svg/car_plane.svg'
import MusicPlane from '@/assets/svg/music_plane.svg'
import SettingPlane from '@/assets/svg/setting_plane.svg'
import Play from '@/assets/svg/play.svg'
import Pause from '@/assets/svg/pause.svg'
import Cycle from '@/assets/svg/cycle.svg'
import Previous from '@/assets/svg/previous.svg'
import Next from '@/assets/svg/next.svg'
import Random from '@/assets/svg/random.svg'
import BatteryLevel from '@/assets/svg/battery_level.svg'
import DataIcon from '@/assets/svg/data.svg'
import Shield from '@/assets/svg/shield.svg'
const toast = useToast()
onMounted(() => {
  sendIntent(IntentType.MODETYPE, { modeType: modeType.AIOSMODE })
  setTimeout(() => {
    sendIntent(IntentType.GREETINGS, { greetings: '' })
  }, 100);
  setTimeout(() => {
    sendIntent(IntentType.BACKGROUNDRUNNING, { backgroundRunning: '' })
  }, 200);
  // if (showContentRef.value) autoAnimate(showContentRef.value)
  if (musicPlayRef.value) {
    musicPlayRef.value.src = (stackRightList[0].content as MusicProp[])[0].url
  }
  handleResizeObserver()
  initWaveSurfer()
  setTimeout(() => {
    /* showContentList[0].props = {
      location: 'AI 创新中心',
      des: '四川省成都市高新区天府五街19号'
    } */
    stackRightList.push({
      type: 'image',
      content: 'https://picsum.photos/400/400'
    },)
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
          title: '肯德基',
          description: '肯德基',
          shopId: '1000001'
        },
        {
          logo: 'https://picsum.photos/200/400',
          title: '蜜雪冰城',
          description: '蜜雪冰城啊实打实打算委屈委屈我规',
          shopId: '1000002'
        }
      ]
    }) */

  }, 5000);
})
interface SidebarButtons {
  icon: string;
  text: string;
  active: boolean;
}
// 侧边栏按钮
const sidebarButtons = reactive<SidebarButtons[]>([
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
const handleSidebarButton = (item: SidebarButtons) => {
  stackRightList.splice(1, stackRightList.length)
  console.log(item);
}
interface DinnerProp {
  logo: string;
  shopName: string;
  shopDescription: string;
  shopId: string;
}
interface MenuProp {
  logo: string;
  productId: string;
  productName: string;
  productContent: string;
  productPrice: string;
}
interface MusicProp {
  music_name: string;
  music_singer: string;
  url: string;
  imgUrl?: string
}
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
interface MusicContent {
  type: 'music';
  content: MusicProp[];
}

interface ImageContent {
  type: 'image';
  content: string;
}

interface OtherContent {
  type: string; // 其他类型
  content: unknown;
}
type StackRightItem = MusicContent | ImageContent | OtherContent;
// 堆叠区域右侧内容
const stackRightList = reactive<StackRightItem[]>([
  {
    type: 'music',
    content: [
      {
        music_name: '夜曲',
        music_singer: '周杰伦',
        url: 'http://127.0.0.1:8090/music/audios/yequ.mp3',
        imgUrl: Yeiqu

      },
      {
        music_name: '晴天',
        music_singer: '周杰伦',
        url: 'http://127.0.0.1:8090/music/audios/qingtian.mp3',
        imgUrl: Qintian
      },
      {
        music_name: '千里之外',
        music_singer: '周杰伦',
        url: 'http://127.0.0.1:8090/music/audios/qianlizhiwai.mp3',
        imgUrl: Qianlizhiwai
      }
    ]
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
const musicIndex = ref(0)
watch(musicIndex, () => {
  if (musicPlayRef.value) {
    musicPlayRef.value.src = (stackRightList[0].content as MusicProp[])[musicIndex.value].url
    musicPlayRef.value.play()
    isMusicPlaying.value = true
  }
})
// 堆叠区域左侧内容
// const stackLeftList = reactive([])
interface WeatherInfo {
  weather: '晴' | '阴' | '小雨' | '多云',
  city: string,
  temperature: string,
  temphigh: string,
  templow: string,
  windspeed: string,
  aqi: string,
  humidity: string
}
// 天气信息
const weatherInfo = reactive<WeatherInfo>({
  weather: '晴',
  city: '成都市',
  temperature: '25',
  temphigh: '25',
  templow: '25',
  windspeed: '5.5',
  aqi: '50',
  humidity: '53%'
})
const weatherImageMap = new Map([
  ['晴', Sunny],
  ['阴', Cloudy],
  ['多云', Partlycloudy],
  ['大雨', Heavyrain],
  ['雷阵雨', Thunderstorm]
])

const getWeatherImage = computed(() => {
  const weather = weatherInfo.weather;
  const image = weatherImageMap.get(weather);
  // 返回找到的图片或默认图片（这里假设有一个DefaultWeather图片组件）
  return image || undefined; // 或者返回一个默认的天气图标
})
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

// 对话消息 HI~CHIO 早上好，您可以对我说"导航到公司
const dialogueMessage = ref('')
const messageScrollRef = ref<HTMLElement | null>(null)
const messageTextRef = ref<HTMLElement | null>(null)
let messageSizeObserber = ref<ResizeObserver | null>(null)
const handleResizeObserver = () => {
  messageSizeObserber.value = new ResizeObserver(() => {
    messageScrollRef.value?.scrollTo({
      left: 0,
      top: messageTextRef.value?.offsetHeight,
      behavior: 'smooth'
    })
  })
  messageSizeObserber.value.observe(messageTextRef.value as Element)
}
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
const isMusicPlaying = ref(false);

const triggerMusicPlay = () => {
  if (isMusicPlaying.value) {
    musicPlayRef.value?.pause()
    isMusicPlaying.value = false
  } else {
    musicPlayRef.value?.play()
    isMusicPlaying.value = true
  }
}
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
    // dialogueMessage.value = ''
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

    // 实现逐字显示效果
    const showText = async (text: string) => {
      dialogueMessage.value = ''
      for (let i = 0; i < text.length; i++) {
        dialogueMessage.value += text[i]
        await new Promise(resolve => setTimeout(resolve, 40)) // 40ms/字，可调整
      }
    }

    await showText(asrResult)

    if (isUserAnswer.value) {
      sendIntent(IntentType.USERANSWER, { userAnswer: asrResult, id: currentIntentId.value, token: currentIntenToken.value })
      isUserAnswer.value = false
    } else {
      sendIntent(IntentType.ASR, { asrText: asrResult })
    }
  });
}

// 是否正在录音
const isProcessing = ref(false)
// sonicIcon图标
const sonicIcon = reactive([2, 5, 3, 2])

// sonicIcon动画
let sonicAnimation: ReturnType<typeof setInterval> | null = null
// 开始录音
const toggleRecord = async () => {
  if (!isProcessing.value) {
    // 停止正在播放的 TTS
    if (audioPlayRef.value && !audioPlayRef.value.paused) {
      audioPlayRef.value.pause()
      audioPlayRef.value.currentTime = 0
    }
    try {
      // 每0.2秒将sonicIcon数组的值+1，超过5回到1
      sonicAnimation = setInterval(() => {
        for (let i = 0; i < sonicIcon.length; i++) {
          sonicIcon[i] = sonicIcon[i] >= 5 ? 1 : sonicIcon[i] + 1
        }
      }, 100)
      isProcessing.value = true
      await recordPlugin.value?.startMic({
        echoCancellation: true, // 车载必备：回声消除
        noiseSuppression: true, // 车载必备：降噪
        autoGainControl: true, // 自动增益
        sampleRate: 16000, // 语音识别最优采样率
        channelCount: 1, // 单声道（省资源）
      });
      // 启动录音（v7核心API）
      await recordPlugin.value?.startRecording();
    } catch (err) {
      console.error('启动录音失败：', err);
    }
  } else {
    recordPlugin.value?.stopRecording()
    recordPlugin.value?.stopMic()
    if (sonicAnimation) {
      clearInterval(sonicAnimation)
      sonicAnimation = null
      // 直接重置到初始值
      sonicIcon.splice(0, sonicIcon.length); // 清空数组
      sonicIcon.push(2, 5, 3, 2); // 重新添加初始值
    }
    isProcessing.value = false
  }
};
const messageStore = useMessageStore()
// 监听AIOS消息更新
watch(() => messageStore.currentMessage, (value) => {
  switch (value?.messageType) {
    case TaskType.TTS:
      let arsMessage = ''
      // 判断是否是背景消息
      if (value.background) {
        toast(value.msg, {
          timeout: 2000,
        });
        return
      }
      const { type, message } = handleTTSMessage(value.msg as string)
      switch (type) {
        case MessageType.MARKDOWN:
          const regex = /notify```\s*([\s\S]*?)```/
          if (value.msg) {
            arsMessage = value.msg.match(regex)?.[1] as string
          }
          break;
        case MessageType.WEATHER:
          const weatherJson = JSON.parse(value.msg as string)
          console.log('天气', weatherJson.result);
          break;
        case MessageType.TEXT:
          arsMessage = message
          break;
      }
      addToPlayQueue(arsMessage as string);
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
    case ShowRightType.MUSIC:
      // url, music_singer
      const { music_name, url } = JSON.parse(value?.content) as MusicProp
      const musicFind = stackRightList.find(item => item.type === ShowRightType.MUSIC)
      if (musicFind && musicPlayRef.value) {
        const findMusicIndex = (musicFind.content as MusicProp[]).findIndex(item => item.music_name === music_name)
        if (findMusicIndex === -1) return
        if (musicIndex.value === findMusicIndex) {
          musicPlayRef.value.src = url
          musicPlayRef.value.play()
          isMusicPlaying.value = true
        } else {
          musicIndex.value = findMusicIndex
        }
        swiperInstance.value?.slideTo(0, 300)
        /* (musicFind.content as MusicProp[]).unshift({
          music_name,
          music_singer,
          url
        }) */
        /* musicPlayRef.value.src = url
        musicPlayRef.value.play()
        isMusicPlaying.value = true */
      }
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
    case ShowRightType.MENU:
      showContentList.pop()
      showContentList.unshift({
        type: value?.srType,
        content: '',
        props: []
      })
      const menuJson = (JSON.parse(value?.content)).data.shop.productList as MenuProp[]
      const menuFind = showContentList.find(item => item.type === ShowRightType.MENU)
      if (menuFind) {
        menuFind.props = menuJson.map(item => {
          return {
            imgUrl: item.logo,
            title: item.productName,
            description: '￥' + item.productPrice
          }
        })
      }
      break
    case ShowRightType.NAVIGATE:
      const navigateJson = JSON.parse(value?.content) as NavigateProp
      const navigateFind = showContentList.find(item => item.type === ShowRightType.NAVIGATE)
      if (navigateFind) {
        navigateFind.props = navigateJson
      } else {
        showContentList.pop()
        showContentList.unshift({
          type: value?.srType,
          content: '',
          props: navigateJson
        })
      }
      break
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
    case ShowRightType.MARKDOWN:
      showContentList.pop()
      showContentList.unshift({
        type: value.srType,
        content: value.content,
      })
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
    // 先请求TTS，获取音频文件
    const res = await ttsApi(message)
    // 并行：一边打字一边播放
    const playPromise = handleAudioPlay(res.file)
    dialogueMessage.value = ''
    for (let i = 0; i < message.length; i++) {
      dialogueMessage.value += message[i]
      await new Promise(resolve => setTimeout(resolve, 40)) // 40ms/字，可调整
    }
    await playPromise
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
