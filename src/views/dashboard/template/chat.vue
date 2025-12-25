<template>
  <div class="flex flex-col h-full text-2xl font-bold relative portrait:w-full portrait:h-[400px]">
    <div class="absolute top-0 z-[2] flex justify-center items-center gap-4 w-full pb-4 backdrop-blur-[2px]">
      <h2 @click="updateScroll" class="text-center text-lg">{{ $t('message.chatTitle') }}</h2>
    </div>
    <div ref="messageScrollRef" class="min-h-[100px] flex-1 overflow-hidden">
      <MessageList id="agentMessageList" class="pt-16 pb-28" :agentMessageList="agentMessageList"
        @imageLoad="handleImageLoad" />
    </div>
    <div v-if="props.isMicrophone" class="absolute bottom-0 z-[2] w-full backdrop-blur-[2px] flex justify-center">
      <div class="w-full h-[50px] p-2 bg-white/60 rounded-lg flex items-center">
        <!-- <input v-model="sendText" placeholder="请输入"
          class="absolute -top-10 left-2 text-base border-2 outline-none text-white flex-1 placeholder:text-sm w-0"
          type="text"> -->
        <input v-model="sendText" :placeholder="t('message.chatPlaceholder')"
          class="text-base outline-none text-gray-600 flex-1 placeholder:text-sm" type="text">
        <div class="flex gap-2 items-center">
          <div @click="handleRecord" class="rounded-full p-1" :class="isRecording ? 'bg-[#6860ff]/50' : ''">
            <div class="rounded-full p-1" :class="isRecording ? 'bg-[#6860ff]' : ''">
              <Voice class="size-6" :class="isRecording ? 'fill-white' : 'fill-gray-600'" />
            </div>
          </div>
          <div @click="handleSendMessage(sendText)">
            <Send class="size-6 fill-gray-600" />
          </div>
        </div>
      </div>
      <!-- <div class="relative">
        <div @touchstart.passive="handleRecorderTouchstart" @touchend.passive="handleRecorderTouchend"
          @contextmenu="(e) => { e.preventDefault() }"
          class="relative z-20 size-[70px] rounded-full bg-linear-to-r from-[#6886fc] to-[#6958fb] flex items-center justify-center">
          <Microphone class="scale-65 relative z-10" />
        </div>
        <div class="absolute inset-0 size-[70px] rounded-full bg-black/20 z-10 transition-all duration-300"
          :class="isAnimating ? 'recorder-bg-1' : ''">
        </div>
        <div class="absolute inset-0 size-[70px] rounded-full bg-black/10 z-10"
          :class="isAnimating ? 'recorder-bg-2' : ''">
        </div>
      </div> -->
    </div>
    <audio ref="audioPlayRef" @ended="isAudioPlay = false" class="hidden" controls></audio>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from "vue-router"
import { useI18n } from 'vue-i18n'
import type { Product, Shop, MessageText } from '@/types/types'
import { TaskType, IntentType, MessageType } from '@/types/enum'
import { sendIntent } from '@/utils/AIOSService'
import MessageList from '@/components/MessageList.vue'
// import Microphone from '@/assets/svg/microphone.svg'
import Send from '@/assets/svg/send.svg'
import Voice from '@/assets/svg/voice.svg'
import { getTimeGreeting } from '@/utils'
import { useMessageHandler, useBScroll, useVolumeMonitoring, useAudioConversion } from '@/composables/index'
const props = withDefaults(defineProps<{
  isMicrophone?: boolean
  message?: Array<MessageText>
  currentMessage?: MessageText
}>(), {
  isMicrophone: true, // 设置默认值为 true，你可以根据需要更改为 false 或其他值
  message: () => []
})
const { t } = useI18n()
const router = useRouter()
const createMessageHandler = useMessageHandler()
const {
  agentMessageList,
  handleTTSMessage,
  handleDialogueList
} = createMessageHandler(t)
// bs库滚动处理
const { messageScrollRef, initBScroll, updateScroll } = useBScroll()
// 音频转换处理
const { ttsApi, arsApi } = useAudioConversion()
onMounted(() => {
  // 开启音频媒体流
  handleRecorder()
  // 初始化滚动
  initBScroll()
  setTimeout(() => {
    return
    handleAgentMessageListChange()
  }, 1000)
})
onUnmounted(() => {
  if (mediaRecorder.value && mediaRecorder.value.state !== 'inactive') {
    mediaRecorder.value.stop();
  }
  if (audioContext.value) {
    audioContext.value.close();
  }
  /* if (stream.value) {
    stream.value.getTracks().forEach(track => track.stop());
  } */
})
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
// 监听消息列表变化
watch(agentMessageList, () => updateScroll())
watch(() => props.message, (value) => {
  value.forEach((item) => {
    agentMessageList.push({ ...item, text: item.msg, type: 'agent' })
    if (item.type === TaskType.USER) {
      currentIntentId.value = item.id
      currentIntenToken.value = item.token
      currentIntentMsg.value = item.viewMsg as string
      currentIntentType.value = IntentType.USERANSWER
    }
  })
}, { deep: true })
watch(() => props.currentMessage, (value) => {
  switch (value.type) {
    case TaskType.TTS:
      const { type, message } = handleTTSMessage(value.msg)
      let arsMessage = ''
      // 显示的消息文本
      let arsViewMessage = ''
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
          const restaurantData = JSON.parse(message)
          arsViewMessage = restaurantData
          break;
        case MessageType.USER:
          const { userId } = JSON.parse(message)
          arsMessage = `${getTimeGreeting(t)},${userId}`
          arsViewMessage = `${getTimeGreeting(t)},${userId}`
          break;
        case MessageType.WEATHER:
          const { result: weatherData } = JSON.parse(message)
          arsMessage = `今天是${weatherData.date}，${weatherData.week}，${weatherData.city}天气${weatherData.weather}`
          arsViewMessage = `今天是${weatherData.date}，${weatherData.week}，${weatherData.city}天气${weatherData.weather}`
          break;
        case MessageType.MARKDOWN:
          const regex = /notify```\s*([\s\S]*?)```/
          arsMessage = value.msg.match(regex)?.[1]
          arsViewMessage = message
          break;
        case MessageType.TEXT:
          arsMessage = message
          arsViewMessage = message
          break;
      }
      handlePlayQueue({
        id: value.id,
        token: value.token,
        msg: arsMessage,
        viewMsg: arsViewMessage,
        msgType: type,
        taskType: TaskType.TTS,
        isBackground: value.background
      })
      break;
    case TaskType.USER:
      handlePlayQueue({
        id: value.id,
        token: value.token,
        msg: value.msg,
        viewMsg: value.msg,
        msgType: MessageType.TEXT,
        taskType: TaskType.USER,
        isBackground: value.background
      })
      break;
  }
}, { deep: true })
// 监听图片加载完成
const handleImageLoad = () => updateScroll()
// 是否播放
const isAudioPlay = ref<boolean>(false)
const currentIntentType = ref<IntentType>(IntentType.ASR)
// 当前Intent的id
const currentIntentId = ref<string>('')
// 当前Intent的token
const currentIntenToken = ref<string>('')
interface Queue {
  id: string,
  token: string,
  msg: string,
  viewMsg: MessageText,
  msgType: MessageType,
  taskType: TaskType,
  isBackground?: boolean
}
const audioPlayRef = ref<HTMLAudioElement | null>(null)
// 媒体录音
const mediaRecorder = ref<MediaRecorder | null>(null)
// 音频上下文
const audioContext = ref<AudioContext | null>(null)
// 音频节点
const analyserNode = ref<AnalyserNode | null>(null)
// 正在录音中
const isRecording = ref<boolean>(false)
// 当前播放状态
const isPlaying = ref<boolean>(false)
// 当前是否在处理播放队列
const isProcessing = ref<boolean>(false)
// 手动中断
const breakPlayQueue = ref<boolean>(false)
// 当前Intent的消息
const currentIntentMsg = ref<string>('')
// 播放队列
const playQueue = reactive<Array<Queue>>([])
// 显示队列
const viewQueue = reactive<Array<Queue>>([])
const pressTimer = ref<number | null>(null)
// 播放控制
const isAnimating = ref<boolean>(false)
// 是否有录音权限
const hasRecorderPermission = ref<boolean>(true)
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
      console.log('结束录音', mediaRecorder.value);
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
// 处理录音返回数据
const handleRecorderData = async (blob: Blob) => {
  // 调用语音识别接口
  const result: string = await arsApi(blob)
  sendText.value = result
  return
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
    router.currentRoute.value.query = {}
    /* router.replace({
      query: {},
    }) */
  } else if (currentIntentType.value === IntentType.USERANSWER) {
    sendIntent(IntentType.USERANSWER, { userAnswer: result, id: currentIntentId.value, token: currentIntenToken.value })
    // 恢复为ASR
    currentIntentType.value = IntentType.ASR
  }
  if (!isProcessing.value && playQueue.length) {
    processPlayQueue()
  }
  if (!isProcessing.value) processViewQueue()
}
const { startVolumeDetection, stopVolumeDetection } = useVolumeMonitoring(analyserNode.value as AnalyserNode, handleRecorderTouchend)
/**
 * 文本显示队列处理
 * @param msg 播放的文本
 * @param viewMsg 显示的文本
 * @param msgType 消息类型
 * @param intentType 意图类型
 */
const handlePlayQueue = async (queueData: Queue): Promise<void> => {
  const { id, token, msg, viewMsg, msgType, taskType } = queueData
  viewQueue.push({ id, token, msg, viewMsg, msgType, taskType })
  playQueue.push({ id, token, msg, viewMsg, msgType, taskType })
  // 立即显示文字内容
  if ((msg || viewMsg) && !isProcessing.value) {
    processViewQueue()
  }
  // 将需要语音播报的内容加入播放队列（仅语音需要的内容）
  if ((msg || msgType === MessageType.IMAGE)) {
    console.log('语音队列-------', playQueue);
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
      /* if (item.taskType === TaskType.USER) {
        handleRecorderTouchstart()
        startVolumeDetection()
      } */
      if (isProcessing.value && item.msg === currentIntentMsg.value) break
    }
  }
  isPlaying.value = false
  if ('GET_USER_ANSWER' === TaskType.USER) {
    return
    handleRecorderTouchstart()
    startVolumeDetection()
  }
}

/**
 * 显示队列处理
 */
const processViewQueue = () => {
  while (viewQueue.length > 0) {
    const item = viewQueue.shift()
    if (item) {
      handleDialogueList(item.viewMsg, item.msgType, item.id, item.token)
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
// 发送的文本
const sendText = ref<string>('')
/**
 * 发送消息
 * @param text 
 */
const handleSendMessage = (text: string) => {
  if (!text) return
  sendText.value = ''
  agentMessageList.push(
    {
      text: text, type: 'user'
    },
    {
      text: '', type: 'agent', loading: true
    },
  )
  if (audioPlayRef.value && !audioPlayRef.value.paused) {
    audioPlayRef.value.pause()
  }
  isProcessing.value = false
  if (currentIntentType.value === IntentType.ASR) {
    sendIntent(IntentType.ASR, { asrText: text })
    router.currentRoute.value.query = {}
  } else if (currentIntentType.value === IntentType.USERANSWER) {
    sendIntent(IntentType.USERANSWER, { userAnswer: text, id: currentIntentId.value, token: currentIntenToken.value })
    // 恢复为ASR
    currentIntentType.value = IntentType.ASR
  }
  if (!isProcessing.value && playQueue.length) {
    processPlayQueue()
  }
  if (!isProcessing.value) processViewQueue()
}
/**
 * 录音按钮点击事件(开始/结束录音)
 */
const handleRecord = () => {
  isRecording.value = !isRecording.value
  if (isRecording.value) {
    if (audioPlayRef.value && !audioPlayRef.value.paused) {
      audioPlayRef.value.pause()
    }
    isProcessing.value = false
    audioContext.value?.resume().then(() => {
      console.log('开始录音', mediaRecorder.value);
      mediaRecorder.value?.start()
    })
  } else {
    mediaRecorder.value?.stop()
  }
}
</script>
<style lang="scss" scoped>
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