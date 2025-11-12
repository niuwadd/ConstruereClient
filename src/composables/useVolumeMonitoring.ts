import { reactive } from 'vue'
export default function useVolumeMonitoring(
  analyserNode: AnalyserNode,
  handleRecorderTouchend: () => void
) {
  // 在组件的响应式数据中定义
  const volumeDetectionState = reactive({
    volumeDetectionRequestId: null as number | null,
    timerId: null as ReturnType<typeof setTimeout> | null,
    isFirstSentence: false,
    isMonitoring: false, // 添加一个控制是否继续监测的标志
  })
  // 创建一个持续检测音量的函数
  const detectVolume = () => {
    if (!analyserNode || !volumeDetectionState.isMonitoring) {
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

    const dataArray = new Uint8Array(analyserNode.frequencyBinCount)
    analyserNode.getByteFrequencyData(dataArray)

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
    startVolumeDetection,
    stopVolumeDetection,
  }
}
