import * as esbuild from 'esbuild'

esbuild
  .build({
    entryPoints: ['./src/rollup.js'],
    bundle: true,
    format: 'cjs',
    platform: 'node',
    outdir: 'dist',
    outExtension: { '.js': '.cjs' }
  })
  .catch(() => process.exit(1))
