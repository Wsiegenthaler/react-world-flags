/* eslint-disable fp/no-nil */
/* eslint-disable fp/no-rest-parameters */
/* eslint-disable better/no-ifs */

import { Flag, RasterFlag } from './Flag.js'

import svgFlags from './profiles/flags.js'
import flags32 from './profiles/flags-32.js'
import flags64 from './profiles/flags-64.js'
import flags128 from './profiles/flags-128.js'
import flags256 from './profiles/flags-256.js'
import flags512 from './profiles/flags-512.js'


// Hybrid svg/raster flags by flag height (for rasters)
export const Flag32 = RasterFlag(flags32, 32)
export const Flag64 = RasterFlag(flags64, 64)
export const Flag128 = RasterFlag(flags128, 128)
export const Flag256 = RasterFlag(flags256, 256)
export const Flag512 = RasterFlag(flags512, 512)

// Tree-shakable country specific components
export * from './CountryFlags.mjs'

// Generic svg flag component (default)
export default Flag(svgFlags)
