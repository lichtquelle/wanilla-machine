/**
 * @author    Yannick Deubel (https://github.com/yandeu)
 * @copyright Copyright (c) 2021 Yannick Deubel
 * @license   {@link https://github.com/lichtquelle/wanilla-machine/blob/main/LICENSE LICENSE}
 */

import YAML from 'yaml'
import { parseMarkdown as _parseMarkdown } from '@yandeu/parse-markdown'
import fs from 'fs/promises'

export const parseYAML = yaml => {
  return YAML.parse(yaml)
}

export const parseMarkdown = async (file: string): Promise<{ markdown: string; yaml: { layout: string } }> => {
  const data = await fs.readFile(file, { encoding: 'utf-8' })
  const md = await _parseMarkdown(data)
  return md as { markdown: string; yaml: { layout: string } }
}
