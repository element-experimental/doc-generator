<script>
// import prism from 'prismjs'
// const loadLanguages = require('prismjs/components/index')

// loadLanguages(['markup', 'css', 'javascript'])

export default {
  name: 'demo-code',
  
  render() {
    const text = this.$slots.default ? this.$slots.default[0].text : ''
    // const code = prism.highlight(text, prism.languages.markup, 'markup')
    return <div>
      <pre class="language-html">
        <code v-pre >{text}</code>
      </pre>
    </div>
  }
}
</script>
