/* eslint-disable no-underscore-dangle */
import { clean } from 'esbuild-plugin-clean';
import { copy } from 'esbuild-plugin-copy';
import { fileURLToPath } from 'url';
import esbuild from 'esbuild';
import path from 'path';

const [handlerPath, fileName] = process.argv.splice(2);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getPathFromRoot(filePath) {
  return path.resolve(__dirname, '../../../../', filePath);
}

await esbuild.build({
  bundle: true,
  entryPoints: [getPathFromRoot(handlerPath)],
  external: ['@sparticuz/chromium', 'puppeteer-core'], // Do not bundle these packages as they are too large to bundle. Include in lambda layer.
  format: 'cjs',
  keepNames: true,
  loader: {
    '.node': 'file',
  },
  minifyIdentifiers: false, // https://stackoverflow.com/questions/74905381/esbuild-minification-of-aws-sdk-causes-high-memory-usage-on-lambda
  minifySyntax: true, // https://stackoverflow.com/questions/74905381/esbuild-minification-of-aws-sdk-causes-high-memory-usage-on-lambda
  minifyWhitespace: true, // https://stackoverflow.com/questions/74905381/esbuild-minification-of-aws-sdk-causes-high-memory-usage-on-lambda
  outfile: getPathFromRoot(`dist-lambdas/${fileName}/out/lambda.cjs`),
  platform: 'node',
  plugins: [
    copy({
      // This copy is necessary to import and run pdfjs-dist correctly on Node.
      assets: [
        {
          from: [
            getPathFromRoot(
              'node_modules/pdfjs-dist/legacy/build/pdf.worker.js',
            ),
          ],
          keepStructure: true,
          to: [getPathFromRoot(`dist-lambdas/${fileName}/out`)],
        },
      ],
    }),
    clean({
      // Clean the output directory before every build
      patterns: [getPathFromRoot(`/dist-lambdas/${fileName}/*`)],
    }),
  ],
  sourcemap: false, // Enable sourcemaps causes RAM to increase by 1GB even when lambda does nothing. Keeping disabled.
  target: 'esnext',
});
