import fs from 'fs';
import glob from 'glob';
import documentGenerators from '../../shared/src/business/utilities/documentGenerators/jest_document_generator.config';
import hostedEnvironment from '../../web-api/hostedEnvironmentTests/jest-hosted-environment';
import infrastructure from '../../aws/jest-infrastructure.config';
import scripts from '../jest-scripts.config';
import shared from '../../shared/jest-shared.config';
import webApi from '../../web-api/jest-unit.config';
import webClientIntegration from '../../web-client/jest-integration.config';
import webClientUnit from '../../web-client/jest-unit.config';
import {
  normalizeTestFilePath,
  readTestFileTimes,
  type TestFileTimes,
} from './test-file-times.helpers';

export type SplittableFile = {
  output: string;
  path: string;
};

type CypressSuite = {
  config: string;
  excludePublicTests: boolean;
  specDirs: string[];
};

type JestSuite = {
  globs?: string[];
  rootDir: string;
  testMatch?: string | string[];
};

export const cypressSuites: { [suiteName: string]: CypressSuite } = {
  accessibility: {
    config: 'cypress.config.ts',
    excludePublicTests: true,
    specDirs: ['cypress/local-only/tests/accessibility'],
  },
  integration: {
    config: 'cypress.config.ts',
    excludePublicTests: true,
    specDirs: ['cypress/local-only/tests/integration'],
  },
  public: {
    config: 'cypress-public.config.ts',
    excludePublicTests: false,
    specDirs: [
      'cypress/local-only/tests/accessibility/public',
      'cypress/local-only/tests/integration/public',
    ],
  },
  realUsers: {
    config: 'cypress-real-user-tests.config.ts',
    excludePublicTests: false,
    specDirs: ['cypress/real-users'],
  },
  smoketests: {
    config: 'cypress-smoketests.config.ts',
    excludePublicTests: true,
    specDirs: ['cypress/deployed-and-local/integration'],
  },
  smoketestsReadonly: {
    config: 'cypress-smoketests-readonly.config.ts',
    excludePublicTests: true,
    specDirs: ['cypress/readonly/integration'],
  },
  smoketestsReadonlyPublic: {
    config: 'cypress-smoketests-readonly-public.config.ts',
    excludePublicTests: false,
    specDirs: ['cypress/readonly/integration/public'],
  },
};

// Define the type for the keys of the original object for strict typing
type kCypressSuite = string;
export const specDirToSuiteMap = Object.entries(cypressSuites).reduce(
  (acc, [key, config]) => {
    const suiteName = key as kCypressSuite;
    config.specDirs.forEach(specDir => {
      acc[specDir] = suiteName;
    });
    return acc;
  },
  {} as Record<string, kCypressSuite>,
);

export const jestSuites: { [suiteName: string]: JestSuite } = {
  documentGenerators: {
    rootDir: 'shared/src/business/utilities/documentGenerators/',
    testMatch: documentGenerators.testMatch,
  },
  hostedEnvironment: {
    rootDir: 'web-api/hostedEnvironmentTests',
    testMatch: hostedEnvironment.testMatch,
  },
  infrastructure: {
    rootDir: 'aws',
    testMatch: infrastructure.testMatch,
  },
  scripts: {
    rootDir: 'scripts',
    testMatch: scripts.testMatch,
  },
  shared: {
    rootDir: 'shared',
    testMatch: shared.testMatch,
  },
  webApi: {
    rootDir: 'web-api',
    testMatch: webApi.testMatch,
  },
  webClientIntegration: {
    rootDir: 'web-client',
    testMatch: webClientIntegration.testMatch,
  },
  webClientUnit: {
    rootDir: 'web-client',
    testMatch: webClientUnit.testMatch,
  },
};

const getGlobsFromTestMatch = (jestSuite: JestSuite): string[] => {
  const testMatches = Array.isArray(jestSuite.testMatch)
    ? jestSuite.testMatch
    : [jestSuite.testMatch];
  const globs: string[] = [];
  for (const tm of testMatches) {
    if (!tm) {
      continue;
    }
    globs.push(
      tm.replace(/^\*\*\//, '').replace('<rootDir>', jestSuite.rootDir),
    );
  }
  return globs;
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
  const normalizedPath = normalizeTestFilePath(file.path);
  return historicalTestFileTimes[normalizedPath] ?? countLinesInFile(file.path);
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

export const splitTests = (publicTests: boolean): string => {
  const specDir: string = `web-client/integration-tests${publicTests ? '-public' : ''}/`;
  const files: SplittableFile[] = fs
    .readdirSync(specDir, 'utf8')
    .filter((fileName: string): boolean => fileName.endsWith('test.ts'))
    .map(
      (fileName: string): SplittableFile => ({
        output: fileName,
        path: `${specDir}${fileName}`,
      }),
    );
  const output: string = getOutputsForCurrentCiNode({
    files,
  }).join(' ');

  console.log(output);

  return output;
};

export const splitTestsCypress = (testSuite: string): string => {
  if (!(testSuite in cypressSuites)) {
    throw new Error(`Invalid Cypress suite: ${testSuite}`);
  }
  const cypressSuite: CypressSuite = cypressSuites[testSuite];
  const files: SplittableFile[] = [];
  for (const specDir of cypressSuite.specDirs) {
    const directoryEntries: string[] = fs.readdirSync(specDir, {
      encoding: 'utf8',
      recursive: true,
    });
    const specFiles: SplittableFile[] = directoryEntries
      .filter(
        (file: string): boolean =>
          file.endsWith('cy.ts') &&
          (!cypressSuite.excludePublicTests || !file.includes('public/')),
      )
      .map(
        (file: string): SplittableFile => ({
          output: `${specDir}/${file}`,
          path: `${specDir}/${file}`,
        }),
      );
    for (const file of specFiles) {
      files.push(file);
    }
  }
  const output: string = getOutputsForCurrentCiNode({
    files,
  }).join(',');

  console.log(output);

  return output;
};

export const splitTestsGlob = (testSuite: string): string => {
  if (!(testSuite in jestSuites)) {
    throw new Error(`Invalid Jest suite: ${testSuite}`);
  }
  const testFiles: string[] = [];
  const testGlobs = getGlobsFromTestMatch(jestSuites[testSuite]);
  for (const testGlob of testGlobs) {
    const files: string[] = glob.sync(testGlob);
    for (const file of files) {
      if (!testFiles.includes(file)) {
        testFiles.push(file);
      }
    }
  }

  const output: string = getOutputsForCurrentCiNode({
    files: testFiles.map(
      (filePath: string): SplittableFile => ({
        output: filePath,
        path: filePath,
      }),
    ),
  }).join('\\|');

  console.log(output);

  return output;
};
