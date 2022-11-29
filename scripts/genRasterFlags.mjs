import fsPromises from 'fs/promises'
import path from 'path'

import sharp from 'sharp'
import pako from 'pako'
import countries from 'svg-country-flags/countries.json' assert { type: 'json' }

import { ensureDir, fileSize } from './util.mjs'


//
// This script generates the 'profiles' for rasterized flag assets. These profiles
// allow client applications to reduce the size of their application bundle when the
// on-screen size of their flags is known in advance (e.g. flag icons). Either the
// original svg or a fixed-size raster is selected depending on which version is
// more space efficient (detailed flags tend to be more compact as rasters than svgs).
//
// Example:
// ```
// import { Flag128 as Flag } from 'react-world-flags'
//
// export const MyFlagIcon = props => (<div><Flag code={props.code} /></div>)
// ```
//
// Script output:
// * `src/profiles/flags-32.js`: Flags which may be substituted with a raster of height 32px
// * `src/profiles/flags-64.js`: Flags which may be substituted with a raster of height 64px
// * `src/profiles/flags-128.js`: Flags which may be substituted with a raster of height 128px
// * `src/profiles/flags-256.js`: Flags which may be substituted with a raster of height 256px
// * `src/profiles/flags-512.js`: Flags which may be substituted with a raster of height 512px
// * `src/webp/*.webp`: Flag rasters with the above dimensions
//


const profileDir = './src/profiles'

const formats = {
  jpg: sh => sh.jpeg({ compressionLevel: 9 }),
  png: sh => sh.png({ compressionLevel: 9 }),
  webp: sh => sh.webp({ quality: 95, alphaQuality: 0, effort: 6 })
}

const svgInPath = k => `./src/svgs/${k.toLowerCase()}.svg`
const rasterOutPath = (k, format, size) => `./src/${format}/${size}/${k.toLowerCase()}.${format}`

const genImports = async (defs, size) => {
  const imports = defs.map(def => {
    const rasterFile = def.stat?.useRaster ? def.rasterFile : def.masterFile
    return `import flag_${def.key} from './${path.relative(profileDir, rasterFile)}'`
  })
  
  const exports = defs.map(def => `flag_${def.key}`)
  
  const target = `${profileDir}/flags-${size}.js`
  await ensureDir(target)
  
  const exportContent = imports.join('\n') + `\nexport default {${exports.join(', ')}}`
  await fsPromises.writeFile(target, exportContent)
}

const svgGzipSize = async fp => {
  try {
    const svg = await fsPromises.readFile(fp, { encoding: 'utf8' })
    const gzip = pako.deflate(svg)
    return gzip.byteLength
  } catch (err) {
    console.error(err)
    return -1
  }
}

const computeStats = async (def, thresholds) => {
  const svgSize = await svgGzipSize(def.masterFile)
  const rasterSize = await fileSize(def.rasterFile)
  const ratio = rasterSize / svgSize
  const saved = svgSize - rasterSize
  const useRaster = (rasterSize / svgSize < thresholds.ratio || svgSize - rasterSize > thresholds.savedBytes)

  return { svgSize, rasterSize, ratio, saved, useRaster }
}

const genRasters = async (size, format, thresholds) => {
  const defs = Object.keys(countries)
    .map(k => ({ k, key: k.replace('-', '_') }))
    .map(o => ({ key: o.key, masterFile: svgInPath(o.k), rasterFile: rasterOutPath(o.k, format, size) }))

  // Make destination directory
  if (defs.length) await ensureDir(defs[0].rasterFile)

  var totalSvgBytes = 0
  var totalRasterBytes = 0
  var totalHybridBytes = 0

  // Generate raster versions and compute stats
  for (const i in defs) {
    const def = defs[i]

    try {
      const fmt = formats[format]
      await fmt(sharp(def.masterFile, { limitInputPixels: false })
        .resize({ height: size }))
        .sharpen()
        .toFile(def.rasterFile)

      // Get stats
      const stat = await computeStats(def, thresholds)
      def.stat = stat
  
      totalSvgBytes += stat.svgSize
      totalRasterBytes += stat.rasterSize
      totalHybridBytes += stat.useRaster ? stat.rasterSize : stat.svgSize
    } catch(err) {
      console.error(err)
    }
  }

  const kb = b => `${(b >> 10)} kB`
  const pctLess = (a, b) => `~ ${Math.round(100 - 100 * a / b)}% less`
  console.log(`\npure svg = ${kb(totalSvgBytes)}`)
  console.log(`pure ${format} = ${kb(totalRasterBytes)} (${pctLess(totalRasterBytes, totalSvgBytes)})`)
  console.log(`svg/${format} hybrid = ${kb(totalHybridBytes)} (${pctLess(totalHybridBytes, totalSvgBytes)})\n`)

  return defs
}

////////////////////////////////////////////////////////////////////////////

const heights = [32, 64, 128, 256, 512]
const format = 'webp'
const thresholds = { ratio: 0.6, savedBytes: 3*1024 }

for (const i in heights) {
  const height = heights[i]
  console.log(`>> Generating ${height}px rasters...`)
  const defs = await genRasters(height, format, thresholds)
  await genImports(defs, height)
}
