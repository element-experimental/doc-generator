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
      const jsfiddle = JSON.stringify({ html: html, script: script, style: style })
      const descriptionHTML = md.render(description)

      const mdJsfiddle = md.utils.escapeHtml();

      return `<demo-block class="demo-box" :jsfiddle="${mdJsfiddle}">
                <div class="source" slot="source">
                  ${ html }
                  <!--element-demo-->
                  <!-- jsfiddle:${ jsfiddle } -->
                </div>
                ${descriptionHTML}
                <div class="highlight" slot="highlight">`;
    }
    return '</div></demo-block>\n';
  }
})

md.use(mdContainer, 'tip')
md.use(mdContainer, 'warning')

module.exports = function (source) {
  // todo 提取
  // const componenets = {}
  // const content = md.render(source)
  // // 把数据提取出来
  // const demoReg = /<!--element-demo-->/g
  // const jsfiddleReg = /<!-- jsfiddle:(.*+) -->/
  // let demo
  // while ((demo = demoReg.exec(content)) !== null) {
  // }
  // demoReg.exec()
  return `
    <template>
      <div class="element-doc">
        ${md.render(source)}
      </div>
    </template>
    <script>
      export default {
        name: 'component-doc',
        // componenets: {}
      }
    </sript>
  `
}
