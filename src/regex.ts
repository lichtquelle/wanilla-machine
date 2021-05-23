/**
 * @author      Yannick Deubel (https://github.com/yandeu)
 * @copyright   Copyright (c) 2021 Yannick Deubel
 * @license     {@link https://github.com/lichtquelle/wanilla-machine/blob/main/LICENSE LICENSE}
 */

interface Obj {
  [key: string]: string
}

const attrToProps = (...attr: string[]): Obj => {
  const props = {}

  attr.forEach(a => {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/matchAll
    const match = [...a.matchAll(regex.attribute)][0]

    if (match) {
      props[match[1]] = match[2]
    }
  })

  return props
}

export const regex = {
  // helpers
  fnc: {
    attrToProps: attrToProps
  },
  // match .html
  html: /\.html$/,
  // match {{ this }}
  this: /{{\s?this\s?}}/,
  // match {{ SOMETHING }}
  expression: /{?{{([^}]*)}}}?/g,
  // match {{{ SOMETHING }}}
  // escapeExpression: /{{{([^}]*)}}}/g,
  // match #HELPER EXPRESSION
  helpers: /#([\S]+)\s([^\s}]+)/gm,
  // match include URL
  include: /include(\s\S+)/,
  // match attr="something" AND attr='something else'
  attribute: /(\S+)=["']([^"']+)["']/gm,
  // match {{# till {{/ and get the HELPER
  conditionalBlock: /{{#(\w+)\s?(\S+)\s?}}(((?!{{\/)[\s\S])*){{\/(\w+)\s?}}/g
  // conditionalBlock: /{{(#[\w]+)\s([^\s}]+)\s?}}((?<!{{\/)[\s\S])*[\w]+\s?}}/g,
}
