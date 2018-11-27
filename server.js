const express = require('express')
const server = express()
const fs = require('fs')
const { createBundleRenderer } = require('vue-server-renderer')

const bundle = require('./ssr-dist/vue-ssr-server-bundle.json')
const clientManifest = require('./ssr-dist/vue-ssr-client-manifest.json')

const renderer = createBundleRenderer(bundle, {
  runInNewContext: false,
  template: fs.readFileSync('./ssr/index.template.html', 'utf-8'),
  clientManifest
})

server.use('/js', express.static('./ssr-dist/js'))
server.use('/img', express.static('./ssr-dist/img'))

server.get('*', (req, res) => {
  const context = { url: req.url }
  renderer.renderToString(context, (err, html) => {
    if (err) {
      if (err.code === 404) {
        res.status(404).end('Page not found')
      } else {
        res.status(500).end('Internal Server Error')
      }
    } else {
      res.end(html)
    }
  })
})

server.listen(8081)
