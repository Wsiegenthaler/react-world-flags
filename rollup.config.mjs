import { babel } from '@rollup/plugin-babel'
import image from '@rollup/plugin-image'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import sourcemaps from 'rollup-plugin-sourcemaps'

export default [
  {
    input: 'src/index.js',
    output: {
      dir: './dist/esm',
      format: 'esm',
      exports: 'named',
      preserveModules: true,
      sourcemap: true
    },
    plugins: [
      resolve(),
      image(),
      babel({ babelHelpers: 'bundled' }),
      commonjs(),
      json(),
      sourcemaps()
    ]
  },
  {
    input: 'src/index-cjs.js',
    output: {
      file: './dist/cjs/index.js',
      format: 'cjs',
      sourcemap: true
    },
    plugins: [
      resolve(),
      image(),
      babel({ babelHelpers: 'bundled' }),
      commonjs(),
      json(),
      sourcemaps()
    ]
  }
]
