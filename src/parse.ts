/**
 * @author    Yannick Deubel (https://github.com/yandeu)
 * @copyright Copyright (c) 2021 Yannick Deubel
 * @license   {@link https://github.com/lichtquelle/wanilla-machine/blob/main/LICENSE LICENSE}
 */

// read: https://www.npmjs.com/package/remark-parse
const unified = require('unified')
const markdown = require('remark-parse') // Parse markdown.
const remarkGfm = require('remark-gfm') // Support GFM (tables, autolinks, tasklists, strikethrough).
const frontmatter = require('remark-frontmatter') // Support frontmatter.
const remark2rehype = require('remark-rehype') // Turn it into HTML.
const html = require('rehype-stringify') // Serialize HTML.

const YAML = require('yaml')
const fs = require('fs')

export const parseYAML = yaml => {
  return YAML.parse(yaml)
}

const parseYAMLFromMarkdown = data => {
  const yaml = data.result.children.filter(block => block.type === 'yaml')[0]
  if (yaml) return YAML.parse(yaml.value)
  else return undefined
}

function stringify(options) {
  // @ts-ignore
  const self = this

  // @ts-ignore
  this.Compiler = compile

  function compile(tree) {
    return tree
  }
}

const markdownProcessor = unified()
  .use(markdown)
  .use(remarkGfm)
  .use(frontmatter, ['yaml', 'toml'])
  .use(remark2rehype)
  .use(html)

const yamlProcessor = unified().use(markdown).use(frontmatter, ['yaml', 'toml']).use(stringify)

export const parseMarkdown = (file: string): Promise<{ markdown: string; yaml: { layout: string } }> => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) return reject(err.message)

      const result = { markdown: '', yaml: { layout: '' } }

      const done = () => {
        if (Object.keys(result).length === 2) return resolve(result)
      }

      markdownProcessor.process(data, (err, file) => {
        if (err) return reject(err.message)

        const md = String(file)
        result.markdown = md
        done()
      })

      yamlProcessor.process(data, (err, file) => {
        if (err) return reject(err.message)

        const yaml = parseYAMLFromMarkdown(file)
        result.yaml = yaml
        done()
      })
    })
  })
}
