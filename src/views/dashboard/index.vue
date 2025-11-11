<template>

  <div class="dashboard size-full flex gap-4 p-10 portrait:flex-col">
    <div :class="hiddenCard ? '' : 'flex-1'"
      class="flex flex-col w-[340px] rounded-2xl bg-white/25 text-2xl font-bold relative portrait:w-full portrait:h-[400px]">
      <div class="absolute top-0 z-[2] flex justify-center items-center gap-4 w-full py-4 backdrop-blur-[2px]">
        <h2 class="text-center text-lg">{{ $t('message.chatTitle') }}</h2>
      </div>
      <div ref="messageScrollRef" class="min-h-[200px] flex-1 px-8 overflow-hidden">
        <MessageList id="agentMessageList" class="pt-16 pb-28" :agentMessageList="agentMessageList"
          @imageLoad="handleImageLoad" />
      </div>
      <div class="absolute bottom-0 z-[2] w-full py-4 backdrop-blur-[2px] flex justify-center">
        <div class="relative">
          <div @touchstart.passive="handleRecorderTouchstart" @touchend.passive="handleRecorderTouchend"
            @contextmenu="(e) => { e.preventDefault() }"
            class="relative z-20 size-[70px] rounded-full bg-linear-to-r from-[#6886fc] to-[#6958fb] flex items-center justify-center">
            <Microphone class="scale-65 relative z-10" />
          </div>
          <div ref="recorderBgRef1"
            class="absolute inset-0 size-[70px] rounded-full bg-black/20 z-10 transition-all duration-300"
            :class="isAnimating ? 'recorder-bg-1' : ''">
          </div>
          <div ref="recorderBgRef2" class="absolute inset-0 size-[70px] rounded-full bg-black/10 z-10"
            :class="isAnimating ? 'recorder-bg-2' : ''">
          </div>
        </div>
      </div>
    </div>
    <div v-show="hiddenCard" ref="templateCardRef" class="flex flex-1 gap-4 text-white">
      <!-- 单一容器，使用 grid 布局 -->
      <div v-auto-animate class="grid grid-cols-1 grid-rows-4 gap-4 size-full md:grid-cols-2 portrait:grid-rows-2">
        <div v-for="(card, index) in allCards" :key="card.id" :class="[
          'rounded-2xl bg-white/25 p-4 transition-all duration-300',
        ]" :style="getCardGridStyle(card, index)">
          <!-- <h2 class="pb-2 font-bold text-lg">{{ card.title }}</h2> -->
          <component :is='card.component' v-bind="card.componentProps"></component>
        </div>
      </div>
    </div>
    <audio ref="audioPlayRef" @ended="isAudioPlay = false" class="hidden" controls></audio>
    <div @click="router.push('/')" class="absolute top-2 right-2 rounded-3xl text-white text-sm ">
      {{ $t('mode.agentMode') }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, markRaw, onMounted, watchEffect, reactive, watch, computed, type Component } from 'vue'
import Examination_0 from '@/assets/image/examination_0.png'
import Temperature_0 from '@/assets/image/temperature_0.png'
import Emergency_number_0 from '@/assets/image/emergency_number_0.png'
import Hospital_0 from '@/assets/image/hospital_0.png'
import Fitness_band_0 from '@/assets/image/fitness_band_0.png'
import Camera_1 from '@/assets/image/camera_1.png'
import Navigation_1 from '@/assets/image/navigation_1.png'
import Phone_1 from '@/assets/image/phone_1.png'
import Component_1 from '@/assets/image/component.png'
import Car from '@/assets/image/car.png'
// 工具
import { sendIntent, socketState } from '@/utils/AIOSService'
import { getTimeGreeting } from '@/utils'
import autoAnimate from "@formkit/auto-animate"
import { useI18n } from 'vue-i18n'
// 组件
import MessageList from '../home/model/messageList.vue'
import Restaurants from './template/restaurants.vue'
import Photo from './template/photo.vue'
import Navigation from './template/navigation.vue'
import Music from './template/music.vue'
// import Weather from './template/weather.vue'
import ShopCom from './template/shop.vue'
import ProductCom from './template/product.vue'
import Microphone from '@/assets/svg/microphone.svg'
import type { Hardware, Product, Shop, MessageText } from '../home/types'
import { TaskType, IntentType, ProviderType, MessageType, ShowRightType, modeType } from '../home/enum'
import router from '@/router'
// 逻辑
import { useMessageHandler, useBScroll, useScreenOrientation, useAudioConversion } from '../home/composables/index'
const { t } = useI18n()
const createMessageHandler = useMessageHandler()
const {
  agentMessageList,
  handleTTSMessage,
  handleDialogueList
} = createMessageHandler(t)
// bs库滚动处理
const { messageScrollRef, initBScroll, updateScroll } = useBScroll()
// 屏幕方向处理
const { screenOrientation, mlScreen } = useScreenOrientation()
// 音频转换处理
const { ttsApi, arsApi } = useAudioConversion()
// 标记组件为非响应式
// const photoComponent = markRaw(Photo)
const NavigationComponent = markRaw(Navigation)
// const WeatherComponent = markRaw(Weather)
const MusicComponent = markRaw(Music)
const ShopComponent = markRaw(ShopCom)
const ProductComponent = markRaw(ProductCom)
const RestaurantsComponent = markRaw(Restaurants)
// 节点
const recorderBgRef1 = ref<HTMLElement | null>(null)
const recorderBgRef2 = ref<HTMLElement | null>(null)
const audioPlayRef = ref<HTMLAudioElement | null>(null)
const templateCardRef = ref<HTMLElement | null>(null)
const pressTimer = ref<number | null>(null)
// 播放控制
const isAnimating = ref<boolean>(false)
const isMonitoring = ref<boolean>(true)

// 是否播放
const isAudioPlay = ref<boolean>(false)
// 硬件列表
const hardwareList = reactive<Hardware[]>([
  {
    name: 'CAMERA',
    icon: Camera_1,
    isActive: false,
  },
  {
    name: 'CARSTATE',
    icon: Car,
    isActive: false,
  },
  {
    name: 'NAVIGATING',
    icon: Navigation_1,
    isActive: false,
  },
  {
    name: '电话',
    icon: Phone_1,
    isActive: false,
  },
  {
    name: '菜单',
    icon: Component_1,
    isActive: false,
  }
])
const hardwareDataList = reactive<Hardware[]>([
  {
    name: '摄像头',
    icon: Examination_0,
  },
  {
    name: '运动手环',
    icon: Fitness_band_0,
  },
  {
    name: '测量体温',
    icon: Temperature_0,
  },
  {
    name: '打急救电话',
    icon: Emergency_number_0,
  },
  {
    name: '导航',
    icon: Hospital_0,
  }
])
// Intent相关
// 当前Intent类型
const currentIntentType = ref<IntentType>(IntentType.ASR)
// 当前Intent的id
const currentIntentId = ref<string>('')
// 当前Intent的token
const currentIntenToken = ref<string>('')
// 当前Intent的消息
const currentIntentMsg = ref<string>('')

const hiddenTemplate = ref<boolean>(true)
onMounted(() => {
  // 开启音频媒体流
  handleRecorder()
  // 初始化滚动
  initBScroll()
  // 发送一个greetings
  sendIntent(IntentType.GREETINGS, { greetings: '' })
  // 发送一个modeType
  sendIntent(IntentType.MODETYPE, { modeType: modeType.AIOSMODE })
  if (templateCardRef.value) autoAnimate(templateCardRef.value)
  setTimeout(() => {
    return
    handleAgentMessageListChange()
  }, 1000)
  const resize = new ResizeObserver((entries) => {
    if (entries[0].contentRect.width <= 500) {
      hiddenTemplate.value = false
    } else {
      hiddenTemplate.value = true
    }
  })
  resize.observe(templateCardRef.value!)
})

// 模拟agentMessageList变化
const handleAgentMessageListChange = () => {
  agentMessageList.push(
    {
      text: '测试测试',
      type: 'agent',
      messageType: MessageType.TEXT,
    },
    {
      text: '测试测试',
      type: 'agent',
      messageType: MessageType.TEXT,
    },
    {
      text: '测试测试',
      type: 'agent',
      messageType: MessageType.TEXT,
    },
    {
      text: 'https://picsum.photos/200/300',
      type: 'agent',
      messageType: MessageType.IMAGE,
    },
    {
      text: 'https://picsum.photos/300/200',
      type: 'agent',
      messageType: MessageType.IMAGE,
    },
    {
      text: 'dasdsadsad',
      type: 'user',
      messageType: MessageType.TEXT,
    }
  )
}

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
      case TaskType.TTS:
        // 正则表达式规则，以菜单:`开头，以`结尾, 播放的消息文本
        let arsMessage = ''
        // 显示的消息文本
        let arsViewMessage = ''
        const { type, message } = handleTTSMessage(msg)
        switch (type) {
          case MessageType.JSON_MENU:
            const { data: productData } = JSON.parse(message)
            arsMessage = productData.shop.productList.map((product: Product) => {
              const { productName, productPrice } = product
              return `${productName},${productPrice}元`
            }).join('。')
            arsViewMessage = productData.shop.productList

            templateProduct.splice(0, templateProduct.length, ...productData.shop.productList)
            pushTemplateCard({
              id: 1,
              title: t('card.product'),
              size: 'medium',
              component: ProductComponent,
              componentProps: {
                templateProduct
              },
            })
            break;
          case MessageType.JSON_RESTAURANT:
            const { data: shopData } = JSON.parse(message)
            arsMessage = shopData.shop_list.map((shop: Shop) => {
              const { shopName, shopDescription } = shop
              return `${shopName},${shopDescription}`
            }).join('。')
            arsViewMessage = shopData.shop_list

            templateShop.splice(0, templateShop.length, ...shopData.shop_list)
            pushTemplateCard({
              id: 2,
              title: t('card.shop'),
              size: 'medium',
              component: ShopComponent,
              componentProps: {
                templateShop
              },
            })
            break;
          case MessageType.JSON_RESTAURANT_X:
            const restaurantData = JSON.parse(message)
            /* const data = {
              address: '',
              logo: '',
              storeId: '',
              storeName: ''
            } */
            arsViewMessage = restaurantData
            console.log('餐厅', JSON.parse(message));
            break
          case MessageType.USER:
            const { userId } = JSON.parse(message)
            arsMessage = `${getTimeGreeting(t)},${userId}`
            arsViewMessage = `${getTimeGreeting(t)},${userId}`
            break;
          case MessageType.WEATHER:
            const { result: weatherData } = JSON.parse(message)
            arsMessage = `今天是${weatherData.date}，${weatherData.week}，${weatherData.city}天气${weatherData.weather}`
            arsViewMessage = `今天是${weatherData.date}，${weatherData.week}，${weatherData.city}天气${weatherData.weather}`
            templateWeather.value = arsViewMessage
            break;
          case MessageType.MARKDOWN:
            const regex = /notify```\s*([\s\S]*?)```/
            arsMessage = msg.match(regex)?.[1]
            arsViewMessage = message
            break;
          case MessageType.TEXT:
            arsMessage = message
            arsViewMessage = message
            break;
        }
        handlePlayQueue(id, token, arsMessage, arsViewMessage, type)
        break;
      case TaskType.PROVIDER:
        hardwareList.forEach(item => {
          if (ProviderType[item.name as keyof typeof ProviderType] === msg) {
            item.isActive = true
            setTimeout(() => {
              item.isActive = false
            }, 5500);
          }
        })
        break;
      case TaskType.USER:
        handlePlayQueue(id, token, msg, msg, MessageType.TEXT, TaskType.USER)
        break
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
                  size: 'small',
                  component: Photo,
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
              size: 'medium',
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
              size: 'small',
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
              size: 'medium',
              component: RestaurantsComponent,
              componentProps: {
                restaurantsList: JSON.parse(content)
              },
            })
            break
        }
        break
    }
    // 图片处理
    if (nodeTitle === ProviderType.CAMERA && msg.includes(MessageType.IMAGE)) {
      handlePlayQueue(id, token, '', msg, MessageType.IMAGE)
    }
  } catch (error) {
    console.error('不是一个有效的JSON数据', error)
    const p = socketState.message.split(',')
    console.log(p)
  }
})
// 监听消息列表变化
watch(agentMessageList, () => updateScroll())
// 监听图片加载完成
const handleImageLoad = () => updateScroll()
// 媒体录音
const mediaRecorder = ref<MediaRecorder | null>(null)
// 音频上下文
const audioContext = ref<AudioContext | null>(null)
// 音频节点
const analyserNode = ref<AnalyserNode | null>(null)
// 当前播放状态
const isPlaying = ref(false)
// 当前是否在处理播放队列
const isProcessing = ref(false)
// 手动中断
const breakPlayQueue = ref(false)
interface Queue {
  id: string,
  token: string,
  msg: string,
  viewMsg: MessageText,
  msgType: MessageType,
  taskType: TaskType
}
// 播放队列
const playQueue = reactive<Array<Queue>>([])
// 显示队列
const viewQueue = reactive<Array<Queue>>([])
/**
 * 文本显示队列处理
 * @param msg 播放的文本
 * @param viewMsg 显示的文本
 * @param msgType 消息类型
 * @param intentType 意图类型
 */
const handlePlayQueue = async (id: string, token: string, msg: string, viewMsg: MessageText, msgType: MessageType = 'text', taskType: TaskType = 'TTS'): Promise<void> => {
  viewQueue.push({ id, token, msg, viewMsg, msgType, taskType })
  playQueue.push({ id, token, msg, viewMsg, msgType, taskType })
  // 立即显示文字内容
  if ((msg || viewMsg) && !isProcessing.value) {
    processViewQueue()
  }
  // 将需要语音播报的内容加入播放队列（仅语音需要的内容）
  if ((msg || msgType === MessageType.IMAGE)) {
    if (!isPlaying.value) {
      isPlaying.value = true
      if (!isProcessing.value || msg === currentIntentMsg.value) {
        await processPlayQueue()
      }
    } else {
      const checkQueue = setInterval(() => {
        if (!isPlaying.value && playQueue.length === 0) {
          clearInterval(checkQueue)
        }
      }, 100)
    }
  }
}
/**
 * 播放队列处理
 */
const processPlayQueue = async () => {
  while (playQueue.length > 0) {
    // 检测是否手动中断
    if (breakPlayQueue.value) break
    const item = playQueue.shift()
    if (item && item.msg) {
      const res = await ttsApi(item.msg)
      await handleAudioPlay(res.file)
      // 处理用户输入
      if (item.taskType === TaskType.USER) {
        handleRecorderTouchstart()
        startVolumeDetection()
      }
      if (isProcessing.value && item.msg === currentIntentMsg.value) break
    }
  }
  isPlaying.value = false
}
/**
 * 显示队列处理
 */
const processViewQueue = () => {
  while (viewQueue.length > 0) {
    const item = viewQueue.shift()
    if (item) {
      handleDialogueList(item.viewMsg, item.msgType)
      if (item.msgType === MessageType.IMAGE) {
        // 给摄像头硬件部分添加图片
        hardwareDataList[0].data = {
          type: 'img',
          value: item.viewMsg as string,
        }
      }
      if (item.taskType === TaskType.USER) {
        isProcessing.value = true
        currentIntentId.value = item.id
        currentIntenToken.value = item.token
        currentIntentMsg.value = item.viewMsg as string
        currentIntentType.value = IntentType.USERANSWER
      }
      if (isProcessing.value) break
    }
  }
}
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
// 是否有录音权限
const hasRecorderPermission = ref(true)
// 长按录音按钮
const handleRecorderTouchstart = () => {
  // 如果当前是在播放的状态，则暂停播放
  if (audioPlayRef.value && !audioPlayRef.value.paused) {
    audioPlayRef.value.pause()
    // 开始录音时手动中断播放
    breakPlayQueue.value = true
    // 在开始播放之前，查看是否需要截断
    if (currentIntentMsg.value) {
      const currentIntentMsgIndex = playQueue.findIndex((item) => item.viewMsg === currentIntentMsg.value)
      playQueue.splice(0, currentIntentMsgIndex + 1)
    } else {
      playQueue.splice(0)
    }
  }
  pressTimer.value = setTimeout(() => {
    isAnimating.value = true
    isMonitoring.value = true
    if (hasRecorderPermission.value) {
      // 恢复音频上下文
      audioContext.value?.resume().then(() => {
        mediaRecorder.value?.start()
      })
    } else {
      fetch('http://127.0.0.1:8081/start_record', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
    }
  }, 100)
}
// 移开录音按钮
const handleRecorderTouchend = () => {
  if (pressTimer.value) {
    isAnimating.value = false
    isMonitoring.value = false
    // 恢复自动中断
    isProcessing.value = false
    // 恢复手动中断
    breakPlayQueue.value = false
    clearTimeout(pressTimer.value)
    if (hasRecorderPermission.value) {
      mediaRecorder.value?.stop()
      stopVolumeDetection()
    } else {
      fetch('http://127.0.0.1:8081/stop_record', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(res => res.blob()).then(blob => {
        handleRecorderData(blob)
      })
    }
  }
}
// 处理录音
const handleRecorder = async () => {
  try {
    // 创建音频上下文和AnalyserNode
    audioContext.value = new AudioContext()
    analyserNode.value = audioContext.value.createAnalyser()
    analyserNode.value.fftSize = 256;
    // 获取媒体流
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        // 取消回音
        echoCancellation: true,
        // 降噪
        noiseSuppression: true,
        // 采样率
        // sampleRate: 44100,
      },
    })
    // 创建音频流源
    const source = audioContext.value.createMediaStreamSource(stream)
    source.connect(analyserNode.value)
    // 创建媒体录音
    mediaRecorder.value = new MediaRecorder(stream, {
      mimeType: 'audio/webm;codecs=opus',
      audioBitsPerSecond: 16000,
    })
    let chunks: Blob[] = []
    // 监听录音停止
    mediaRecorder.value.onstop = async () => {
      const blob = new Blob(chunks, { type: mediaRecorder.value?.mimeType })
      // 调用语音识别接口
      await handleRecorderData(blob)
      chunks = []
    }
    // 监听数据可用
    mediaRecorder.value.ondataavailable = (e) => {
      chunks.push(e.data)
    }
  } catch (err) {
    hasRecorderPermission.value = false
    console.error('获取麦克风失败', err)
  }
}
// 处理录音返回数据
const handleRecorderData = async (blob: Blob) => {
  // 调用语音识别接口
  const result: string = await arsApi(blob)
  agentMessageList.push(
    {
      text: result, type: 'user'
    },
    {
      text: '', type: 'agent', loading: true
    },
  )
  if (currentIntentType.value === IntentType.ASR) {
    sendIntent(IntentType.ASR, { asrText: result })
  } else if (currentIntentType.value === IntentType.USERANSWER) {
    sendIntent(IntentType.USERANSWER, { userAnswer: result, id: currentIntentId.value, token: currentIntenToken.value })
    // 恢复为ASR
    currentIntentType.value = IntentType.ASR
  }
  if (!isProcessing.value && playQueue.length) {
    processPlayQueue()
  }
  if (!isProcessing.value && viewQueue.length) processViewQueue()
}
// 在组件的响应式数据中定义
const volumeDetectionState = reactive({
  volumeDetectionRequestId: null as number | null,
  timerId: null as number | null,
  isFirstSentence: false,
  isMonitoring: false // 添加一个控制是否继续监测的标志
});

// 创建一个持续检测音量的函数
const detectVolume = () => {
  if (!analyserNode.value || !volumeDetectionState.isMonitoring) {
    // 如果不需要监测，则停止动画循环
    if (volumeDetectionState.volumeDetectionRequestId) {
      cancelAnimationFrame(volumeDetectionState.volumeDetectionRequestId);
      volumeDetectionState.volumeDetectionRequestId = null;
    }
    return;
  }

  // 说话音量的阈值
  const volume = 30
  // 多少秒没有声音后停止监听
  const timeout = 3000

  const dataArray = new Uint8Array(analyserNode.value.frequencyBinCount);
  analyserNode.value.getByteFrequencyData(dataArray);

  // 计算平均音量
  let sum = 0;
  for (let i = 0; i < dataArray.length; i++) {
    sum += dataArray[i];
  }
  const averageVolume = sum / dataArray.length;

  // 音量大于30则认为说过第一句话
  if (averageVolume >= volume && !volumeDetectionState.isFirstSentence) {
    volumeDetectionState.isFirstSentence = true;
  }

  if (averageVolume >= volume && volumeDetectionState.isFirstSentence && volumeDetectionState.timerId) {
    clearTimeout(volumeDetectionState.timerId);
    volumeDetectionState.timerId = null;
  }

  // 音量小于30并且说过第一句话则认为说完了，等待一段时间后关闭监听
  if (averageVolume < volume && volumeDetectionState.isFirstSentence) {
    if (!volumeDetectionState.timerId) {
      volumeDetectionState.timerId = setTimeout(() => {
        volumeDetectionState.isMonitoring = false;
        if (volumeDetectionState.volumeDetectionRequestId) {
          cancelAnimationFrame(volumeDetectionState.volumeDetectionRequestId);
          volumeDetectionState.volumeDetectionRequestId = null;
        }
        handleRecorderTouchend();
      }, timeout);
    }
  }

  // 持续检测 - 在函数内部调用 requestAnimationFrame
  volumeDetectionState.volumeDetectionRequestId = requestAnimationFrame(detectVolume);
};
// 启动音量检测的函数
const startVolumeDetection = () => {
  volumeDetectionState.isMonitoring = true;
  volumeDetectionState.isFirstSentence = false;
  // 清除之前的定时器
  if (volumeDetectionState.timerId) {
    clearTimeout(volumeDetectionState.timerId);
    volumeDetectionState.timerId = null;
  }
  // 开始检测循环
  detectVolume();
};
// 停止音量检测的函数
const stopVolumeDetection = () => {
  volumeDetectionState.isMonitoring = false;
  if (volumeDetectionState.timerId) {
    clearTimeout(volumeDetectionState.timerId);
    volumeDetectionState.timerId = null;
  }
  if (volumeDetectionState.volumeDetectionRequestId) {
    cancelAnimationFrame(volumeDetectionState.volumeDetectionRequestId);
    volumeDetectionState.volumeDetectionRequestId = null;
  }
};
type TemplateSize = 'medium' | 'small' | 'mini'
interface TemplateCard {
  size: TemplateSize
  component: string | Component
  id: number
  title: string
  componentProps?: any
}

const templateShop = reactive<Shop[]>([
  /* {
    shopName: '商品1',
    logo: 'https://picsum.photos/300/200?random=1',
    shopDescription: '商品描述1'
  },
  {
    shopName: '商品2',
    logo: 'https://picsum.photos/300/200?random=2',
    shopDescription: '商品描述1'
  },
  {
    shopName: '商品3',
    logo: 'https://picsum.photos/300/200?random=6',
    shopDescription: '商品描述1'
  },
  {
    shopName: '商品2',
    logo: 'https://picsum.photos/300/200?random=3',
    shopDescription: '商品描述1'
  },
  {
    shopName: '商品1',
    logo: 'https://picsum.photos/300/200?random=4',
    shopDescription: '商品描述1'
  },
  {
    shopName: '商品2',
    logo: 'https://picsum.photos/300/200?random=5',
    shopDescription: '商品描述1'
  } */
])
const templateProduct = reactive<Product[]>([
  /* {
    productName: '商品1',
    logo: 'https://picsum.photos/300/200?random=1',
    productContent: '商品描述1',
    productPrice: 10
  },
  {
    productName: '商品1',
    logo: 'https://picsum.photos/300/200?random=1',
    productContent: '商品描述1',
    productPrice: 10
  },
  {
    productName: '商品1',
    logo: 'https://picsum.photos/300/200?random=1',
    productContent: '商品描述1',
    productPrice: 10
  },
  {
    productName: '商品1',
    logo: 'https://picsum.photos/300/200?random=1',
    productContent: '商品描述1',
    productPrice: 10
  },
  {
    productName: '商品1',
    logo: 'https://picsum.photos/300/200?random=1',
    productContent: '商品描述1',
    productPrice: 10
  }, */
])
// 今天是2025-10-30，星期五，晴天，温度25度，湿度60%
const templateWeather = ref('')
const templateSize: Record<TemplateSize, number> = {
  mini: 1,
  small: 2,
  medium: 4,
}
const allCards = reactive<TemplateCard[]>([
  /* {
    id: Date.now() + Math.random(),
    title: t('card.navigation'),
    size: 'medium',
    component: NavigationComponent,
  }, */
  /* {
    id: Date.now() + Math.random(),
    title: t('card.photo'),
    size: 'small',
    component: photoComponent,
    componentProps: {
      photoList: [
        {
          image: 'https://picsum.photos/300/200?random=1',
        },
        {
          image: 'https://picsum.photos/300/200?random=2',
        },
        {
          image: 'https://picsum.photos/300/200?random=3',
        }
      ]
    },
  }, */
  /* {
    id: Date.now() + Math.random(),
    title: t('card.weather'),
    size: 'medium',
    component: WeatherComponent,
    componentProps: {
      templateWeather,
    },
  }, */
  /* {
    id: Date.now() + Math.random(),
    title: t('card.music'),
    size: 'small',
    component: MusicComponent,
  }, */
  /* {
    id: Date.now() + Math.random(),
    title: '餐厅',
    size: 'medium',
    component: ShopComponent,
    componentProps: {
      templateShop,
    },
  }, */
  /* {
    id: Date.now() + Math.random(),
    title: '菜单',
    size: 'medium',
    component: ProductComponent,
    componentProps: {
      templateProduct,
    },
  }, */
])
const cardRow = screenOrientation.value ? 4 : 4
// 计算属性，用于确定哪些卡片属于第一列，哪些属于第二列
const firstColumnCards = computed(() => {
  const cards: TemplateCard[] = []
  let totalHeight = 0

  for (const card of allCards) {
    const cardHeight = templateSize[card.size]
    if (totalHeight + cardHeight <= cardRow) {
      cards.push(card)
      totalHeight += cardHeight
    } else {
      break
    }
  }
  return cards
})

const secondColumnCards = computed(() => {
  return allCards.slice(firstColumnCards.value.length)
})

// 获取卡片的网格样式
const getCardGridStyle = (card: TemplateCard, index: number) => {
  const isFirstColumn = index < firstColumnCards.value.length
  const cardHeight = templateSize[card.size]

  if (isFirstColumn) {
    // 计算在第一列中的位置
    let startRow = 1
    for (let i = 0; i < index; i++) {
      startRow += templateSize[allCards[i].size]
    }
    return {
      'grid-column': '1',
      'grid-row': `${startRow} / span ${cardHeight}`
    }
  } else {
    // 计算在第二列中的位置
    const secondColumnIndex = index - firstColumnCards.value.length
    let startRow = 1
    for (let i = 0; i < secondColumnIndex; i++) {
      const cardIndex = firstColumnCards.value.length + i
      startRow += templateSize[allCards[cardIndex].size]
    }
    return {
      'grid-column': '2',
      'grid-row': `${startRow} / span ${cardHeight}`
    }
  }
}

// 添加卡片
const pushTemplateCard = (newCard: TemplateCard) => {
  /* const randomNum = Math.floor(Math.random() * 3) + 1
  const size = ['mini', 'small', 'medium'][randomNum - 1] as 'mini' | 'small' | 'medium'
  const newCard: TemplateCard = {
    id: Date.now() + Math.random(),
    title: '',
    size: screenOrientation.value ? size : 'small',
    component: '',
  } */
  // 添加到所有卡片的开头
  allCards.unshift(newCard)
  // 处理溢出 - 移除超出容量的卡片
  while (needToRemoveCard()) {
    allCards.pop()
  }
}

// 判断是否需要移除卡片
const needToRemoveCard = () => {
  // 检查两列总高度是否超过限制
  const firstColumnHeight = firstColumnCards.value.reduce((sum, card) => sum + templateSize[card.size], 0)
  const secondColumnHeight = secondColumnCards.value.reduce((sum, card) => sum + templateSize[card.size], 0)
  if (!screenOrientation.value && (secondColumnHeight || firstColumnHeight >= cardRow)) {
    return true
  }
  return firstColumnHeight > cardRow || secondColumnHeight > cardRow
}

const hiddenCard = computed(() => {
  return screenOrientation.value && mlScreen.value ? false : true
})
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
