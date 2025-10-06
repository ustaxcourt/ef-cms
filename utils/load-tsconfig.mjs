import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { readFileSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

export function loadTsConfig(relativePath) {
  const configPath = resolve(__dirname, '..', relativePath);
  const configContent = readFileSync(configPath, 'utf8');
  return JSON.parse(configContent);
}