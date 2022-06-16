/**
 * @author    Yannick Deubel (https://github.com/yandeu)
 * @copyright Copyright (c) 2021 Yannick Deubel
 * @license   {@link https://github.com/lichtquelle/wanilla-machine/blob/main/LICENSE LICENSE}
 */

import { BracketsOptions } from './types.js'
import fs from 'fs'
import path from 'path'
import { regex } from './regex.js'

/**
 *
 * @param root Root of workspace
 * @param url Url of file to fetch
 * @param placeholder Tag to replace from DOM (layout file)
 * @returns
 */
const getIncludeFile = (root, url, placeholder, attributes: string[] = []) => {
  return new Promise(resolve => {
    const p = path.join(path.resolve(root), url)

    const props = regex.fnc.attrToProps(...attributes)

    fs.readFile(p, { encoding: 'utf-8' }, (err, data) => {
      // TODO(yandeu): inject properties
      for (const [key, value] of Object.entries(props)) {
        // console.log(`${key}: ${value}`)
      }

      return resolve({ html: data, placeholder })
    })
  })
}

const getNested = (obj, keys) => {
  let object = { ...obj }
  let i = 0
  let found

  const k = keys.split('.')

  while (i <= k.length) {
    if (object[k[i]]) {
      if (i === k.length - 1) {
        found = object[k[i]]
        break
      }

      object = { ...object[k[i]] }

      i++
    } else break
  }

  return found
}

export const brackets = async (options: BracketsOptions) => {
  const { layout, debug = false, markdown = '', config = {}, yaml = {}, root } = options

  let execArr
  let execArr2
  let _layout = layout
  const promises: any[] = []

  // TODO(yandeu): escaped expressions do not work yet.
  // escaped expressions (convert to normal expression, but escaped)
  // while ((execArr = regex.escapeExpression.exec(layout)) !== null) {
  //   const match = execArr[0]
  //   const expression = execArr[1]
  //   _layout = _layout.replace(match, `{{ ${escapeExpression(expression)} }}`)
  // }
  // // update original layout (for escaped expressions)
  // layout = _layout
  // // reset
  // execArr = []

  // conditional blocks
  while ((execArr = regex.conditionalBlock.exec(layout)) !== null) {
    // check if start and end tag are matching
    if (execArr[1] !== execArr[5]) continue

    const match = execArr[0]?.trim()
    const helper = execArr[1].trim() // each, if etc.
    const object = execArr[2].trim()
    const content = execArr[3].trim()
    if (!helper || !object || !content) continue

    const found = getNested({ config: config, page: yaml }, object)

    // console.log(`${helper} || ${object} || ${content}`)

    let newContent = ''

    // #if
    if (helper === 'if') {
      if (!found) newContent = ' '
      else newContent = content
    }

    // #unless (opposite of #if)
    if (helper === 'unless') {
      if (found) newContent = ' '
      else newContent = content
    }

    // #each
    if (helper === 'each') {
      if (!found) continue

      if (Array.isArray(found)) {
        found.forEach(f => {
          newContent += content.replace(regex.this, f)
        })
      } else {
        newContent += content.replace(regex.this, found)
      }
    }

    if (newContent) {
      _layout = _layout.replace(match, newContent)
    }

    continue
  }
  // reset
  execArr = []

  // expressions
  while ((execArr = regex.expression.exec(layout)) !== null) {
    const match = execArr[0]?.trim()
    const expression = execArr[1]?.trim() as string

    if (debug) {
      console.log('------')
      console.log('match ', match)
      console.log('exp.  ', expression)
    }

    // {{ markdown }}
    if (expression === 'markdown') {
      _layout = _layout.replace(match, markdown)
      continue
    }

    // {{ include URL }}
    if (regex.include.test(expression)) {
      // When no more matches are found, the index is reset to 0 automatically.
      regex.include.lastIndex = 0

      const exp = expression.replace('include', '').trim()
      const url = /(^\S+)/gm.exec(exp)?.[0]
      const attributes: string[] = []
      while ((execArr2 = regex.attribute.exec(exp)) !== null) {
        attributes.push(execArr2[0])
      }
      if (url) promises.push(getIncludeFile(root, url, match, attributes))
      continue
    }

    // find expression
    // example: {{ page.name }} or {{ site.user.id }}
    const found = getNested({ config: config, page: yaml }, expression)
    if (found) _layout = _layout.replace(match, found)
  }

  const values = await Promise.all(promises)

  // resolve all src="LINK" files and inject them into the layout
  values.forEach(v => {
    _layout = _layout.replace(v.placeholder, v.html)
  })

  return _layout
}
