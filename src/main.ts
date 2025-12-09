import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'
import Toast from 'vue-toastification'
import { initThriftClient, initStore } from '@/utils/AIOSService'
import './utils/AIOSService/index.js'
import 'vue-toastification/dist/index.css'
import './assets/css/tailwindcss.css'
import './assets/css/common.css'
import './style.css'
const pinia = createPinia()
const messages = {
  zh: {
    message: {
      hello: '你好',
      chatTitle: '对话',
      today: '今天是',
      weather: '天气',
      goodMorning: '早上好',
      goodNoon: '中午好',
      goodAfternoon: '下午好',
      goodEvening: '晚上好',
      notMessage: '暂无消息'
    },
    agent: {
      default: {
        title: '智能体',
        title_1: '我是您的智能体',
        description: 'Construere：唤醒硬件，智联万物',
      },
      chat: {
        title: '社交助手智能体',
        title_1: '我是您的社交助手',
        description: '我可以为你做',
      },
      medical: {
        title: '医疗助理智能体',
        title_1: '我是您的医疗助理',
        description: '我可以为你做',
        appName: '医疗助理',
      },
      takeout: {
        title: '点餐助手智能体',
        title_1: '我是您的点餐助手',
        description: '我可以为你做',
      },
      repair: {
        title: '车辆健康智能体',
        title_1: '我是您的车辆健康管家',
        description: '我可以为你做',
      },
    },
    hardware: {
      examination: '摄像头',
      fitnessBand: '运动手环',
      temperature: '测量体温',
      emergencyNumber: '打急救电话',
      hospital: '导航',
    },
    card: {
      weather: '天气',
      music: '音乐',
      product: '菜单',
      shop: '餐厅',
      navigation: '导航',
      photo: '照片',
    },
    mode: {
      agentMode: '智能体模式',
      aiosMode: 'AIOS模式',
    },
  },
  en: {
    message: {
      hello: 'Hello',
      chatTitle: 'Chat History',
      today: 'Today is',
      weather: 'Weather',
      goodMorning: 'Good morning',
      goodNoon: 'Good noon',
      goodAfternoon: 'Good afternoon',
      goodEvening: 'Good evening',
      notMessage: 'Not message',
    },
    agent: {
      default: {
        title: 'Agent',
        title_1: 'I am your agent',
        description: 'Construere：Unlock Your Hardware，Connect Everything',
      },
      chat: {
        title: 'Social Assistant Agent',
        title_1: 'I am your social assistant',
        description: 'I can do for you',
      },
      medical: {
        title: 'Medical Assistant Agent',
        title_1: 'I am your medical assistant',
        description: 'I can do for you',
        appName: 'Medical_Assistant_en',
      },
      takeout: {
        title: 'Takeout Assistant Agent',
        title_1: 'I am your takeout assistant',
        description: 'I can do for you',
      },
      repair: {
        title: 'Car Health Assistant Agent',
        title_1: 'I am your car health assistant',
        description: 'I can do for you',
      },
    },
    hardware: {
      examination: 'Camera',
      fitnessBand: 'Fitness Band',
      temperature: 'Temperature Measurement',
      emergencyNumber: 'Call Emergency Number',
      hospital: 'Navigation',
    },
    card: {
      weather: 'Weather',
      music: 'Music',
      product: 'Menu',
      shop: 'Restaurant',
      navigation: 'Navigation',
      photo: 'Photo',
    },
    mode: {
      agentMode: 'Agent Mode',
      aiosMode: 'AIOS Mode',
    },
  },
}
export { router }
const i18n = createI18n({
  legacy: false,
  locale: 'zh', // 设置默认语言
  fallbackLocale: 'zh', // 设置回退语言（当当前语言缺少翻译时使用）
  messages, // 注入翻译消息
})
createApp(App)
  .use(router)
  .use(autoAnimatePlugin)
  .use(i18n)
  .use(pinia)
  .use(Toast)
  .mount('#app')
// 在 Pinia 挂载后再初始化 store 和服务
initStore()
initThriftClient()
