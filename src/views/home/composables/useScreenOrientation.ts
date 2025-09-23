import { ref } from 'vue'

export default function useScreenOrientation() {
  const screenOrientation = ref<number>(screen.orientation.angle)

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
    })
  }

  return {
    screenOrientation,
    orientationchange,
  }
}
