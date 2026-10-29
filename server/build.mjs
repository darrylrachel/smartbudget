import { build } from 'esbuild';
await build({ entryPoints: { local: 'src/local.ts' }, outdir: 'dist', outExtension: { '.js': '.mjs' }, bundle: true, packages: 'external', platform: 'node', target: 'node22', format: 'esm' });
