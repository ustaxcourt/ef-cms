import { spawnSync } from 'child_process';

function countTypescriptErrors(text: string): number {
  return (text.match(/: error TS/g) || []).length;
}

const typescriptProcess = spawnSync('npx', ['tsc', '--noEmit'], {
  encoding: 'utf-8',
  maxBuffer: 1024 * 5000,
});

const errorCount = countTypescriptErrors(typescriptProcess.stdout);
console.log('Number of errors: ', errorCount);
