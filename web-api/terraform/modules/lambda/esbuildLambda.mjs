/* eslint-disable no-underscore-dangle */
import { copy } from 'esbuild-plugin-copy';
import { fileURLToPath } from 'url';
import esbuild from 'esbuild';
import fs from 'fs';
import path from 'path';

const [handlerPath, fileName] = process.argv.splice(2);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function cleanOutputDirectory(outputDir) {
  if (fs.existsSync(outputDir)) {
    fs.readdirSync(outputDir).forEach(file => {
      const filePath = path.join(outputDir, file);
      if (fs.lstatSync(filePath).isDirectory()) {
        fs.rmSync(filePath, { recursive: true });
      } else {
        fs.unlinkSync(filePath);
      }
    });
  }
}

function getPathFromRoot(filePath) {
  return path.resolve(__dirname, '../../../../', filePath);
}

// Clean the output directory before every build
cleanOutputDirectory(getPathFromRoot(`dist-lambdas/${fileName}/`));

await esbuild.build({
  bundle: true,
  entryPoints: [getPathFromRoot(handlerPath)],
  external: ['@sparticuz/chromium', 'puppeteer-core'],
  format: 'cjs',
  keepNames: true,
  loader: {
    '.node': 'file',
  },
  outfile: getPathFromRoot(`dist-lambdas/${fileName}/out/lambda.cjs`),
  platform: 'node',
  plugins: [
    copy({
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
  ],
  sourcemap: true,
  target: 'esnext',
});
