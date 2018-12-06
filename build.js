// const express = require('express')
// const server = express()
const path = require('path')
const fs = require('fs-extra')
const { createBundleRenderer } = require('vue-server-renderer')
const navConfig = require('./src/nav.config.json')

const bundle = require('./dist/vue-ssr-server-bundle.json')
const clientManifest = require('./dist/vue-ssr-client-manifest.json')

const outDir = 'ssr-dist'

const renderer = createBundleRenderer(bundle, {
  runInNewContext: false,
  inject: false,
  template: fs.readFileSync('./public/index.html', 'utf-8'),
  clientManifest
})

async function renderPage(pagePath) {
  // const pagePath = page.path
  const context = {
    url: pagePath,
    title: 'element 文档站'
  }
  let html = ''
  try {
    html = await renderer.renderToString(context)
  } catch (err) {
    console.error("Error rendering ", pagePath)
    throw err
  }
  const filename = decodeURIComponent(pagePath.replace(/\/$/, '/index.html').replace(/^\//, ''))
  const filePath = path.resolve(outDir, filename)
  await fs.ensureDir(path.dirname(filePath))
  await fs.writeFile(filePath, html)
}
async function build(pages) {
  console.log("Rendering static HTML...")
  for (const page of pages) {
    await renderPage(page)
  }
}
const routes = getSiteRoutes()

build(routes)

function getSiteRoutes() {
  const lang = 'zh-CN'
  const getRoute = (path, isComponent) => `/${lang}/${isComponent ? 'component/' : ''}${path.replace(/\//g, '')}`
  const routes = navConfig[lang].reduce((routes, { path, children, href, groups }) => {
    if (href) {
      return routes
    }
    if (children) {
      children.forEach(({ path }) => {
        routes.push(getRoute(path))
      })
    } else if (path) {
      routes.push(getRoute(path))
    } else if (groups) {
      groups.forEach(({ list }) => {
        list.forEach(({ path }) => {
          routes.push(getRoute(path, true))
        })
      })
    }
    return routes
  }, [])
  return ['/', ...routes]
}