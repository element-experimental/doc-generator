const docMdLoader = require('../doc-makrdown-loader')

const md = `
## Title 1
demo 1
:::demo demo content
\`\`\`html
<el-alert>x</el-alert>
<script>
export default {
  data() {
    return {
      x: 1
    }
  }
}
</script>
<style>
.el-alert {
  font-size: 20
}
</style>
\`\`\`
:::
`
test('docMdLoader', () => {
  const content = docMdLoader(md)
  expect(content).toMatchSnapshot()
})
