import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import DataA from './views/DataA.vue'
import DataB from './views/DataB.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/dataA',
      name: 'DataA',
      component: DataA
    },
      {
      path: '/dataB',
      name: 'DataB',
      component: DataB
    },
//    {
//      //path: '/b',
//      //name: 'tableB',
//      // route level code-splitting
//      // this generates a separate chunk (about.[hash].js) for this route
//      // which is lazy-loaded when the route is visited.
//      //component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
//    }
  ]
})
