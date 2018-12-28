import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/docs/home.vue'
import SiteConfig from '../site-config'

Vue.use(Router)
const sidebar = SiteConfig.sidebar

const pathSet = new Set()
const entries = Object.keys(SiteConfig.sidebar)
const routes = entries.reduce((acc, prefix) => {
  const { children } = sidebar[prefix] || { children: [] }
  const arr = []
  for (const p of children) {
    const path = `${prefix}/${p}`
    const filePath = `./docs${path}`
    if (pathSet.has(path)) {
      continue
    }
    pathSet.add(path)
    arr.push({
      component: () => import(filePath),
      // component: filePath,
      path
    })
  }
  return acc.concat(arr)
}, [])

console.log(routes)

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
      // {
      //   path: '/component/alert',
      //   component: () => import('./docs/component/alert')
      // },
      {
        path: '/guide/design',
        component: () => import('./docs//guide/design')
      },
      // ...routes,
      // routes[0],
      {
        path: '*',
        component: {
          render(h) {
            return h('div', { staticClass: 'not-found' }, ['404 not found'])
          }
        }
      }
    ]
  })
}


