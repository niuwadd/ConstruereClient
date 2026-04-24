import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
// import Home from '@/views/home/index.vue'
import HomeBase from '@/views/home/index.vue'
// import HomeSpecialty from '@/views/home/home-specialty/index.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    // component: import.meta.env.VITE_APP_HOME_COMPONENT === 'Home' ? Home : HomeSpecialty,
    // component: Home,
    // component: HomeSpecialty,
    component: HomeBase,
    meta: { transition: 'home' },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    redirect: '/dashboard/homePage',
    component: () => import('@/views/dashboard/index.vue'),
    meta: { transition: 'dashboard' },
    children: [
      {
        path: '/dashboard/homePage',
        name: 'dashboardHomePage',
        component: () => import('@/views/dashboard/homePage.vue'),
        meta: { transition: 'dashboardHomePage' },
      },
      {
        path: '/dashboard/agentList',
        name: 'dashboardAgentList',
        component: () => import('@/views/dashboard/agentList.vue'),
        meta: { transition: 'dashboardAgentList' },
      },
    ],
  },
  {
    path: '/home-specialty',
    name: 'home-specialty',
    component: () => import('@/views/home/home-specialty/index.vue'),
    meta: { transition: 'home-specialty' },
  },
  {
    path: '/home-base',
    name: 'home-base',
    component: () => import('@/views/home/home-base/index.vue'),
    meta: { transition: 'home-base' },
  },
  {
    path: '/home-nopicture',
    name: 'home-nopicture',
    component: () => import('@/views/home/home-nopicture/index.vue'),
    meta: { transition: 'home-nopicture' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
