import {
  type CypressRunTimingResult,
  getCypressTestFileTimes,
  writeTestFileTimes,
} from './test-file-times.helpers';

type CypressRunOptions = {
  browser: string;
  configFile: string;
  spec: string;
};

type CypressFailedRunResult = {
  failures: number;
  message: string;
};

type CypressSuccessfulRunResult = CypressRunTimingResult & {
  totalFailed: number;
};

type CypressRunResult = CypressFailedRunResult | CypressSuccessfulRunResult;

type CypressRunner = {
  run: (options: CypressRunOptions) => Promise<CypressRunResult>;
};

type RunCypressTestsWithTimingDependencies = {
  cypressRunner: CypressRunner;
  env: NodeJS.ProcessEnv;
  exit: (code: number) => void;
  getCypressTestFileTimes: typeof getCypressTestFileTimes;
  writeTestFileTimes: typeof writeTestFileTimes;
};

const defaultDependencies: RunCypressTestsWithTimingDependencies = {
  cypressRunner: require('cypress') as CypressRunner,
  env: process.env,
  exit: process.exit,
  getCypressTestFileTimes,
  writeTestFileTimes,
};

export const runCypressTestsWithTiming = async (
  args: string[] = process.argv.slice(2),
  dependencies: RunCypressTestsWithTimingDependencies = defaultDependencies,
): Promise<void> => {
  const [configFile, specs, outputFilePath, browser = 'edge'] = args;

  if (!configFile || !specs || !outputFilePath) {
    throw new Error(
      'Usage: scripts/github-actions/run-cypress-tests-with-timing.ts <config-file> <specs> <output> [browser]',
    );
  }

  dependencies.env.CYPRESS_AWS_ACCESS_KEY_ID ??= 'S3RVER';
  dependencies.env.CYPRESS_AWS_SECRET_ACCESS_KEY ??= 'S3RVER';
  dependencies.env.CYPRESS_CHECK_DEPLOY_DATE_INTERVAL ??= '5000';

  const results = await dependencies.cypressRunner.run({
    browser,
    configFile,
    spec: specs,
  });

  if ('failures' in results) {
    throw new Error(results.message);
  }

  dependencies.writeTestFileTimes({
    filePath: outputFilePath,
    testFileTimes: dependencies.getCypressTestFileTimes({
      results,
    }),
  });

  dependencies.exit(results.totalFailed);
};
