import fs from 'fs';
import { getOutputsForCurrentCiNode } from './helpers/splitTestFiles';

export const main = (args: string[] = process.argv.slice(2)): string => {
  const testType = args[0] || '';
  const specDir = `./web-client/integration-tests${testType}`;
  const files = fs
    .readdirSync(specDir)
    .filter(f => f.endsWith('test.ts'))
    .map(fileName => ({
      output: fileName,
      path: `${specDir}/${fileName}`,
    }));
  const output = getOutputsForCurrentCiNode({
    files,
  }).join(' ');

  console.log(output);

  return output;
};

/* istanbul ignore next */
if (require.main === module) {
  main();
}
