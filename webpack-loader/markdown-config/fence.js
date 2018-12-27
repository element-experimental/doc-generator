// 覆盖默认的 fence 渲染策略
module.exports = (md) => {
  const defaultRender = md.renderer.rules.fence
  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    const token = tokens[idx]
    if (token.info === 'html') {
      return `<demo-code>${md.utils.escapeHtml(token.content)}</demo-code>`
    }
    return defaultRender(tokens, idx, options, env, self)
  }
}