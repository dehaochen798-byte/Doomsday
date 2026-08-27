import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue')
  },
  {
    path:'/text',
    name:'text',
    component:()=>import('@/views/text/text.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router