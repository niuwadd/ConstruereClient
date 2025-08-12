import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './utils/AIOSService/index.js'
import './assets/css/tailwindcss.css'
import './assets/css/common.css'
import './style.css'
createApp(App).use(router).mount('#app')
