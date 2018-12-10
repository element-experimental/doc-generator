const mdContainer = require('markdown-it-container')
const { stripScript, stripStyle, stripTemplate } = require('../util')

module.exports = (md) => {
  md.use(mdContainer, 'demo', {
    validate(params) {
      return params.trim().match(/^demo\s*(.*)$/)
    },
  
    render (tokens, idx) {
      const m = tokens[idx].info.trim().match(/^demo\s*(.*)$/)
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
                  <div class="highlight" slot="highlight">`
      }
      return '</div></demo-block>\n'
    }
  })
  
  md.use(mdContainer, 'tip')
  md.use(mdContainer, 'warning')
}
