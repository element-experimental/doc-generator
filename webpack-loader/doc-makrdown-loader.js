// 处理 Markdown 文件
const md = require('markdown-it')()
const mdContainer = require('markdown-it-container')
const mdAnchor = require('markdown-it-anchor')
const { stripScript, stripStyle, stripTemplate, genInlineComponentText } = require('./util')
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
      // 这里的做法有些问题有待调整
      if (!content) {
        console.warn(`
        必须要按照下面格式书写文档
        :::demo 内容
        \`\`\`html
        <el-alert>xx</el-alert>
        \`\`\`
        `)
      }
      const script = stripScript(content)
      const style = stripStyle(content)
      const html = stripTemplate(content)
      const jsfiddle = JSON.stringify({ html: html, script: script, style: style })
      const mdJsfiddle = md.utils.escapeHtml(jsfiddle)

      return `<demo-block class="demo-box" :jsfiddle="${mdJsfiddle}">
                <div class="source" slot="source">
                  <!--element-demo: ${jsfiddle}-->
                </div>
                ${md.render(description)}
                <div class="highlight" slot="highlight" v-pre>`
    }
    return '</div></demo-block>\n'
  }
})

md.use(mdContainer, 'tip')
md.use(mdContainer, 'warning')

module.exports = function (source) {
  let componenetsString = ''
  // todo: 这里有待优化
  let styleSheets = ''
  const content = md.render(source)
  let start = 0
  let index = 0
  let output = ''
  const demoReg = /<!--element-demo: (.*)-->/g
  let match
  while ((match = demoReg.exec(content)) !== null) {
    if (match[1]) {
      output += content.slice(start, match.index)
      const demoComponentName = `element-demo${index}`
      output += `<${demoComponentName} />`

      const { html, script, style } = JSON.parse(match[1])
      styleSheets += style
      let demoComponentContent = genInlineComponentText(html, script)
      componenetsString += `${JSON.stringify(demoComponentName)}: ${demoComponentContent},`
      index ++
      start = demoReg.lastIndex
    }
  }
  output += content.slice(start)
  return `
    <template>
      <div class="element-doc">
        ${output}
      </div>
    </template>
    <script>
      export default {
        name: 'component-doc',
        components: {
          ${componenetsString}
        }
      }
    </script>
    <style>
      ${styleSheets}
    </style>
  `
}
