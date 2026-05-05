import fs from 'fs';
import {
  getOutputsForCurrentCiNode,
  type SplittableFile,
} from './helpers/splitTestFiles';

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

/* istanbul ignore next */
if (require.main === module) {
  main();
}
