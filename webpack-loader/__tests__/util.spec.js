const { stripScript, stripStyle, stripTemplate, genInlineComponentText } = require('../util')

// 测试单文件组件
const sfc = `
<template><div>xxxx</div></template>
<script>
export default {
  name: 'sfc'
}
</script>
<style>
div {
  font-size: 12px;
}
</style>
`

describe('test all loader utils', () => {
  test('stripScript', () => {
    const script = stripScript(sfc)
    expect(script).toBe('export default {\n  name: \'sfc\'\n}')
    expect(script).toMatchSnapshot()
  })

  test('stripStyle', () => {
    const style = stripStyle(sfc)
    expect(style).toBe('div {\n  font-size: 12px;\n}')
    expect(style).toMatchSnapshot()
  })

  test('stripTemplate', () => {
    const template = stripTemplate(sfc)
    expect(template).toBe('<template><div>xxxx</div></template>')
    expect(template).toMatchSnapshot()
  })

  test('genInlineComponentText', () => {
    const template = stripTemplate(sfc)
    const script = stripScript(sfc)
    const inlineComponentText = genInlineComponentText(template, script)
    expect(inlineComponentText).toMatchSnapshot()
  })
})
