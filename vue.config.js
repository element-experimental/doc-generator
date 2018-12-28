
const path = require('path')
const docMdLoaderPath = require.resolve('./webpack-loader/doc-makrdown-loader')
const docPath = path.resolve('./src/docs')
const IS_SSR = process.env.type === 'SSR'

module.exports = {
  chainWebpack: (config) => {
    // 避免 eslint 校验格式，支持导入 md 文件
    config.merge({
      module: {
        rule: {
          eslint: {
            exclude: [docPath]
          }
        }
      },
      resolve: {
        extensions: ['.md']
      }
    })

    config.module.rule('markdown').test(/\.md$/)
      .use('vue-loader').loader('vue-loader').options({
        compilerOptions: {
          preserveWhitespace: true
        }
      }).end()
      .use('markdown-to-vue').loader(docMdLoaderPath)
    
    if (IS_SSR) {
      config
        .plugin('html')
        .tap(args => {
          args[0].template = path.resolve(__dirname, './ssr/index.html')
          return args
        })
    }
  }
}
