import fs from 'fs';
import path from 'path';

export type CypressRunTimingResult = {
  runs: Array<{
    spec: {
      absolute?: string;
      relative?: string;
    };
    stats: {
      duration?: number;
    };
  }>;
};

export type JestFormattedTestResults = {
  testResults: Array<{
    endTime?: number;
    name: string;
    startTime?: number;
  }>;
};

export type TestFileTimes = Record<string, number>;

export const normalizeTestFilePath = (
  filePath: string,
  cwd: string = process.cwd(),
): string => {
  const normalizedFilePath = filePath.replace(/\\/gu, '/');

  if (path.isAbsolute(filePath)) {
    const relativePath = path.relative(cwd, filePath).replace(/\\/gu, '/');

    return `./${relativePath}`;
  }

  if (normalizedFilePath.startsWith('./')) {
    return normalizedFilePath;
  }

  return `./${normalizedFilePath}`;
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

export const getJestTestFileTimes = ({
  cwd = process.cwd(),
  results,
}: {
  cwd?: string;
  results: JestFormattedTestResults;
}): TestFileTimes => {
  return results.testResults.reduce<TestFileTimes>(
    (accumulator, testResult) => {
      const duration = Math.max(
        1,
        (testResult.endTime ?? 0) - (testResult.startTime ?? 0),
      );

      accumulator[normalizeTestFilePath(testResult.name, cwd)] = duration;

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
  } else if (command === 'merge') {
    const [outputFilePath, ...inputFilePaths] = remainingArgs;

    if (!outputFilePath || inputFilePaths.length === 0) {
      throw new Error(
        'Usage: scripts/github-actions/test-file-times.ts merge <output> <input...>',
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
      'Usage: scripts/github-actions/test-file-times.ts <from-jest|merge> ...args',
    );
  }
};
