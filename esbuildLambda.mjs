import esbuild from 'esbuild';
import path from 'path';

const [projectRoot, handlerPath, zipName] = process.argv.splice(2);

console.log('*******', process.cwd());

await esbuild.build({
  banner: {
    js: "import { createRequire as topLevelCreateRequire } from 'module'; const require = topLevelCreateRequire(import.meta.url);",
  },
  bundle: true,
  entryPoints: [path.resolve(projectRoot, handlerPath)],
  format: 'esm',
  keepNames: true,
  sourcemap: true,
  loader: {
    '.node': 'file',
  },
  outfile: `${projectRoot}/dist-lambdas/${zipName}/${zipName}.mjs`,
  platform: 'node',
  target: 'esnext',
});
