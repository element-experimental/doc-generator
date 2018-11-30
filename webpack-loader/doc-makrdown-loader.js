// 处理 Markdown 文件
const md = require('markdown-it')()
const mdContainer = require('markdown-it-container')
const mdAnchor = require('markdown-it-anchor')
const striptags = require('striptags')
const slugify = require('transliteration').slugify

// 处理 link
md.use(mdAnchor, {
  level: 2,
  slugify: slugify,
  permalink: true,
  permalinkBefore: true
})

// 处理自定义的 block
md.use(mdContainer, 'demo', {
  validate(params) {
    return params.trim().match(/^demo\s*(.*)$/);
  },

  render (tokens, idx) {
    const m = tokens[idx].info.trim().match(/^demo\s*(.*)$/);
    if (tokens[idx].nesting === 1) {
      const description = (m && m.length > 1) ? m[1] : ''
      const content = tokens[idx + 1].content
      const script = striptags(content, 'script')
      const style = striptags(content, 'style')
      const extractHtmlReg = /(?:<style>(?:.|\n)*<\/style>)|(?:<script>(?:.|\n)*<\/script>)/g
      const html = content.replace(extractHtmlReg, '').trim()
      let jsfiddle = { html: html, script: script, style: style }
      const descriptionHTML = md.render(description)

      jsfiddle = md.utils.escapeHtml(JSON.stringify(jsfiddle));

      return `<demo-block class="demo-box" :jsfiddle="${jsfiddle}">
                <div class="source" slot="source">${html}</div>
                ${descriptionHTML}
                <div class="highlight" slot="highlight">`;
    }
    return '</div></demo-block>\n';
  }
})

md.use(mdContainer, 'tip')
md.use(mdContainer, 'warning')

module.exports = function (source) {
  return `
    <template>
      <div class="element-doc">
        ${md.render(source)}
      </div>
    </template>
    <script>
      export default {
        name: 'component-doc'
      }
    </sript>
  `
}
