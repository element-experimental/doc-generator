
const path = require('path')
const docMdLoaderPath = require.resolve('./webpack-loader/doc-makrdown-loader')
const docPath = path.resolve('./src/docs')
const IS_SSR_START = process.env.SSR === 'START'

module.exports = {
  chainWebpack: (config) => {
    // 避免 eslint 校验格式
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
    
  },
  pluginOptions: {
    ssr: {
      templatePath: path.resolve(__dirname, `./${IS_SSR_START ? 'dist' : 'ssr'}/index.html`)
    }
  }
}