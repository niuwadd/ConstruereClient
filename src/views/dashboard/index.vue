<template>
  <div class="dashboard size-full flex gap-4 p-10">
    <div class="flex flex-col w-[400px] rounded-2xl bg-white/25 text-2xl font-bold relative">
      <div class="absolute top-0 z-[2] flex justify-center items-center gap-4 w-full py-4 backdrop-blur-[2px]">
        <h2 @click="updateScroll" class="text-center text-lg">当前对话</h2>
      </div>
      <div ref="scrollRef" class="min-h-[200px] flex-1 px-8 overflow-hidden">
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
    <div ref="templateCardRef" class="flex flex-1 gap-4 text-white">
      <div v-show="hiddenTemplate" class="relative flex flex-col gap-4 w-[50%]">
        <transition name="template1">
          <div v-if="!templateShop.length" class="rounded-2xl bg-white/25 p-4 h-[100%]">
            <h3 class="font-bold pb-2">天气预报</h3>
            <div class="flex justify-center">
              <img :src="Weathe" alt=""></img>
            </div>
            <p class="py-4">{{ templateWeather }}</p>
          </div>
          <div v-else-if="templateShop.length" class="rounded-2xl bg-white/25 p-4 h-[100%]">
            <h3 class="font-bold pb-2">餐厅推荐</h3>
            <div class="hidden-scroll grid grid-cols-2 gap-4 h-[calc(100%-32px)] overflow-auto">
              <div class="flex flex-col gap-2 rounded-2xl shadow-[0_0_10px_4px_rgba(0,0,0,0.1)]"
                v-for="item in templateShop">
                <div class="w-full min-h-[100px] flex-1">
                  <img class="w-full rounded-t-2xl" :src="item.logo" alt="">
                </div>
                <h3 class="text-sm px-4">{{ item.shopName }}</h3>
                <div class="flex justify-between items-end px-4 pb-4">
                  <p class="text-xs w-[70%] truncate">{{ item.shopDescription }}</p>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
      <div v-show="hiddenTemplate" class="relative flex flex-col gap-4 w-[50%]">
        <transition name="template1">
          <div v-if="!templateProduct.length" class="rounded-2xl bg-white/25 p-4 h-[100%]">
            <h3 class="font-bold pb-2">音乐播放</h3>
            <div class="flex justify-center">
              <img :src="Music" alt="">
            </div>
            <div class="flex justify-center py-4">
              <Sonic class="w-[180px]" />
            </div>
          </div>
          <div v-else-if="templateProduct.length" class="rounded-2xl bg-white/25 p-4 h-[100%]">
            <h3 v-if="templateProduct.length" class="font-bold pb-2">菜单</h3>
            <div class="hidden-scroll grid grid-cols-2 gap-4 h-[calc(100%-32px)] overflow-auto">
              <div class="flex flex-col gap-2 rounded-2xl shadow-[0_0_10px_4px_rgba(0,0,0,0.1)]"
                v-for="item in templateProduct">
                <div class="w-full min-h-[100px] flex-1">
                  <img class="w-full rounded-t-2xl" :src="item.logo" alt="">
                </div>
                <h3 class="text-sm px-4">{{ item.productName }}</h3>
                <div class="flex justify-between items-end px-4 pb-4">
                  <p class="text-xs w-[70%] truncate">{{ item.productContent }}</p>
                  <p class="text-xs">{{ item.productPrice }}￥</p>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
      <!-- <div v-for="rows in templateRows" class="flex flex-col gap-4 w-[50%]">
        <div v-for="card in rows.cards" :class="`h-[${templateSize[card.size as keyof typeof templateSize]}%]`"
          class="rounded-2xl bg-white/25 p-8">
        </div>
      </div> -->
    </div>
    <audio ref="audioPlayRef" @ended="isAudioPlay = false" class="hidden" controls></audio>
    <div @click="router.push('/')" class="absolute top-2 right-2 rounded-3xl text-white text-sm ">
      智能体模式
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, watchEffect, nextTick, reactive, watch } from 'vue'
import Examination_0 from '@/assets/image/examination_0.png'
import Temperature_0 from '@/assets/image/temperature_0.png'
import Emergency_number_0 from '@/assets/image/emergency_number_0.png'
import Hospital_0 from '@/assets/image/hospital_0.png'
import Fitness_band_0 from '@/assets/image/fitness_band_0.png'
import Camera_1 from '@/assets/image/camera_1.png'
import Navigation_1 from '@/assets/image/navigation_1.png'
import Phone_1 from '@/assets/image/phone_1.png'
import Component from '@/assets/image/component.png'
import Car from '@/assets/image/car.png'
import Weathe from '@/assets/image/weathe.png'
import Music from '@/assets/image/music.png'
// 工具
import { sendIntent, socketState } from '@/utils/AIOSService'
import { getTimeGreeting } from '@/utils'
import BScroll from '@better-scroll/core'
// 组件
import MessageList from '../home/model/messageList.vue'
import Sonic from '@/assets/svg/sonic.svg'
import Microphone from '@/assets/svg/microphone.svg'
import type { Hardware, Product, Shop, MessageText } from '../home/types'
import { TaskType, IntentType, ProviderType, MessageType } from '../home/enum'
import router from '@/router'
// 逻辑
import { useMessageHandler } from '../home/composables/index'
const {
  agentMessageList,
  handleTTSMessage,
  handleDialogueList
} = useMessageHandler()

const recorderBgRef1 = ref<HTMLElement | null>(null)
const recorderBgRef2 = ref<HTMLElement | null>(null)
const audioPlayRef = ref<HTMLAudioElement | null>(null)
const scrollRef = ref<HTMLElement | null>(null)
const hardwareScrollRef = ref<HTMLElement | null>(null)
const templateCardRef = ref<HTMLElement | null>(null)
const pressTimer = ref<number | null>(null)
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
    icon: Component,
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
const bs = ref<BScroll | null>(null)
onMounted(() => {
  // 开启音频媒体流
  handleRecorder()
  // 监听方向变化
  orientationchange()
  // 初始化滚动
  initBScroll()
  // 发送一个greetings
  sendIntent(IntentType.GREETINGS, { greetings: '' })
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
    /* {
      text: {
        logo: 'https://picsum.photos/200/300',
        productContent: '这是商品内容',
        productName: '商品名称',
        productPrice: 100,
        productId: '1',
      },
      type: 'agent',
      messageType: MessageType.JSON_MENU,
    }, */
  )
}
watchEffect(async () => {
  try {
    if (!socketState.message) return
    console.log(JSON.parse(socketState.message))
    const { type, msg, id, token, nodeTitle } = JSON.parse(socketState.message)
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
            break;
          case MessageType.JSON_RESTAURANT:
            const { data: shopData } = JSON.parse(message)
            arsMessage = shopData.shop_list.map((shop: Shop) => {
              const { shopName, shopDescription } = shop
              return `${shopName},${shopDescription}`
            }).join('。')
            arsViewMessage = shopData.shop_list

            templateShop.splice(0, templateShop.length, ...shopData.shop_list)
            break;
          case MessageType.USER:
            const { userId } = JSON.parse(message)
            arsMessage = `${getTimeGreeting()},${userId}`
            arsViewMessage = `${getTimeGreeting()},${userId}`
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
watch(agentMessageList, () => {
  updateScroll()
})

// 监听图片加载完成
const handleImageLoad = () => {
  updateScroll()
}
// 屏幕方向
const screenOrientation = ref<number>(screen.orientation.angle)
// 屏幕方向改变
watch(screenOrientation, () => resetScroll())
// 持续监听屏幕方向
const orientationchange = () => {
  window.addEventListener('orientationchange', function () {
    screenOrientation.value = screen.orientation.angle
  });
  window.addEventListener('resize', function () {
    // 当宽度小于高度时，将屏幕方向设置为竖屏
    if (window.innerWidth <= window.innerHeight) {
      screenOrientation.value = 0
    } else {
      screenOrientation.value = 90
    }
  });
}
// 初始化滚动
const initBScroll = () => {
  nextTick(() => {
    if (scrollRef.value) {
      bs.value = new BScroll(scrollRef.value, {
        probeType: 3,
        click: true
      })
    }
    if (hardwareScrollRef.value) {
      new BScroll(hardwareScrollRef.value, {
        probeType: 3,
        scrollX: true
      })
    }
  })
}
// 重置滚动
const resetScroll = () => {
  nextTick(() => {
    // 先销毁现有的BScroll实例
    if (bs.value) {
      bs.value.destroy()
      bs.value = null
    }
    // 延迟一段时间后重新初始化
    setTimeout(() => {
      initBScroll()
    }, 200)
  })
}
// 更新滚动
const updateScroll = () => {
  nextTick(() => {
    if (bs.value) {
      bs.value.refresh()
      bs.value.scrollTo(0, bs.value.maxScrollY, 300)
    }
  })
}
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
// 语音转文字
const arsApi = async (blob: Blob): Promise<string> => {
  const X_NLS_TOKEN = '23f3c7ff8cd646d198d24ea6ec41b0f0'
  return new Promise<string>((resolve, reject) => {
    fetch('/asr?appkey=YyCBssRoMTulHOyJ', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Length': blob.size.toString(),
        'X-NLS-Token': X_NLS_TOKEN,
        Host: 'nls-gateway-cn-shanghai.aliyuncs.com',
      },
      body: blob,
    })
      .then((res) => res.json())
      .then(({ result }) => {
        resolve(result)
      })
      .catch((err) => {
        console.log('asr调用出错', err);
        reject(err)
      })
  })
}
//文字转语音
const ttsApi = (
  text: string = '今天星期一，天气很好'
): Promise<{
  file: string
  msg: string
  code: 0
}> => {
  return new Promise((resolve) => {
    fetch(`/tts?text=${text}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((res: {
        file: string
        msg: string
        code: 0
      }) => {
        resolve(res)
      })
      .catch((error) => {
        console.error('获取音频失败:', error, text)
        resolve(error)
      })
  })
}
/* interface TemplateCard {
  size: 'medium' | 'small' | 'mini'
  vNode: string
}
const templateSize = {
  medium: 100,
  small: 50,
  mini: 25
}
const templateRows = reactive([
  {
    cards: [
      {
        size: 'medium',
        vNode: ``,
      }
    ]
  },
  {
    cards: [
      {
        size: 'small',
        vNode: ``,
      },
      {
        size: 'mini',
        vNode: ``,
      },
      {
        size: 'mini',
        vNode: ``,
      }
    ]
  }
]) */
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
const templateWeather = ref('')
/**
 * 推送模板卡片
 * @param {TemplateCard} templateCard
 */
/* const pushTemplateCard = () => {
  const [row_1, row_2] = templateRows
  row_1.cards.push({
    size: 'mini',
    vNode: ``,
  })

  // 处理第一行溢出：将多余的卡片移到第二行
  let rowHeight_1 = row_1.cards.reduce((sum, card) => sum + templateSize[card.size as keyof typeof templateSize], 0)
  while (rowHeight_1 > 100 && row_1.cards.length > 1) {
    const movedCard = row_1.cards.shift()!
    row_2.cards.push(movedCard)
    rowHeight_1 -= templateSize[movedCard.size as keyof typeof templateSize]
  }

  // 处理第二行溢出：删除超出高度限制的卡片
  let rowHeight_2 = row_2.cards.reduce((sum, card) => sum + templateSize[card.size as keyof typeof templateSize], 0)
  while (rowHeight_2 > 100 && row_2.cards.length > 0) {
    const removedCard = row_2.cards.shift()!
    rowHeight_2 -= templateSize[removedCard.size as keyof typeof templateSize]
  }
} */
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

.template1-enter-from {
  opacity: 0;
  transform: translateY(-400px);
}

.template1-leave-to {
  opacity: 0;
  transform: translateY(400px);
}

.template1-leave-active,
.template1-enter-active {
  transition: all .5s ease-out;
  position: absolute;
  width: 100%;
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
