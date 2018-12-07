const Config = require('markdown-it-chain')
const anchorPlugin = require('markdown-it-anchor')
// const mdContainer = require('markdown-it-container')
const slugify = require('transliteration').slugify
const highlight = require('./highlight')
const containers = require('./containers')

const config = new Config()

config
  .options
    // .html(false)
    .highlight(highlight)
    .end()
  
  .plugin('anchor')
    .use(anchorPlugin, [{
      level: 2,
      slugify: slugify,
      permalink: true,
      permalinkBefore: true
    }])
    .end()

  .plugin('containers')
    .use(containers)
    .end()

module.exports = config.toMd()
