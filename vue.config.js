
const nodeExternals = require('webpack-node-externals')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')

const isSSR = process.env.ENTRY_TYPE === 'SSR'
const extractCSS = process.env.NODE_ENV === 'production' && !isSSR

module.exports = {
  css: {
    extract: extractCSS
  },
  chainWebpack: (config) => {
    if (isSSR) {
      const SSR_TYPE = process.env.SSR_TYPE
      if (!SSR_TYPE) {
        throw new Error('SSR_TYPE is required')
      }
      // 移除 cache-loader，rules 是一个 chainMap，使用 clear 方法清除https://github.com/neutrinojs/webpack-chain#chainedmap
      const vueRule = config.module.rule('vue')
      vueRule.uses.clear()
      vueRule.use('vue-loader').loader('vue-loader')

      if (SSR_TYPE === 'server') {
        const externals = nodeExternals({
          whitelist: /\.css$/
        })
        config.target('node').devtool('source-map').externals(externals)
        config.output.libraryTarget('commonjs2')
        config.plugin('VueSSRServerPlugin').use(VueSSRServerPlugin)
        // https://github.com/webpack-contrib/mini-css-extract-plugin/issues/90#issuecomment-410581945
        // config.module.rule('extract-css').test(/\.(sa|sc|c)ss$/).use('css-loader/locals').loader('css-loader/locals').end()   
      } else {
        // https://ssr.vuejs.org/zh/guide/build-config.html#%E5%AE%A2%E6%88%B7%E7%AB%AF%E9%85%8D%E7%BD%AE-client-config
        config.plugin('VueSSRClientPlugin').use(VueSSRClientPlugin)
      }
    }
  }
}