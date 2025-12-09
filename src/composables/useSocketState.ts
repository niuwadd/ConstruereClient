import { watchEffect } from 'vue'
import { socketState } from '@/utils/AIOSService'
export default function useSocketState() {
  watchEffect(async () => {
    try {
      if (!socketState.message) return
      console.log(JSON.parse(socketState.message))
      const { msg } = JSON.parse(socketState.message)
      // 如果消息为空，不执行后面代码
      if (msg === '') return
    } catch (error) {
      console.error('不是一个有效的JSON数据', error)
      const p = socketState.message.split(',')
      console.log(p)
    }
  })
  return {}
}
