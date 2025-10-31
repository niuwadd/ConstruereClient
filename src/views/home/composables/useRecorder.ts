import { ref, reactive } from 'vue'
import { sendIntent } from '@/utils/AIOSService'
import { IntentType } from '../enum'
import { useMessageHandler, useAudioConversion } from '../composables/index'
const { handleUserMessage } = useMessageHandler()
const { arsApi } = useAudioConversion()
export default function useRecorder() {
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
    handleUserMessage(result)
    if (currentIntentType.value === IntentType.ASR) {
      sendIntent(IntentType.ASR, { asrText: result })
    } else if (currentIntentType.value === IntentType.USERANSWER) {
      sendIntent(IntentType.USERANSWER, {
        userAnswer: result,
        id: currentIntentId.value,
        token: currentIntenToken.value,
      })
      // 恢复为ASR
      currentIntentType.value = IntentType.ASR
    }
    /* if (!isProcessing.value && playQueue.length) {
      processPlayQueue()
    }
    if (!isProcessing.value && viewQueue.length) processViewQueue() */
  }
  // 长按录音按钮
  const handleRecorderTouchstart = () => {
    // 如果当前是在播放的状态，则暂停播放
    if (audioPlayRef.value && !audioPlayRef.value.paused) {
      audioPlayRef.value.pause()
      // 开始录音时手动中断播放
      breakPlayQueue.value = true
      // 在开始播放之前，查看是否需要截断
      /* if (currentIntentMsg.value) {
        const currentIntentMsgIndex = playQueue.findIndex(
          (item) => item.viewMsg === currentIntentMsg.value
        )
        playQueue.splice(0, currentIntentMsgIndex + 1)
      } else {
        playQueue.splice(0)
      } */
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
  return {
    handleRecorder,
    handleRecorderData,
    startVolumeDetection,
    stopVolumeDetection,
    handleRecorderTouchstart,
    handleRecorderTouchend,
    audioPlayRef,
    currentIntentMsg,
    currentIntenToken,
    currentIntentId,
    currentIntentType,
    isProcessing,
    isPlaying,
    isAnimating,
    hasRecorderPermission,
    breakPlayQueue,
  }
}
