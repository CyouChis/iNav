import { createRouter, createWebHashHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import CategoryDetail from '../views/CategoryDetail.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/category/:categoryId',
    name: 'CategoryDetail',
    component: CategoryDetail
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
