#!/usr/bin/env -S npx ts-node --transpile-only

import {
  getOutputsForCurrentCiNode,
  type SplittableFile,
} from './split-tests.helpers';
import glob from 'glob';

export const main = (args: string[] = process.argv.slice(2)): string => {
  const testType: string = args[0] || '';

  let testFiles: string[] = [];
  if (testType.includes('unit')) {
    testFiles = glob.sync('./web-client/src/**/?(*.)+(spec|test).[jt]s?(x)');
  } else if (testType.includes('shared')) {
    testFiles = glob.sync('./shared/src/**/?(*.)+(spec|test).[jt]s');
  }

  const output: string = getOutputsForCurrentCiNode({
    files: testFiles.map(
      (filePath: string): SplittableFile => ({
        output: filePath,
        path: filePath,
      }),
    ),
  }).join('|');

  console.log(output);

  return output;
};

if (require.main === module) {
  main();
}
