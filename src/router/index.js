import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/student',
    name: 'student',
    component: () => import('../views/StudentView.vue')
  },
  {
    path: '/course',
    name: 'course',
    component: () => import('../views/CourseView.vue')
  },
  {
    path: '/grade',
    name: 'grade',
    component: () => import('../views/GradeView.vue')
  },
  {
    path: '/',
    name: '',
    component: () => import('../views/HomeView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
