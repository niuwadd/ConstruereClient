import { ref, nextTick } from 'vue'
import BScroll from '@better-scroll/core'

export default function useBScroll() {
  const bs = ref<BScroll | null>(null)
  const portraitBs = ref<BScroll | null>(null)
  const portraitScrollRef = ref<HTMLElement | null>(null)
  const messageScrollRef = ref<HTMLElement | null>(null)
  const hardwareScrollRef = ref<HTMLElement | null>(null)
  // 初始化滚动
  const initBScroll = () => {
    nextTick(() => {
      if (messageScrollRef.value) {
        bs.value = new BScroll(messageScrollRef.value, {
          probeType: 3,
          click: true,
        })
      }
      if (hardwareScrollRef.value) {
        new BScroll(hardwareScrollRef.value, {
          probeType: 3,
          scrollX: true,
        })
      }
      if (portraitScrollRef.value) {
        portraitBs.value = new BScroll(portraitScrollRef.value, {
          probeType: 3,
          click: true,
          scrollY: true,
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
      if (portraitBs.value) {
        portraitBs.value.refresh()
        portraitBs.value.scrollTo(0, portraitBs.value.maxScrollY, 300)
      }
    })
  }

  return {
    initBScroll,
    resetScroll,
    updateScroll,
    portraitScrollRef,
    messageScrollRef,
    hardwareScrollRef,
  }
}
