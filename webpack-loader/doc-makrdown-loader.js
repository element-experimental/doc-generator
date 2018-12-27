const md = require('./markdown-config')
const { stripScript, stripStyle, stripTemplate, genInlineComponentText } = require('./util')

module.exports = function (source) {
  let componenetsString = ''
  let styleSheets = ''
  const content = md.render(source)
  let start = 0
  let index = 0
  let output = ''
  // todo: 换一种实现方式
  const demoReg = /<!--element-demo: ([\S\s]*)-->/g
  let match
  while ((match = demoReg.exec(content)) !== null) {
    const demoContent = match[1]
    if (demoContent) {
      output += content.slice(start, match.index)
      const demoComponentName = `element-demo${index}`
      output += `<${demoComponentName} />`
      const html = stripTemplate(demoContent)
      const script = stripScript(demoContent)
      const style = stripStyle(demoContent)
      styleSheets += style
      let demoComponentContent = genInlineComponentText(html, script)
      componenetsString += `${JSON.stringify(demoComponentName)}: ${demoComponentContent},`
      index ++
      start = demoReg.lastIndex
    }
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
