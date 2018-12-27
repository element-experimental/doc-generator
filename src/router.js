import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/docs/home.vue'
// import SiteConfig from '../site-config'

Vue.use(Router)
// const sidebar = SiteConfig.sidebar

// const routes = Object.keys(SiteConfig.sidebar).reduce((arr, prefix) => {
//   const children = sidebar[prefix] || []
//   children.map(p => `${prefix}/${p}`)
// })
export function createRouter() {
  return new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
      {
        path: '/',
        name: 'home',
        component: Home
      },
    ]
  })
}


