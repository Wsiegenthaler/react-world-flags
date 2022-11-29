import fsPromises from 'fs/promises'

import countries from 'world-countries'

//
// This script generates the `getAlphaTwoCode(code)` function which maps two or three letter
// country codes to their 2 letter (cca2) values. This saves ~100kB in the resulting bundle
// by ommitting the `world-countries` module from the build, and also makes code lookups
// faster by not traversing the entire list of countries on render.
//
// Script output:
// * `src/country.js`
//

const codeMap = countries.flatMap(c => [
    { key: c.cca3, cca2: c.cca2 },
    { key: c.ccn3, cca2: c.cca2 }
  ])
  .map(({ key, cca2 }) => `'${key}': '${cca2}'`)
  .join(',\n  ')

const codeMapConst = `const codeMap = {\n  ${codeMap}\n}`

const getAlphaTwoCode = 'export const getAlphaTwoCode = code => codeMap[String(code).toUpperCase()] ?? String(code).toUpperCase()'

await fsPromises.writeFile(`./src/country.js`, `${codeMapConst}\n\n${getAlphaTwoCode}`)
