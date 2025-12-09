<template>
  <div ref="portraitScrollRef"
    class="bg-linear-to-b from-[#E4DBED] via-[#E8EADE] to-[#ECDEDF] size-full portrait:h-min-[200px] portrait:overflow-hidden ">
    <div class="flex portrait:gap-4 portrait:flex-col landscape:size-full ">
      <!-- agent 列表 -->
      <div
        class="flex flex-col justify-between items-center pl-4 pb-4 pt-14 portrait:flex-row portrait:pt-4 portrait:px-8">
        <ul class="flex gap-4 flex-col portrait:flex-row">
          <li v-for="item in agentList" class="size-8 sm:size-10" :class="item.isActive ? '' : 'opacity-50'">
            <img :src="item.icon" alt="" />
          </li>
        </ul>
        <div class="flex flex-col gap-2 portrait:flex-row">
          <div @click="router.go(-1)" class="size-[40px] flex justify-center items-center rounded-full bg-white/50">
            <Left class="size-[60%]" />
          </div>
        </div>
      </div>
      <!-- 卡片 -->
      <div
        class="container flex flex-col gap-4 relative px-8 py-4 w-[380px] min-w-[240px] landscape:overflow-auto portrait:w-full portrait:self-center">
        <h2 class="text-center text-lg font-bold">{{ currentAgent?.title }}</h2>
        <!-- 设备卡片 -->
        <div class="rounded-4xl shadow-[0_0_10px_4px_rgba(0,0,0,0.1)] relative p-1 mt-20">
          <div class="flex flex-col gap-2 rounded-4xl py-4 px-6">
            <div class="min-h-[120px] relative">
              <Transition name="hander" mode="out-in">
                <img class="bot-img w-[180px] absolute -top-24 left-[50%] transform-[translateX(-50%)]"
                  :src="currentAgent?.icon" :key="currentAgent?.title">
                </img>
              </Transition>
            </div>
            <div class="text-xl font-bold font-sans text-gray-600 relative z-[2]">
              <p>{{ $t('message.hello') }}，</p>
              <p>{{ currentAgent?.title_1 }}</p>
            </div>
            <p class="text-sm font-bold text-gray-500 relative z-[2]">{{ currentAgent?.description }}</p>
            <div class="w-full relative whitespace-nowrap overflow-hidden" ref="hardwareScrollRef">
              <div class="inline-block">
                <div class="relative inline-block size-[120px] pr-2" v-for="item in hardwareDataList" :key="item.name">
                  <div class="size-full rounded-2xl overflow-hidden bg-[#fbfbfb]">
                    <img class="" :src="item.data ? item.data.value : item.icon" alt=""></img>
                  </div>
                  <p
                    class="absolute bottom-2 left-[50%] transform-[translateX(-50%)] text-sm font-bold text-gray-500 text-wrap text-center">
                    {{ item.name }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 设备列表 -->
        <Transition v-if="screenOrientation" name="control" mode="out-in">
          <div v-show="currentAgent" class="flex justify-between mt-auto">
            <div v-for="item in hardwareList" class="bg-white rounded-full p-2"
              :class="item.isActive ? 'animate-bounce' : ''">
              <img class="w-[30px]" :src="item.icon" alt="">
            </div>
          </div>
        </Transition>
      </div>
      <!-- 横屏出现 -->
      <div v-if="screenOrientation"
        class="flex flex-col flex-1 min-w-[50%] rounded-l-4xl bg-white/25 p-8 text-2xl font-bold relative">
        <div class="absolute top-0 z-[2] flex justify-center items-center gap-4 w-full py-4 backdrop-blur-[2px]">
          <h2 @click="updateScroll" class="text-center text-lg">{{ $t('message.chatTitle') }}</h2>
        </div>
        <div ref="messageScrollRef" class="min-h-[200px] flex-1 overflow-hidden">
          <MessageList id="agentMessageList" class="pt-8 pb-24" :agentMessageList="agentMessageList"
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
      <!-- 消息列表 -->
      <MessageList class="px-8 min-h-[100%] pb-30" v-if="!screenOrientation" :agentMessageList="agentMessageList"
        @imageLoad="handleImageLoad" />
    </div>
    <!-- 录音 -->
    <Transition v-if="!screenOrientation" name="control" mode="out-in">
      <!--  backdrop-blur-xs -->
      <div class="flex justify-center w-full pb-10 fixed bottom-0 left-[50%] transform-[translateX(-50%)]">
        <div class="relative">
          <div @touchstart.passive="handleRecorderTouchstart" @touchend.passive="handleRecorderTouchend"
            class="relative z-20 size-[70px] rounded-full bg-[#6860ff] flex items-center justify-center">
            <Microphone class="scale-65 relative z-10" />
          </div>
          <div ref="recorderBgRef1"
            class="absolute inset-0 size-[70px] rounded-full bg-black/20 z-10 transition-all duration-300"
            :class="isAnimating ? 'recorder-bg-1' : ''"></div>
          <div ref="recorderBgRef2" class="absolute inset-0 size-[70px] rounded-full bg-black/10 z-10"
            :class="isAnimating ? 'recorder-bg-2' : ''"></div>
        </div>
      </div>
    </Transition>
    <audio ref="audioPlayRef" @ended="isAudioPlay = false" class="hidden" controls></audio>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, watchEffect, reactive, watch } from 'vue'
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
// 工具
import { sendIntent, socketState } from '@/utils/AIOSService'
import { getTimeGreeting } from '@/utils'
import { useI18n } from 'vue-i18n'
// 组件
import MessageList from '../../../components/MessageList.vue'
import Microphone from '@/assets/svg/microphone.svg'
import Left from '@/assets/svg/left.svg'
import type { Hardware, Product, Shop, MessageText } from '../../../types/types'
import { TaskType, IntentType, ProviderType, MessageType, AppName } from '../../../types/enum'
import router from '@/router'
// 逻辑
import { useMessageHandler, useBScroll, useAgent, useScreenOrientation, useAudioConversion } from '../../../composables/index'
const { t } = useI18n()
// Agent选择处理
const { agentList, currentAgent, handleAgent } = useAgent()
// bs库滚动处理
const { portraitScrollRef, messageScrollRef, hardwareScrollRef, initBScroll, resetScroll, updateScroll } = useBScroll()
// 消息处理
const createMessageHandler = useMessageHandler()
const {
  agentMessageList,
  handleTTSMessage,
  handleDialogueList
} = createMessageHandler(t)
// 屏幕方向处理
const { screenOrientation, orientationchange } = useScreenOrientation()
// 音频转换处理
const { ttsApi, arsApi } = useAudioConversion()
const recorderBgRef1 = ref<HTMLElement | null>(null)
const recorderBgRef2 = ref<HTMLElement | null>(null)
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
    name: t('hardware.examination'),
    icon: Examination_0,
  },
  {
    name: t('hardware.fitnessBand'),
    icon: Fitness_band_0,
  },
  {
    name: t('hardware.temperature'),
    icon: Temperature_0,
  },
  {
    name: t('hardware.emergencyNumber'),
    icon: Emergency_number_0,
  },
  {
    name: t('hardware.hospital'),
    icon: Hospital_0,
  }
])
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
    handleAgent(AppName.TAKEOUT)
  }, 1000)
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
    const { type, msg, id, token, appName, nodeTitle } = JSON.parse(socketState.message)
    // 如果消息为空，不执行后面代码
    if (msg === '') return
    // 当接收到不同类型时的处理
    switch (type) {
      case TaskType.TTS:
        // 正则表达式规则，以菜单:`开头，以`结尾, 播放的消息文本
        let arsMessage = ''
        // 显示的消息文本
        let arsViewMessage = ''
        console.log('成功---------', handleTTSMessage(msg));
        const { type, message } = handleTTSMessage(msg)
        switch (type) {
          case MessageType.JSON_MENU:
            const { data: productData } = JSON.parse(message)
            arsMessage = productData.shop.productList.map((product: Product) => {
              const { productName, productPrice } = product
              return `${productName},${productPrice}元`
            }).join('。')
            arsViewMessage = productData.shop.productList
            break;
          case MessageType.JSON_RESTAURANT:
            const { data: shopData } = JSON.parse(message)
            arsMessage = shopData.shop_list.map((shop: Shop) => {
              const { shopName, shopDescription } = shop
              return `${shopName},${shopDescription}`
            }).join('。')
            arsViewMessage = shopData.shop_list
            break;
          case MessageType.JSON_RESTAURANT_X:
            console.log('餐厅X', message);
            console.log('餐厅', JSON.parse(message));
            break
          case MessageType.USER:
            const { userId } = JSON.parse(message)
            arsMessage = `${getTimeGreeting(t)},${userId}`
            arsViewMessage = `${getTimeGreeting(t)},${userId}`
            console.log(arsMessage);
            break;
          case MessageType.WEATHER:
            const { result: weatherData } = JSON.parse(message)
            console.log('天气相关', weatherData);
            arsMessage = `${t('message.today')}${weatherData.date}，${weatherData.week}，${weatherData.city}${t('message.weather')}${weatherData.weather}`
            arsViewMessage = `${t('message.today')}${weatherData.date}，${weatherData.week}，${weatherData.city}${t('message.weather')}${weatherData.weather}`
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
    // 选择智能体
    if (appName) handleAgent(appName)
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
// 屏幕方向改变
watch(screenOrientation, () => resetScroll())
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
    console.log('----------处理语音播报', item);
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
    console.log('----------处理消息显示', item);
    if (item) {
      handleDialogueList(item.viewMsg, item.msgType, item.id, item.token)
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
/* 录音相关变量 */
const audioPlayRef = ref<HTMLAudioElement | null>(null)
const pressTimer = ref<number | null>(null)
const isAnimating = ref<boolean>(false)
const isMonitoring = ref<boolean>(true)
// 是否有录音权限
const hasRecorderPermission = ref(true)
// 媒体录音
const mediaRecorder = ref<MediaRecorder | null>(null)
// 音频上下文
const audioContext = ref<AudioContext | null>(null)
// 音频节点
const analyserNode = ref<AnalyserNode | null>(null)
// 手动中断
const breakPlayQueue = ref(false)
// 当前播放状态
const isPlaying = ref(false)
// 当前是否在处理播放队列
const isProcessing = ref(false)
// 当前Intent类型
const currentIntentType = ref<IntentType>(IntentType.ASR)
// 当前Intent的id
const currentIntentId = ref<string>('')
// 当前Intent的token
const currentIntenToken = ref<string>('')
// 当前Intent的消息
const currentIntentMsg = ref<string>('')
// 处理录音
const handleRecorder = async () => {
  try {
    // 创建音频上下文和AnalyserNode
    audioContext.value = new AudioContext()
    analyserNode.value = audioContext.value.createAnalyser()
    analyserNode.value.fftSize = 256
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
      })
        .then((res) => res.blob())
        .then((blob) => {
          handleRecorderData(blob)
        })
    }
  }
}
// 在组件的响应式数据中定义
const volumeDetectionState = reactive({
  volumeDetectionRequestId: null as number | null,
  timerId: null as number | null,
  isFirstSentence: false,
  isMonitoring: false, // 添加一个控制是否继续监测的标志
})
// 创建一个持续检测音量的函数
const detectVolume = () => {
  if (!analyserNode.value || !volumeDetectionState.isMonitoring) {
    // 如果不需要监测，则停止动画循环
    if (volumeDetectionState.volumeDetectionRequestId) {
      cancelAnimationFrame(volumeDetectionState.volumeDetectionRequestId)
      volumeDetectionState.volumeDetectionRequestId = null
    }
    return
  }

  // 说话音量的阈值
  const volume = 30
  // 多少秒没有声音后停止监听
  const timeout = 3000

  const dataArray = new Uint8Array(analyserNode.value.frequencyBinCount)
  analyserNode.value.getByteFrequencyData(dataArray)

  // 计算平均音量
  let sum = 0
  for (let i = 0; i < dataArray.length; i++) {
    sum += dataArray[i]
  }
  const averageVolume = sum / dataArray.length

  // 音量大于30则认为说过第一句话
  if (averageVolume >= volume && !volumeDetectionState.isFirstSentence) {
    volumeDetectionState.isFirstSentence = true
  }

  if (
    averageVolume >= volume &&
    volumeDetectionState.isFirstSentence &&
    volumeDetectionState.timerId
  ) {
    clearTimeout(volumeDetectionState.timerId)
    volumeDetectionState.timerId = null
  }

  // 音量小于30并且说过第一句话则认为说完了，等待一段时间后关闭监听
  if (averageVolume < volume && volumeDetectionState.isFirstSentence) {
    if (!volumeDetectionState.timerId) {
      volumeDetectionState.timerId = setTimeout(() => {
        volumeDetectionState.isMonitoring = false
        if (volumeDetectionState.volumeDetectionRequestId) {
          cancelAnimationFrame(volumeDetectionState.volumeDetectionRequestId)
          volumeDetectionState.volumeDetectionRequestId = null
        }
        handleRecorderTouchend()
      }, timeout)
    }
  }

  // 持续检测 - 在函数内部调用 requestAnimationFrame
  volumeDetectionState.volumeDetectionRequestId =
    requestAnimationFrame(detectVolume)
}
// 启动音量检测的函数
const startVolumeDetection = () => {
  volumeDetectionState.isMonitoring = true
  volumeDetectionState.isFirstSentence = false
  // 清除之前的定时器
  if (volumeDetectionState.timerId) {
    clearTimeout(volumeDetectionState.timerId)
    volumeDetectionState.timerId = null
  }
  // 开始检测循环
  detectVolume()
}
// 停止音量检测的函数
const stopVolumeDetection = () => {
  volumeDetectionState.isMonitoring = false
  if (volumeDetectionState.timerId) {
    clearTimeout(volumeDetectionState.timerId)
    volumeDetectionState.timerId = null
  }
  if (volumeDetectionState.volumeDetectionRequestId) {
    cancelAnimationFrame(volumeDetectionState.volumeDetectionRequestId)
    volumeDetectionState.volumeDetectionRequestId = null
  }
}
</script>
<style lang="scss" scoped>
.container {
  /* IE 10+ */
  -ms-overflow-style: none;

  /* Firefox */
  scrollbar-width: none;
}

.container::-webkit-scrollbar {
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

.control-leave-to,
.control-enter-from {
  opacity: 0;
  transform: translateY(100px);
}

.control-leave-active,
.control-enter-active {
  transition: all 0.3s ease;
}


.hander-enter-from {
  opacity: 0;
  transform: translate(-50%, 100px);
}

.hander-leave-to {
  opacity: 0;
  transform: translate(-50%, -100px);
}

.hander-enter-active {
  transition: all 0.5s ease;
}

.hander-leave-active {
  transition: all 0.3s ease;
}
</style>
