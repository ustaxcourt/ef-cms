import fs from 'fs';
import glob from 'glob';
import {
  readTestFileTimes,
  type TestFileTimes,
} from './test-file-times.helpers';

export type SplittableFile = {
  output: string;
  path: string;
};

export const countLinesInFile = (filePath: string): number => {
  const fileContents: string = fs.readFileSync(filePath, 'utf8');

  if (fileContents.length === 0) {
    return 1;
  }

  return fileContents.split(/\r\n|\n|\r/u).length;
};

export const getHistoricalTestFileTimes = (
  env: NodeJS.ProcessEnv = process.env,
): TestFileTimes => {
  const testFileTimesPath: string | undefined = env.TEST_FILE_TIMINGS_PATH;

  if (!testFileTimesPath) {
    return {};
  }

  return readTestFileTimes(testFileTimesPath);
};

export const getWeightForFile = ({
  file,
  historicalTestFileTimes,
}: {
  file: SplittableFile;
  historicalTestFileTimes: TestFileTimes;
}): number => {
  return historicalTestFileTimes[file.path] ?? countLinesInFile(file.path);
};

export const distributeFilesByWeight = ({
  files,
  historicalTestFileTimes = {},
  total,
}: {
  files: SplittableFile[];
  historicalTestFileTimes?: TestFileTimes;
  total: number;
}): SplittableFile[][] => {
  if (!Number.isInteger(total) || total < 1) {
    throw new Error(
      `CI_NODE_TOTAL must be a positive integer. Received: ${total}`,
    );
  }

  const shards: SplittableFile[][] = Array.from({ length: total }, () => []);
  const shardWeights: number[] = Array.from({ length: total }, () => 0);
  const weightedFiles: Array<SplittableFile & { weight: number }> = files
    .map((file: SplittableFile): SplittableFile & { weight: number } => ({
      ...file,
      weight: getWeightForFile({
        file,
        historicalTestFileTimes,
      }),
    }))
    .sort(
      (
        a: SplittableFile & { weight: number },
        b: SplittableFile & { weight: number },
      ): number => b.weight - a.weight || a.output.localeCompare(b.output),
    );

  for (const weightedFile of weightedFiles) {
    const shardIndex = shardWeights.indexOf(Math.min(...shardWeights));

    shards[shardIndex].push({
      output: weightedFile.output,
      path: weightedFile.path,
    });
    shardWeights[shardIndex] += weightedFile.weight;
  }

  return shards.map((shard: SplittableFile[]): SplittableFile[] =>
    shard.sort((a: SplittableFile, b: SplittableFile): number =>
      a.output.localeCompare(b.output),
    ),
  );
};

export const getCiNodeConfig = (
  env: NodeJS.ProcessEnv = process.env,
): {
  index: number;
  total: number;
} => {
  const total = Number.parseInt(env.CI_NODE_TOTAL ?? '', 10);
  const index = Number.parseInt(env.CI_NODE_INDEX ?? '', 10);

  if (!Number.isInteger(total) || total < 1) {
    throw new Error(
      `CI_NODE_TOTAL must be a positive integer. Received: ${env.CI_NODE_TOTAL ?? 'undefined'}`,
    );
  }

  if (!Number.isInteger(index) || index < 0 || index >= total) {
    throw new Error(
      `CI_NODE_INDEX must be an integer between 0 and ${total - 1}. Received: ${env.CI_NODE_INDEX ?? 'undefined'}`,
    );
  }

  return {
    index,
    total,
  };
};

export const getOutputsForCurrentCiNode = ({
  env = process.env,
  files,
}: {
  env?: NodeJS.ProcessEnv;
  files: SplittableFile[];
}): string[] => {
  const { index, total } = getCiNodeConfig(env);

  return distributeFilesByWeight({
    files,
    historicalTestFileTimes: getHistoricalTestFileTimes(env),
    total,
  })[index].map((file: SplittableFile): string => file.output);
};

export const splitTests = (testType: string): string => {
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

export const splitTestsCypress = (testDir: string): string => {
  const shouldExcludePublicTests: boolean = !testDir.includes('public');
  const specDir: string = './cypress/local-only/tests';
  const directoryEntries: string[] = fs.readdirSync(specDir, {
    encoding: 'utf8',
    recursive: true,
  });
  const files: SplittableFile[] = directoryEntries
    .filter(
      (file: string): boolean =>
        file.endsWith('cy.ts') &&
        (!shouldExcludePublicTests || !file.includes('public/')) &&
        file.includes(`${testDir}/`),
    )
    .map(
      (file: string): SplittableFile => ({
        output: `./cypress/local-only/tests/${file}`,
        path: `./cypress/local-only/tests/${file}`,
      }),
    );
  const output: string = getOutputsForCurrentCiNode({
    files,
  }).join(',');

  console.log(output);

  return output;
};

export const splitTestsGlob = (testType: string): string => {
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
