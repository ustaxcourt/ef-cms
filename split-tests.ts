import fs from 'fs';
import { getOutputsForCurrentCiNode } from './scripts/helpers/splitTestFiles';

const testType = process.argv[2] || '';

const specDir = `./web-client/integration-tests${testType}`;
const files = fs
  .readdirSync(specDir)
  .filter(f => f.endsWith('test.ts'))
  .map(fileName => ({
    output: fileName,
    path: `${specDir}/${fileName}`,
  }));

const tests = getOutputsForCurrentCiNode({
  files,
});

console.log(tests.join(' '));
