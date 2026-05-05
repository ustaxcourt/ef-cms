import {
  type CypressRunTimingResult,
  getCypressTestFileTimes,
  writeTestFileTimes,
} from './helpers/testFileTimes';

export type CypressRunOptions = {
  browser: string;
  configFile: string;
  spec: string;
};

export type CypressRunFailureResult = {
  failures: number;
  message: string;
  status: string;
};

export type CypressRunSuccessResult = CypressRunTimingResult & {
  totalFailed: number;
};

export type CypressRunResult =
  | CypressRunFailureResult
  | CypressRunSuccessResult;

type CypressModule = {
  run: (options: CypressRunOptions) => Promise<CypressRunResult>;
};

const cypress: CypressModule = require('cypress');

export const main = async (
  args: string[] = process.argv.slice(2),
): Promise<void> => {
  const [configFile, specs, outputFilePath, browser = 'edge'] = args;

  if (!configFile || !specs || !outputFilePath) {
    throw new Error(
      'Usage: npx ts-node scripts/github-actions/run-cypress-tests-with-timing.ts <config-file> <specs> <output> [browser]',
    );
  }

  process.env.CYPRESS_AWS_ACCESS_KEY_ID ??= 'S3RVER';
  process.env.CYPRESS_AWS_SECRET_ACCESS_KEY ??= 'S3RVER';
  process.env.CYPRESS_CHECK_DEPLOY_DATE_INTERVAL ??= '5000';

  const results = await cypress.run({
    browser,
    configFile,
    spec: specs,
  });

  if ('failures' in results) {
    throw new Error(results.message);
  }

  writeTestFileTimes({
    filePath: outputFilePath,
    testFileTimes: getCypressTestFileTimes({
      results,
    }),
  });

  process.exit(results.totalFailed);
};

/* istanbul ignore next */
if (require.main === module) {
  void main();
}
