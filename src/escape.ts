// https://github.com/handlebars-lang/handlebars.js/blob/master/lib/handlebars/utils.js
const escape = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '`': '&#x60;',
  '=': '&#x3D;'
}
const badChars = /[&<>"'`=]/g

const escapeChar = (chr: string) => {
  return escape[chr]
}

export const escapeExpression = (content: string): string => {
  return content.replace(badChars, escapeChar)
}
