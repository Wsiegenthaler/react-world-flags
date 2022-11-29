/* eslint-disable fp/no-nil */
/* eslint-disable fp/no-rest-parameters */
/* eslint-disable better/no-ifs */

import React from 'react'
import { getAlphaTwoCode } from './country.js'

export const Flag = flags => props => {
  const { code, fallback = null, ...rest } = props
  if (!code) return fallback
  const alphaTwo = getAlphaTwoCode(code)
  const flag = flags['flag_' + alphaTwo.replace('-', '_')]
  return flag ? <img {...rest} src={flag} /> : fallback
}

export const CountryFlag = flag => props => flag ? <img {...props} src={flag} /> : <></>

export const RasterFlag = (flags, height) => props => Flag(flags)(Object.assign({ height }, props ?? {}))