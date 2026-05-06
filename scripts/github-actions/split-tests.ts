#!/usr/bin/env -S npx ts-node --transpile-only

import fs from 'fs';
import {
  getOutputsForCurrentCiNode,
  type SplittableFile,
} from './split-tests.helpers';

export const main = (args: string[] = process.argv.slice(2)): string => {
  const testType: string = args[0] || '';
  const specDir: string = `./web-client/integration-tests${testType}`;
  const files: SplittableFile[] = fs
    .readdirSync(specDir, 'utf8')
    .filter((fileName: string): boolean => fileName.endsWith('test.ts'))
    .map(
      (fileName: string): SplittableFile => ({
        output: fileName,
        path: `${specDir}/${fileName}`,
      }),
    );
  const output: string = getOutputsForCurrentCiNode({
    files,
  }).join(' ');

  console.log(output);

  return output;
};

if (require.main === module) {
  main();
}
