import { ref } from 'vue'

export default function useScreenOrientation() {
  const screenOrientation = ref<number>(screen.orientation.angle)
  const smScreen = ref<boolean>(screen.width < 640)
  const mlScreen = ref<boolean>(screen.width < 768)
  const lgScreen = ref<boolean>(screen.width < 1024)
  const xlScreen = ref<boolean>(screen.width < 1280)

  const orientationchange = () => {
    window.addEventListener('orientationchange', function () {
      screenOrientation.value = screen.orientation.angle
    })
    window.addEventListener('resize', function () {
      // 当宽度小于高度时，将屏幕方向设置为竖屏
      if (window.innerWidth <= window.innerHeight) {
        screenOrientation.value = 0
      } else {
        screenOrientation.value = 90
      }
      smScreen.value = screen.width < 640
      mlScreen.value = screen.width < 768
      lgScreen.value = screen.width < 1024
      xlScreen.value = screen.width < 1280
    })
  }
  orientationchange()
  return {
    screenOrientation,
    mlScreen,
    orientationchange,
  }
}
