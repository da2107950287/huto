import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'

Vue.use(VueRouter)

const routes = [
  {path:'',redirect:'/login'},
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/createRoom',
    name: 'CreateRoom',
    component: () => import(/* webpackChunkName: "room" */ '../views/CreateRoom.vue')

  },
  {
    path: '/index',
    name: 'Index',
    component: () => import(/* webpackChunkName: "room" */ '../views/Index.vue')
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
