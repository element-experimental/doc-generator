
const path = require('path')
const nodeExternals = require('webpack-node-externals')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const docMdLoaderPath = require.resolve('./webpack-loader/doc-makrdown-loader')
const docPath = path.resolve('./src/docs')

const isSSR = process.env.ENTRY_TYPE === 'SSR'
const isProduction = process.env.NODE_ENV === 'production'
const extractCSS = isProduction && !isSSR
// todo: 使用 LRU 开启缓存优化

module.exports = {
  css: {
    extract: extractCSS
  },
  chainWebpack: (config) => {
    config.merge({
      module: {
        rule: {
          eslint: {
            exclude: [docPath]
          }
        }
      }
    })

    config.module.rule('markdown').test(/\.md$/)
      .use('vue-loader').loader('vue-loader').options({
        compilerOptions: {
          preserveWhitespace: true
        }
      }).end()
      .use('markdown-to-vue').loader(docMdLoaderPath)

    if (isSSR) {
      const SSR_TYPE = process.env.SSR_TYPE
      if (!SSR_TYPE) {
        throw new Error('SSR_TYPE is required')
      }
      // 移除 cache-loader，这会造成在服务端渲染出错。
      // rules 是一个 chainMap，使用 clear 方法清除 https://github.com/neutrinojs/webpack-chain#chainedmap
      const vueRule = config.module.rule('vue')
      vueRule.uses.clear()
      vueRule.use('vue-loader').loader('vue-loader').options({
        compilerOptions: {
          preserveWhitespace: true
        }
      })

      if (SSR_TYPE === 'server') {
        const externals = nodeExternals({
          whitelist: /\.css$/
        })
        config.target('node').devtool('source-map').externals(externals).externals({
          Vue: 'Vue',
          VueRouter: 'vue-router',
          ElementUI: 'ElementUI'
        })
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