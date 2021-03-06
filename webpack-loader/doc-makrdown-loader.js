const md = require('./markdown-config')
const { stripScript, stripStyle, stripTemplate, genInlineComponentText } = require('./util')
module.exports = function (source) {
  const content = md.render(source)

  const startTag = '<!--element-demo:'
  const startTagLen = startTag.length
  const endTag = '-->'
  const endTagLen = endTag.length

  let componenetsString = ''
  let styleSheets = '' // md 提取的样式
  let id = 0 // demo 的 id
  let output = '' // 输出的内容
  let start = 0 // 字符串开始位置

  let commentStart = content.indexOf(startTag)
  let commentEnd = content.indexOf(endTag, commentStart + startTagLen)
  while (commentStart !== -1 && commentEnd !== -1) {
    output += content.slice(start, commentStart)

    const commentContent = content.slice(commentStart + startTagLen, commentEnd)
    const html = stripTemplate(commentContent)
    const script = stripScript(commentContent)
    const style = stripStyle(commentContent)
    styleSheets += style
    let demoComponentContent = genInlineComponentText(html, script)
    const demoComponentName = `element-demo${id}`
    output += `<${demoComponentName} />`
    componenetsString += `${JSON.stringify(demoComponentName)}: ${demoComponentContent},`

    // 重新计算下一次的位置
    id ++
    start = commentEnd + endTagLen
    commentStart = content.indexOf(startTag, start)
    commentEnd = content.indexOf(endTag, commentStart + startTagLen)
  }

  output += content.slice(start)
  styleSheets = styleSheets.trim()
  if (styleSheets) {
    styleSheets = `<style>${styleSheets}</style>`
  }
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
    ${styleSheets}
  `
}
