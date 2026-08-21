import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { readFileSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

export function loadTsConfigPaths(relativePath) {
  const configPath = resolve(__dirname, '..', relativePath);
  const configContent = readFileSync(configPath, 'utf8');
  const configObj = JSON.parse(configContent);
  const paths = configObj.compilerOptions.paths;
  delete paths['*'];
  return paths;
}