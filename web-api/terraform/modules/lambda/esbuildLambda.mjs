/* eslint-disable no-underscore-dangle */
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

// Clean the output directory before every build
cleanOutputDirectory(
  path.resolve(__dirname, '../../../../', `dist-lambdas/${fileName}/`),
);

await esbuild.build({
  bundle: true,
  entryPoints: [path.resolve(__dirname, '../../../../', handlerPath)],
  external: ['@sparticuz/chromium', 'puppeteer-core'],
  format: 'cjs',
  keepNames: true,
  loader: {
    '.node': 'file',
  },
  outfile: path.resolve(
    __dirname,
    '../../../../',
    `dist-lambdas/${fileName}/out/lambda.cjs`,
  ),
  platform: 'node',
  sourcemap: true,
  target: 'esnext',
});
