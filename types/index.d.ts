import * as React from 'react'

export interface FlagProps extends React.HTMLProps<HTMLImageElement> {
    /**
     * `code` is the two letter, three letter, or three digit country code
     */
    code?: string | undefined

    /**
     * Optional fallback which renders if the given code doesn't correspond to a flag
     */
    fallback?: React.ReactNode | null | undefined
}


/**
 * Hybrid svg/raster flags selected based on which is more space efficient (32px rasters)
 */
declare const Flag32: React.FC<FlagProps>

/**
 * Hybrid svg/raster flags selected based on which is more space efficient (64px rasters)
 */
declare const Flag64: React.FC<FlagProps>

/**
 * Hybrid svg/raster flags selected based on which is more space efficient (128px rasters)
 */
declare const Flag128: React.FC<FlagProps>

/**
 * Hybrid svg/raster flags selected based on which is more space efficient (256px rasters)
 */
declare const Flag256: React.FC<FlagProps>

/**
 * Hybrid svg/raster flags selected based on which is more space efficient (512px rasters)
 */
declare const Flag512: React.FC<FlagProps>

export { Flag32, Flag64, Flag128, Flag256, Flag512 }

/**
 * Tree-shakable country specific components
 */
export * from './country-flags'

/**
 * Generic svg flag component (default)
 */
declare const Flag: React.FC<FlagProps>

export default Flag
