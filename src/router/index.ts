import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import Home from '@/views/home/index.vue'
import HomeSpecialty from '@/views/home/home-specialty/index.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: import.meta.env.MODE === 'development' ? Home : HomeSpecialty,
    // component: Home,
    meta: { transition: 'home' },
  },
  {
    path: '/chat',
    name: 'Chat',
    component: () => import('@/views/chat/index.vue'),
    meta: { transition: 'chat' },
  },
  {
    path: '/home-specialty',
    name: 'home-specialty',
    component: () => import('@/views/home/home-specialty/index.vue'),
    meta: { transition: 'home-specialty' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
