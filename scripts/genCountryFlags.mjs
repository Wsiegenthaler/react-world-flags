import fsPromises from 'fs/promises'
import path from 'path'

import countries from 'svg-country-flags/countries.json' assert { type: 'json' }

//
// This script generates country-specific flag components which can be cherry-picked
// by client applications. This allows application bundlers to omit flag assets which
// aren't needed, greatly reducing bundle size.
//
// Example:
// ```
// import { FlagUS } from 'react-world-flags'
//
// export const MyComponent = props => (<div><FlagUS /></div>)
// ```
//
// Script output:
//  * `src/CountryFlags.mjs`: Country-specific flag components
//  * `types/country-flags.d.ts`: Typescript definitions for country-specific flag components
//

const srcDir = './src'

const svgInPath = k => `./src/svgs/${k.toLowerCase()}.svg`

const genCountryFlags = async () => {
  const defs = Object.keys(countries)
    .map(k => ({ k, key: k.replace('-', '_'), country: countries[k] }))
    .map(o => ({
      name: `Flag${o.key}`,
      masterFile: svgInPath(o.k),
      ...o
    }))

  const module = genModule(defs)
  const tsd = genTypescriptDef(defs)

  await fsPromises.writeFile('./src/CountryFlags.mjs', module)
  await fsPromises.writeFile('./types/country-flags.d.ts', tsd)
}

const genModule = defs => {
  const header = `import { CountryFlag } from './Flag'\n`
  const imports = defs.map(def => `import flag_${def.key} from './${path.relative(srcDir, def.masterFile)}'`).join('\n')
  const exports = defs.map(def => `export const ${def.name} = CountryFlag(flag_${def.key})`).join('\n')
  const content = [header, imports, '', exports].join('\n')

  return content
}

const genTypescriptDef = defs => {
  const header = `import { FC } from 'react'`
  const declarations = defs.map(def => `\n/** "${def.country}" [${def.key}] */\ndeclare const ${def.name}: FC<{}>`).join('\n')
  const exports = `export { ${defs.map(def => def.name).join(', ')} }`
  const content = [header, declarations, '', exports].join('\n')

  return content
}

////////////////////////////////////////////////////////////////////////////

const defs = await genCountryFlags()
