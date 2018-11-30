// https://vuepress.vuejs.org/zh/guide/using-vue.html#%E6%B5%8F%E8%A7%88%E5%99%A8%E7%9A%84-api-%E8%AE%BF%E9%97%AE%E9%99%90%E5%88%B6
export default {
  functional: true,
  render (h, { parent, children }) {
    if (parent._isMounted) {
      return children
    } else {
      parent.$once('hook:mounted', () => {
        parent.$forceUpdate()
      })
    }
  }
}
