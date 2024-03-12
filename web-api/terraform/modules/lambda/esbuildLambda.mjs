import esbuild from 'esbuild';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

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
  banner: {
    js: "import { createRequire as topLevelCreateRequire } from 'module'; const require = topLevelCreateRequire(import.meta.url);",
  },
  bundle: true,
  entryPoints: [path.resolve(__dirname, '../../../../', handlerPath)],
  format: 'esm',
  keepNames: true,
  sourcemap: true,
  loader: {
    '.node': 'file',
  },
  outfile: path.resolve(
    __dirname,
    '../../../../',
    `dist-lambdas/${fileName}/out/lambda.mjs`,
  ),
  platform: 'node',
  target: 'esnext',
});
