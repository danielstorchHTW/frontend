import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/student',
    name: 'student',
    component: () => import(/* webpackChunkName: "about" */ '../views/StudentView.vue')
  },
  {
    path: '/course',
    name: 'course',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/CourseView.vue')
  },
  {
    path: '/grade',
    name: 'grade',
    component: () => import(/* webpackChunkName: "about" */ '../views/GradeView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
