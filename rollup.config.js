import tsc from '@rollup/plugin-typescript'
import resolve from '@rollup/plugin-node-resolve'
import cjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/main.ts',
  output: { file: 'docs/app.js', format: 'esm' },
  plugins: [tsc(), resolve(), cjs(), json(), terser()]
}