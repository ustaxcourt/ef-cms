import fs from 'fs';
import path from 'path';

export type CypressRunTimingResult = {
  runs: {
    spec: {
      absolute?: string;
      relative?: string;
    };
    stats: {
      duration?: number;
    };
  }[];
};

export type JestFormattedTestResults = {
  testResults: {
    endTime?: number;
    name: string;
    startTime?: number;
  }[];
};

export type TestFileTimes = Record<string, number>;

export const normalizeTestFilePath = (
  filePath: string,
  cwd: string = process.cwd(),
): string => {
  const normalizedFilePath = filePath.replace(/\\/gu, '/');

  if (path.isAbsolute(filePath)) {
    return path.relative(cwd, filePath).replace(/\\/gu, '/');
  }

  if (normalizedFilePath.startsWith('./')) {
    return normalizedFilePath.substring(2);
  }

  return normalizedFilePath;
};

export const readTestFileTimes = (filePath: string): TestFileTimes => {
  if (!fs.existsSync(filePath)) {
    return {};
  }

  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as TestFileTimes;
};

export const writeTestFileTimes = ({
  filePath,
  testFileTimes,
}: {
  filePath: string;
  testFileTimes: TestFileTimes;
}): void => {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(testFileTimes, null, 2));
};

export const mergeTestFileTimes = (
  allTestFileTimes: TestFileTimes[],
): TestFileTimes => {
  return allTestFileTimes.reduce<TestFileTimes>((accumulator, currentTimes) => {
    for (const [filePath, duration] of Object.entries(currentTimes)) {
      accumulator[filePath] = duration;
    }

    return accumulator;
  }, {});
};

export const getTestFileTimesFilePaths = (directoryPath: string): string[] => {
  if (!fs.existsSync(directoryPath)) {
    throw new Error(`No timing files found in directory: ${directoryPath}`);
  }

  const filePaths = fs
    .readdirSync(directoryPath)
    .filter(fileName => fileName.endsWith('.json'))
    .sort()
    .map(fileName => path.join(directoryPath, fileName));

  if (filePaths.length === 0) {
    throw new Error(`No timing files found in directory: ${directoryPath}`);
  }

  return filePaths;
};

const writeMergedTestFileTimes = ({
  inputFilePaths,
  outputFilePath,
}: {
  inputFilePaths: string[];
  outputFilePath: string;
}): void => {
  const mergedTestFileTimes = mergeTestFileTimes(
    inputFilePaths.map(filePath => readTestFileTimes(filePath)),
  );

  writeTestFileTimes({
    filePath: outputFilePath,
    testFileTimes: mergedTestFileTimes,
  });

  console.log(
    `Merged ${inputFilePaths.length} shard timing files into ${outputFilePath} (${Object.keys(mergedTestFileTimes).length} test files).`,
  );
};

export const getJestTestFileTimes = ({
  cwd = process.cwd(),
  results,
}: {
  cwd?: string;
  results: JestFormattedTestResults;
}): TestFileTimes => {
  return results.testResults.reduce<TestFileTimes>(
    (accumulator, testResult) => {
      accumulator[normalizeTestFilePath(testResult.name, cwd)] = Math.max(
        1,
        (testResult.endTime ?? 0) - (testResult.startTime ?? 0),
      );

      return accumulator;
    },
    {},
  );
};

export const getCypressTestFileTimes = ({
  cwd = process.cwd(),
  results,
}: {
  cwd?: string;
  results: CypressRunTimingResult;
}): TestFileTimes => {
  return results.runs.reduce<TestFileTimes>((accumulator, runResult) => {
    const filePath = runResult.spec.absolute ?? runResult.spec.relative ?? '';

    if (!filePath) {
      return accumulator;
    }

    accumulator[normalizeTestFilePath(filePath, cwd)] = Math.max(
      1,
      runResult.stats.duration ?? 0,
    );

    return accumulator;
  }, {});
};

const readJsonFile = <T>(filePath: string): T => {
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
};

export const testFileTimes = (args: string[]): void => {
  const [command, ...remainingArgs] = args;

  if (command === 'from-jest') {
    const [inputFilePath, outputFilePath] = remainingArgs;

    if (!inputFilePath || !outputFilePath) {
      throw new Error(
        'Usage: scripts/github-actions/test-file-times.ts from-jest <input> <output>',
      );
    }

    writeTestFileTimes({
      filePath: outputFilePath,
      testFileTimes: getJestTestFileTimes({
        results: readJsonFile<JestFormattedTestResults>(inputFilePath),
      }),
    });
  } else if (command === 'from-cypress') {
    const [inputFilePath, outputFilePath] = remainingArgs;

    if (!inputFilePath || !outputFilePath) {
      throw new Error(
        'Usage: scripts/github-actions/test-file-times.ts from-cypress <input> <output>',
      );
    }

    writeTestFileTimes({
      filePath: outputFilePath,
      testFileTimes: getCypressTestFileTimes({
        results: readJsonFile<CypressRunTimingResult>(inputFilePath),
      }),
    });
  } else if (command === 'merge') {
    const [outputFilePath, ...inputFilePaths] = remainingArgs;

    if (!outputFilePath || inputFilePaths.length === 0) {
      throw new Error(
        'Usage: scripts/github-actions/test-file-times.ts merge <output> <input...>',
      );
    }

    writeMergedTestFileTimes({
      inputFilePaths,
      outputFilePath,
    });
  } else if (command === 'merge-directory') {
    const [outputFilePath, directoryPath] = remainingArgs;

    if (!outputFilePath || !directoryPath) {
      throw new Error(
        'Usage: scripts/github-actions/test-file-times.ts merge-directory <output> <directory>',
      );
    }

    writeMergedTestFileTimes({
      inputFilePaths: getTestFileTimesFilePaths(directoryPath),
      outputFilePath,
    });
  } else {
    throw new Error(
      'Usage: scripts/github-actions/test-file-times.ts <from-jest|from-cypress|merge|merge-directory> ...args',
    );
  }
};
