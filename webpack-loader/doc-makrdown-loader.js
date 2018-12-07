const md = require('./markdown-config')
const { genInlineComponentText } = require('./util')

module.exports = function (source) {
  let componenetsString = ''
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
