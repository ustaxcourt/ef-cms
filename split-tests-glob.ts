import glob from 'glob';
import { getOutputsForCurrentCiNode } from './scripts/helpers/splitTestFiles';

const testType = process.argv[2] || '';

let testFiles: string[] = [];
if (testType.includes('unit')) {
  testFiles = glob.sync('./web-client/src/**/?(*.)+(spec|test).[jt]s?(x)');
} else if (testType.includes('shared')) {
  testFiles = glob.sync('./shared/src/**/?(*.)+(spec|test).[jt]s');
}

const tests = getOutputsForCurrentCiNode({
  files: testFiles.map(filePath => ({
    output: filePath,
    path: filePath,
  })),
});

console.log(tests.join('|'));
