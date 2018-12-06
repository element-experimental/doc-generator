import Vue from 'vue'
import App from './App.vue'
import { createRouter } from './router'
import ElementUI from 'element-ui'
import demoBlock from './components/demo-block'
import MainFooter from './components/footer'
import MainHeader from './components/header'
import SideNav from './components/side-nav'
import FooterNav from './components/footer-nav'

Vue.config.productionTip = false
Vue.use(ElementUI)

Vue.component('demo-block', demoBlock)
Vue.component('main-footer', MainFooter)
Vue.component('main-header', MainHeader)
Vue.component('side-nav', SideNav)
Vue.component('footer-nav', FooterNav)

export async function createApp({
  beforeApp = () => {},
  afterApp = () => {}
} = {}) {
  const router = createRouter()
  await beforeApp({
    router
  })
  const app = new Vue({
    router,
    render: h => h(App)
  })
  const result = {
    app,
    router
  }
  await afterApp(result)
  return result
}

