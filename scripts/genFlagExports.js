import fsPromises from 'fs/promises'
import path from 'path'
import * as url from 'url'

import countries from 'svg-country-flags/countries.json' assert { type: 'json' }

import { ensureDir } from './util.mjs'

//
// This script generates the 'profile' which maps flag svg asset paths to named module exports.
//
// Script output:
// * `src/profiles/flags.js`
//

const imports = Object.keys(countries).map((k) => {
  const key = k.replace('-', '_')
  return `import flag_${key} from '../svgs/${k.toLowerCase()}.svg'`
})

const exports = Object.keys(countries).map((k) => {
  const key = k.replace('-', '_')
  return `flag_${key}`
})

const __dirname = url.fileURLToPath(new URL('.', import.meta.url))
const target = path.resolve(__dirname, '../src/profiles/flags.js')

const exportContent = imports.join('\n') + `\nexport default {${exports.join(', ')}}`
await ensureDir(target)
await fsPromises.writeFile(target, exportContent)
