/**
 * @author      Yannick Deubel (https://github.com/yandeu)
 * @copyright   Copyright (c) 2021 Yannick Deubel
 * @license     {@link https://github.com/lichtquelle/wanilla-machine/blob/main/LICENSE LICENSE}
 */

import { existsSync, readFileSync } from 'fs'
import { join } from 'path'
import { parseYAML } from './parse'
import { regex } from './regex'

export const isHTML = (root: string, url: string) => {
  if (regex.html.test(url)) return true
  return existsSync(join(root, `${url}.html`))
}

export const getHTML = (root: string, url: string) => {
  try {
    return readFileSync(join(root, `${url.replace(regex.html, '')}.html`), { encoding: 'utf-8' })
  } catch (error) {
    return
  }
}

export const getLayout = (root: string, yaml: { layout: string }, defaultLayout: string) => {
  let _tmp: any = yaml && yaml.layout && `${root}/layouts/${yaml.layout}.html`
  if (!_tmp && existsSync(`${root}/layouts/default.html`)) _tmp = `${root}/layouts/default.html`
  return _tmp ? readFileSync(_tmp, { encoding: 'utf-8' }) : defaultLayout
}

export const getConfigFile = root => {
  let _tmp: any = join(root, '_config.yml')
  _tmp = existsSync(_tmp) ? readFileSync(_tmp, { encoding: 'utf-8' }) : null
  return _tmp ? parseYAML(_tmp) : {}
}
