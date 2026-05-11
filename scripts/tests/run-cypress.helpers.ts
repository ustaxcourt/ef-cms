import fs from 'fs';
import {
  type CypressRunTimingResult,
  getCypressTestFileTimes,
  writeTestFileTimes,
} from '../github-actions/test-file-times.helpers';
import {
  cypressSuites,
  specDirToSuiteMap,
} from '../github-actions/split-tests.helpers';

type CypressRunOptions = {
  browser: string;
  configFile: string;
  spec?: string;
};

type CypressOpenOptions = {
  browser: string;
  configFile: string;
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
  open: (options: CypressOpenOptions) => Promise<void>;
  run: (options: CypressRunOptions) => Promise<CypressRunResult>;
};

type RunCypressTestsWithTimingDependencies = {
  cypressRunner: CypressRunner;
  dawson: { isLocal: boolean; isPublic: boolean };
  env: NodeJS.ProcessEnv;
  exit: (code: number) => void;
  getCypressTestFileTimes: typeof getCypressTestFileTimes;
  writeTestFileTimes: typeof writeTestFileTimes;
};

const defaultDependencies: RunCypressTestsWithTimingDependencies = {
  cypressRunner: require('cypress') as CypressRunner,
  dawson: { isLocal: true, isPublic: false },
  env: process.env,
  exit: process.exit,
  getCypressTestFileTimes,
  writeTestFileTimes,
};

export const determineSuiteFromSpecs = ({
  extantSpecs,
}: {
  extantSpecs: string[];
}): string => {
  const suspectedSuites: string[] = [];
  for (const specFile of extantSpecs) {
    if (specFile.includes('ublic')) {
      const suspectedPublicSuite = Object.keys(specDirToSuiteMap).filter(
        specDir => {
          const suiteName = specDirToSuiteMap[specDir];
          return specFile.includes(specDir) && suiteName.includes('ublic');
        },
      );
      for (const specDir of suspectedPublicSuite) {
        suspectedSuites.push(specDirToSuiteMap[specDir]);
      }
    } else {
      const suspectedPrivateSuite = Object.keys(specDirToSuiteMap).find(
        specDir => specFile.includes(specDir),
      );
      if (suspectedPrivateSuite) {
        suspectedSuites.push(specDirToSuiteMap[suspectedPrivateSuite]);
      }
    }
  }
  const determinedSpecs = extantSpecs.join(',');
  if (suspectedSuites.length === 0) {
    throw new Error(`No matching suite found for specs: ${determinedSpecs}`);
  }
  if (suspectedSuites.length > 1) {
    throw new Error(
      `Multiple matching suites found for specs: ${determinedSpecs}. Please specify the suite explicitly.`,
    );
  }
  return suspectedSuites[0];
};

export const onOpen = async ({
  browser,
  current,
  cypressSuite,
}: {
  browser?: string;
  current: boolean;
  cypressSuite?: string;
}) => {
  if (!cypressSuite) {
    throw new Error('Must specify --suite to open');
  }
  if (cypressSuite && !(cypressSuite in cypressSuites)) {
    throw new Error(`Invalid Cypress suite: ${cypressSuite}`);
  }
  const determinedBrowser =
    browser && browser.length > 0
      ? browser
      : cypressSuite.includes('ublic')
        ? 'chrome'
        : 'edge';
  return await openCypressSuite({
    browserArg: determinedBrowser,
    configFile: cypressSuites[cypressSuite].config,
    current,
  });
};

export const onSpecs = async ({
  browser,
  current,
  file,
  outputFilePath,
}: {
  browser?: string;
  current: boolean;
  file: string;
  outputFilePath?: string;
}) => {
  let determinedSpecs: string;
  const extantSpecs: string[] = [];
  for (const specFile of file.split(',')) {
    if (fs.existsSync(specFile)) {
      extantSpecs.push(specFile);
    }
  }
  if (extantSpecs.length > 0) {
    determinedSpecs = extantSpecs.join(',');
  } else {
    throw new Error(`No matching spec files found: ${file}`);
  }
  const determinedSuite = determineSuiteFromSpecs({ extantSpecs });
  const determinedBrowser =
    browser && browser.length > 0
      ? browser
      : determinedSuite.includes('ublic')
        ? 'chrome'
        : 'edge';
  const determinedOutputFilePath =
    outputFilePath ?? `${determinedSuite}-results.json`;
  return await runCypressWithTiming({
    browserArg: determinedBrowser,
    configFile: cypressSuites[determinedSuite].config,
    current,
    outputFilePath: determinedOutputFilePath,
    specs: determinedSpecs,
  });
};

export const onSuite = async ({
  browser,
  current,
  cypressSuite,
  outputFilePath,
}: {
  browser?: string;
  current: boolean;
  cypressSuite?: string;
  outputFilePath?: string;
}) => {
  if (!cypressSuite) {
    throw new Error('Must specify either --suite or --file');
  }
  if (!(cypressSuite in cypressSuites)) {
    throw new Error(`Invalid suite: ${cypressSuite}`);
  }
  console.log(`Wants browser: ${browser}`);
  const determinedBrowser =
    browser && browser.length > 0
      ? browser
      : cypressSuite.includes('ublic')
        ? 'chrome'
        : 'edge';
  console.log(`Determined browser: ${determinedBrowser}`);
  const determinedOutputFilePath =
    outputFilePath ?? `${cypressSuite}-results.json`;
  return await runCypressWithTiming({
    browserArg: determinedBrowser,
    configFile: cypressSuites[cypressSuite].config,
    current,
    outputFilePath: determinedOutputFilePath,
  });
};

export const setEnvironmentVariables = ({
  configFile,
  current,
  dependencies,
}: {
  configFile: string;
  current: boolean;
  dependencies: RunCypressTestsWithTimingDependencies;
}): void => {
  dependencies.dawson.isLocal =
    !dependencies.env.ENV || dependencies.env.ENV === 'local';
  if (dependencies.dawson.isLocal) dependencies.env.ENV = 'local';
  dependencies.dawson.isPublic = configFile.includes('ublic');

  if (dependencies.env.CI) {
    dependencies.env.CYPRESS_NO_COMMAND_LOG ??= '1';
  }
  dependencies.env.CYPRESS_CHECK_DEPLOY_DATE_INTERVAL ??= '5000';
  dependencies.env.CYPRESS_TARGET_ENV ??= dependencies.env.ENV;

  if (dependencies.dawson.isLocal) {
    const port = dependencies.dawson.isPublic ? '5678' : '1234';
    dependencies.env.CYPRESS_AWS_ACCESS_KEY_ID ??= 'S3RVER';
    dependencies.env.CYPRESS_AWS_SECRET_ACCESS_KEY ??= 'S3RVER';
    dependencies.env.CYPRESS_BASE_URL ??= `http://localhost:${port}`;
  } else {
    const env = dependencies.env.ENV;
    const currentColor = dependencies.env.CURRENT_COLOR;
    const deployingColor = currentColor === 'blue' ? 'green' : 'blue';
    const cypressColor = current ? currentColor : deployingColor;
    const nonPublicPrefix = dependencies.dawson.isPublic ? '' : 'app-';
    const efcmsDomain = dependencies.env.EFCMS_DOMAIN;

    dependencies.env.CYPRESS_AWS_ACCESS_KEY_ID =
      dependencies.env.AWS_ACCESS_KEY_ID;
    dependencies.env.CYPRESS_AWS_SECRET_ACCESS_KEY =
      dependencies.env.AWS_SECRET_ACCESS_KEY;
    dependencies.env.CYPRESS_AWS_SESSION_TOKEN =
      dependencies.env.AWS_SESSION_TOKEN;
    dependencies.env.CYPRESS_BASE_URL = `https://${nonPublicPrefix}${cypressColor}.${efcmsDomain}`;
    dependencies.env.CYPRESS_DATABASE_NAME = dependencies.env.DATABASE_NAME;
    dependencies.env.CYPRESS_DEFAULT_ACCOUNT_PASS =
      dependencies.env.DEFAULT_ACCOUNT_PASS;
    dependencies.env.CYPRESS_DEPLOYING_COLOR = cypressColor;
    dependencies.env.CYPRESS_DISABLE_EMAILS = dependencies.env.DISABLE_EMAILS;
    dependencies.env.CYPRESS_EFCMS_DOMAIN = efcmsDomain;
    dependencies.env.CYPRESS_MIGRATE = 'false';
    dependencies.env.CYPRESS_POSTGRES_HOST = dependencies.env.POSTGRES_HOST;
    dependencies.env.CYPRESS_POSTGRES_PASSWORD =
      dependencies.env.POSTGRES_PASSWORD;
    dependencies.env.CYPRESS_POSTGRES_USER = dependencies.env.POSTGRES_USER;
    dependencies.env.CYPRESS_SMOKETEST_BUCKET = `${efcmsDomain}-email-inbox-${env}-us-east-1`;
  }
};

export const openCypressSuite = async ({
  browserArg,
  configFile,
  current,
  dependencies = defaultDependencies,
}: {
  browserArg?: string;
  configFile: string;
  current: boolean;
  dependencies?: RunCypressTestsWithTimingDependencies;
}): Promise<void> => {
  setEnvironmentVariables({ configFile, current, dependencies });
  const browser =
    browserArg && browserArg.length > 0
      ? browserArg
      : dependencies.dawson.isPublic
        ? 'chrome'
        : 'edge';
  await dependencies.cypressRunner.open({ browser, configFile });
};

export const runCypressWithTiming = async ({
  browserArg,
  configFile,
  current,
  dependencies = defaultDependencies,
  outputFilePath,
  specs,
}: {
  browserArg?: string;
  configFile: string;
  current: boolean;
  dependencies?: RunCypressTestsWithTimingDependencies;
  outputFilePath: string;
  specs?: string;
}): Promise<void> => {
  setEnvironmentVariables({ configFile, current, dependencies });
  const browser =
    browserArg && browserArg.length > 0
      ? browserArg
      : dependencies.dawson.isPublic
        ? 'chrome'
        : 'edge';

  const results = specs
    ? await dependencies.cypressRunner.run({ browser, configFile, spec: specs })
    : await dependencies.cypressRunner.run({ browser, configFile });

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
