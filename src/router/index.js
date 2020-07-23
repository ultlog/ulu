import Vue from 'vue'
import Router from 'vue-router'
import log from '@/components/log'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'log',
      component: log
    },
    {
      path: '/log',
      name: 'log',
      component: log
    }
  ]
})
