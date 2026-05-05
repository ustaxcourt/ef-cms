import cypress from 'cypress';
import {
  getCypressTestFileTimes,
  writeTestFileTimes,
} from './helpers/testFileTimes';

export const main = async (
  args: string[] = process.argv.slice(2),
): Promise<void> => {
  const [configFile, specs, outputFilePath, browser = 'edge'] = args;

  if (!configFile || !specs || !outputFilePath) {
    throw new Error(
      'Usage: npx ts-node scripts/run-cypress-tests-with-timing.ts <config-file> <specs> <output> [browser]',
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
