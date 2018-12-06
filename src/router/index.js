import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/index.vue'
import ComponentPageWrap from '@/views/component.vue'
import navConfig from '../nav.config.json'

Vue.use(Router)

const cnNavConfig = navConfig['zh-CN']

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
      {
        path: '/zh-CN/component',
        redirect: '/component/installation',
        component: ComponentPageWrap,
        children: genComponentRoutes()
      },
      ...genMiscRoutes()
    ]
  })
}

function genComponentRoutes() {
  const configs = cnNavConfig.reduce((routes, { name, path, children, description, href, groups }) => {
    if (href) {
      return routes
    }
    const getRoute = (name, path, description) => {
      path = path.replace(/\//g, '')
      return {
        component: () => import(`@/docs/zh-CN/${ path }.md`),
        meta: {
          title: name,
          description: description
        },
        path
      }
    }
    if (children) {
      children.forEach(({ name, path, description }) => {
        routes.push(getRoute(name, path, description))
      })
    } else if (path) {
      routes.push(getRoute(name, path, description))
    } else if (groups) {
      groups.forEach(({ list }) => {
        list.forEach(({ path, title }) => {
          routes.push(getRoute(title, path, ''))
        })
      })
    }
    return routes
  }, [])
  return configs
}

function genMiscRoutes() {
  const guideRoute = {
    path: '/guide', // 指南
    redirect: '/guide/design',
    component: () => import('@/views/guide.vue'),
    children: [{
      path: '/design', // 设计原则
      // name: 'guide-design' + lang,
      // meta: { lang },
      component: () => import('@/views/design.vue'),
    }, {
      path: '/nav', // 导航
      // name: 'guide-nav' + lang,
      // meta: { lang },
      component: () => import('@/views/nav.vue'),
    }]
  };
  const resourceRoute = {
    path: '/resource', // 资源
    // meta: { lang },
    // name: 'resource' + lang,
    component: () => import('@/views/resource.vue'),
  };
  return [guideRoute, resourceRoute]
}

// function load() {}