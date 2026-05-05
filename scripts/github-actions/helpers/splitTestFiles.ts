import fs from 'fs';
import { readTestFileTimes, type TestFileTimes } from './testFileTimes';

export type SplittableFile = {
  output: string;
  path: string;
};

export const countLinesInFile = (filePath: string): number => {
  const fileContents = fs.readFileSync(filePath, 'utf8');

  if (fileContents.length === 0) {
    return 1;
  }

  return fileContents.split(/\r\n|\n|\r/u).length;
};

export const getHistoricalTestFileTimes = (
  env: NodeJS.ProcessEnv = process.env,
): TestFileTimes => {
  const testFileTimesPath = env.TEST_FILE_TIMINGS_PATH;

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
  const weightedFiles = files
    .map(file => ({
      ...file,
      weight: getWeightForFile({
        file,
        historicalTestFileTimes,
      }),
    }))
    .sort((a, b) => b.weight - a.weight || a.output.localeCompare(b.output));

  for (const weightedFile of weightedFiles) {
    const shardIndex = shardWeights.indexOf(Math.min(...shardWeights));

    shards[shardIndex].push({
      output: weightedFile.output,
      path: weightedFile.path,
    });
    shardWeights[shardIndex] += weightedFile.weight;
  }

  return shards.map(shard =>
    shard.sort((a, b) => a.output.localeCompare(b.output)),
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
  })[index].map(file => file.output);
};
