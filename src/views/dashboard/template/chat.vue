<template>
  <div class="flex flex-col h-full text-2xl font-bold relative portrait:w-full portrait:h-[400px]">
    <div class="absolute top-0 z-[2] flex justify-center items-center gap-4 w-full pb-4 backdrop-blur-[2px]">
      <h2 class="text-center text-lg">{{ $t('message.chatTitle') }}</h2>
    </div>
    <div ref="messageScrollRef" class="min-h-[200px] flex-1 overflow-hidden">
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
        <div class="absolute inset-0 size-[70px] rounded-full bg-black/20 z-10 transition-all duration-300"
          :class="isAnimating ? 'recorder-bg-1' : ''">
        </div>
        <div class="absolute inset-0 size-[70px] rounded-full bg-black/10 z-10"
          :class="isAnimating ? 'recorder-bg-2' : ''">
        </div>
      </div>
    </div>
    <audio ref="audioPlayRef" @ended="isAudioPlay = false" class="hidden" controls></audio>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, watchEffect, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { getTimeGreeting } from '@/utils'
import type { Hardware, Product, Shop, MessageText } from '@/types/types'
import { TaskType, IntentType, ProviderType, MessageType, ShowRightType, modeType } from '@/types/enum'
import { sendIntent, socketState } from '@/utils/AIOSService'
import MessageList from '@/components/messageList.vue'
import Microphone from '@/assets/svg/microphone.svg'
import { useMessageHandler, useBScroll, useVolumeMonitoring, useAudioConversion } from '@/composables/index'
const { t } = useI18n()
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
  // 发送一个greetings
  sendIntent(IntentType.GREETINGS, { greetings: '' })
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
      case TaskType.USER:
        handlePlayQueue(id, token, msg, msg, MessageType.TEXT, TaskType.USER)
        break
      case TaskType.SHOWR:
        /* switch (srType) {
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
        } */
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
  taskType: TaskType
}
const audioPlayRef = ref<HTMLAudioElement | null>(null)
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
// 当前Intent的消息
const currentIntentMsg = ref<string>('')
// 播放队列
const playQueue = reactive<Array<Queue>>([])
// 显示队列
const viewQueue = reactive<Array<Queue>>([])
const pressTimer = ref<number | null>(null)
// 播放控制
const isAnimating = ref<boolean>(false)
const isMonitoring = ref<boolean>(true)
// 是否有录音权限
const hasRecorderPermission = ref(true)
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
const { startVolumeDetection, stopVolumeDetection } = useVolumeMonitoring(analyserNode.value as AnalyserNode, handleRecorderTouchend)
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