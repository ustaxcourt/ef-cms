import fs from 'fs';
import {
  getJestTestFileTimes,
  mergeTestFileTimes,
  readTestFileTimes,
  writeTestFileTimes,
  type JestFormattedTestResults,
} from './helpers/testFileTimes';

const readJsonFile = <T>(filePath: string): T => {
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
};

export const main = (args: string[] = process.argv.slice(2)): void => {
  const [command, ...remainingArgs] = args;

  if (command === 'from-jest') {
    const [inputFilePath, outputFilePath] = remainingArgs;

    if (!inputFilePath || !outputFilePath) {
      throw new Error(
        'Usage: npx ts-node scripts/test-file-times.ts from-jest <input> <output>',
      );
    }

    writeTestFileTimes({
      filePath: outputFilePath,
      testFileTimes: getJestTestFileTimes({
        results: readJsonFile<JestFormattedTestResults>(inputFilePath),
      }),
    });
  } else if (command === 'merge') {
    const [outputFilePath, ...inputFilePaths] = remainingArgs;

    if (!outputFilePath || inputFilePaths.length === 0) {
      throw new Error(
        'Usage: npx ts-node scripts/test-file-times.ts merge <output> <input...>',
      );
    }

    writeTestFileTimes({
      filePath: outputFilePath,
      testFileTimes: mergeTestFileTimes(
        inputFilePaths.map(filePath => readTestFileTimes(filePath)),
      ),
    });
  } else {
    throw new Error(
      'Usage: npx ts-node scripts/test-file-times.ts <from-jest|merge> ...args',
    );
  }
};

/* istanbul ignore next */
if (require.main === module) {
  main();
}
