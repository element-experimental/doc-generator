const { readdirSync, readFileSync, writeFileSync } = require('fs')
const files = readdirSync('src/docs/components')
files.forEach(name => {
  const content = readFileSync(`src/docs/components/${name}`, {
    encoding: 'utf-8'
  })
  writeFileSync(`src/docs/components/${name}`, content.slice(content.indexOf('## ')))
})