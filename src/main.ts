import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import router from './router'
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'
import './utils/AIOSService/index.js'
import './assets/css/tailwindcss.css'
import './assets/css/common.css'
import './style.css'

const messages = {
  zh: {
    greeting: '欢迎！',
    message: {
      hello: '你好',
      logText: '唤醒硬件，智联万物',
      agentTitle: '智能体',
      agentIntroduction: '我是您的智能体',
      chatTitle: '当前对话',
      chatAgengentTitle: '社交助手智能体',
      chatAgentIntroduction: '我是您的社交助手',
      medicalAgentTitle: '医疗助理智能体',
      medicalIntroduction: '我是您的医疗助理',
      takeoutAgentTitle: '外卖助手智能体',
      takeoutIntroduction: '我是您的外卖助手',
      repairAgentTitle: '车辆健康智能体',
      repairIntroduction: '我是您的车辆健康管家',
    },
  },
  en: {
    greeting: 'Hello!',
    message: {
      hello: 'hello',
      logText: 'Wake up hardware, connect everything',
      agentTitle: 'Agent',
      agentIntroduction: 'I am your agent',
      chatTitle: 'Current conversation',
      chatAgengentTitle: 'Social Assistant Agent',
      chatAgentIntroduction: 'I am your social assistant',
      medicalAgentTitle: 'Medical Assistant Agent',
      medicalIntroduction: 'I am your medical assistant',
      takeoutAgentTitle: 'Takeout Assistant Agent',
      takeoutIntroduction: 'I am your takeout assistant',
      repairAgentTitle: 'Repair Assistant Agent',
      repairIntroduction: 'I am your repair assistant',
    },
  },
}

const i18n = createI18n({
  legacy: false,
  locale: 'zh', // 设置默认语言
  fallbackLocale: 'zh', // 设置回退语言（当当前语言缺少翻译时使用）
  messages, // 注入翻译消息
})
createApp(App).use(router).use(autoAnimatePlugin).use(i18n).mount('#app')
console.log('打包', import.meta.env)
