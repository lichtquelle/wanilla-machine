/**
 * @author      Yannick Deubel (https://github.com/yandeu)
 * @copyright   Copyright (c) 2021 Yannick Deubel
 * @license     {@link https://github.com/lichtquelle/wanilla-machine/blob/main/LICENSE LICENSE}
 */

import { getConfigFile, getHTML, getLayout, isHTML } from './misc.js'
import { MiddlewareOptions } from './types.js'
import { brackets } from './brackets.js'
import { defaultLayout } from './defaultLayout.js'
import { join } from 'path'
import { parseMarkdown } from './parse.js'

export const middleware = (options: MiddlewareOptions) => {
  const { root, debug = false, dev = false } = options

  let config = getConfigFile(root)

  return async (req, res, next) => {
    if (req.method !== 'GET') return next()
    if (req.url === '/') req.url = 'index'

    if (dev) config = getConfigFile(root)

    if (isHTML(root, req.url)) {
      const html = getHTML(root, req.url)
      if (!html) return next()

      // set type to html
      res.type('html')

      // attach the html to res.locals
      // http://expressjs.com/en/api.html#res.locals
      res.locals.html = await brackets({ root, debug, config, layout: html })
      // run it twice
      res.locals.html = await brackets({ root, debug, config, layout: res.locals.html })

      return next()
    }

    // parse page
    const md = await parseMarkdown(join(root, `${req.url}.md`)).catch(err => {})
    if (!md) return next()

    // get yaml and markdown
    const { markdown, yaml } = md

    // get layout
    let layout = getLayout(root, yaml, defaultLayout)

    if (debug) {
      console.log('------')
      console.log('html  ', markdown)
      console.log('yaml  ', yaml)
      console.log('layout', layout)
    }

    // resolve brackets from markdown
    layout = await brackets({ root, markdown, yaml, layout, debug, config })
    // run it twice
    layout = await brackets({ root, markdown, yaml, layout, debug, config })

    // set type to html
    res.type('html')

    // attach the html to res.locals
    // http://expressjs.com/en/api.html#res.locals
    res.locals.html = layout

    return next()
  }
}
