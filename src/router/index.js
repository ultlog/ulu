import Vue from 'vue'
import Router from 'vue-router'
import log from '@/components/log'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'log',
      component: log
    }
  ]
})
