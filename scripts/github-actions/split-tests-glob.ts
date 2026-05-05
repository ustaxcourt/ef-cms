import glob from 'glob';
import { getOutputsForCurrentCiNode } from './helpers/splitTestFiles';

export const main = (args: string[] = process.argv.slice(2)): string => {
  const testType = args[0] || '';

  let testFiles: string[] = [];
  if (testType.includes('unit')) {
    testFiles = glob.sync('./web-client/src/**/?(*.)+(spec|test).[jt]s?(x)');
  } else if (testType.includes('shared')) {
    testFiles = glob.sync('./shared/src/**/?(*.)+(spec|test).[jt]s');
  }

  const output = getOutputsForCurrentCiNode({
    files: testFiles.map(filePath => ({
      output: filePath,
      path: filePath,
    })),
  }).join('|');

  console.log(output);

  return output;
};

/* istanbul ignore next */
if (require.main === module) {
  main();
}
