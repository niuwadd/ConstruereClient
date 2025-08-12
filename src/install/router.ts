import { createRouter, createWebHistory } from 'vue-router'
const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/home/home-base/index.vue'),
  },
]

createRouter({
  history: createWebHistory(),
  routes,
})
/* export default {
  install(app) {
    return app.use(routes)
  },
} */
