import Vue from 'vue'
import Router from 'vue-router'
import Home from './components/Home.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: 'task/todo',
      component: Home,
      children: [
        {
          path: 'task/todo',
          component: () => import(/* webpackChunkName: "TodoTaskPage" */ '@/components/task/TodoTaskPage.vue')
        },
        {
          path: 'task/all',
          component: () => import(/* webpackChunkName: "TodoTaskPage" */ '@/components/task/AllTaskPage.vue')
        },
        {
          path: '/billing/*',
          component: () => import(/* webpackChunkName: "Developing" */ '@/components/Developing.vue')
        },
        {
          path: '/diary/*',
          component: () => import(/* webpackChunkName: "Developing" */ '@/components/Developing.vue')
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import(/* webpackChunkName: "Login" */ './components/user/Login.vue')
    }
    , {
      path: '*',
      redirect: '/'
    }
  ]
})
