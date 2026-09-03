import fs from 'fs';
import os from 'os';
import path from 'path';
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
  log: (message: string) => void;
  sleep: (ms: number) => Promise<void>;
  writeTestFileTimes: typeof writeTestFileTimes;
};

const defaultDependencies: RunCypressTestsWithTimingDependencies = {
  cypressRunner: require('cypress') as CypressRunner,
  dawson: { isLocal: true, isPublic: false },
  env: process.env,
  exit: (code: number) => process.exit(code),
  getCypressTestFileTimes,
  log: (message: string) => console.log(message),
  sleep: async (ms: number) =>
    await new Promise(resolve => setTimeout(resolve, ms)),
  writeTestFileTimes,
};

const BROWSER_CONNECT_RETRY_DELAY_MS = 5000;

const RETRYABLE_CYPRESS_LAUNCH_FAILURE_PATTERNS: RegExp[] = [
  /still waiting to connect to (edge|chrome)/i,
  /there was an error reconnecting to the chrome devtools protocol/i,
  /the browser never connected/i,
  /timed out waiting for the browser to connect/i,
  /browser.*failed to start/i,
  /error:\s*connect\s+econnrefused\s+127\.0\.0\.1:\d+/i,
];

type BrowserLaunchAttempt = {
  browser: string;
  description: string;
  waitBeforeMs?: number;
};

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
};

export const isRetryableCypressLaunchFailure = (message: string): boolean => {
  return RETRYABLE_CYPRESS_LAUNCH_FAILURE_PATTERNS.some(
    (pattern: RegExp): boolean => pattern.test(message),
  );
};

const getBrowserLaunchAttempts = ({
  browser,
  browserWasExplicitlyProvided,
  isCi,
}: {
  browser: string;
  browserWasExplicitlyProvided: boolean;
  isCi: boolean;
}): BrowserLaunchAttempt[] => {
  const attempts: BrowserLaunchAttempt[] = [
    {
      browser,
      description: 'initial browser launch',
    },
  ];

  if (!isCi) {
    return attempts;
  }

  attempts.push({
    browser,
    description: 'retrying browser launch after transient connection failure',
    waitBeforeMs: BROWSER_CONNECT_RETRY_DELAY_MS,
  });

  if (!browserWasExplicitlyProvided && browser === 'edge') {
    attempts.push({
      browser: 'chrome',
      description:
        'falling back to chrome after repeated Edge connection failures',
      waitBeforeMs: BROWSER_CONNECT_RETRY_DELAY_MS,
    });
  }

  return attempts;
};

const runCypressWithBrowserRetries = async ({
  browser,
  browserWasExplicitlyProvided,
  configFile,
  dependencies,
  specs,
}: {
  browser: string;
  browserWasExplicitlyProvided: boolean;
  configFile: string;
  dependencies: RunCypressTestsWithTimingDependencies;
  specs?: string;
}): Promise<CypressSuccessfulRunResult> => {
  const attempts = getBrowserLaunchAttempts({
    browser,
    browserWasExplicitlyProvided,
    isCi: Boolean(dependencies.env.CI),
  });
  let lastError: Error = new Error(
    'Cypress browser launch failed unexpectedly.',
  );

  for (const [index, attempt] of attempts.entries()) {
    if (attempt.waitBeforeMs) {
      dependencies.log(
        `Cypress ${attempt.description}; waiting ${attempt.waitBeforeMs}ms before attempt ${index + 1}/${attempts.length}.`,
      );
      await dependencies.sleep(attempt.waitBeforeMs);
    }

    dependencies.log(
      `Starting Cypress attempt ${index + 1}/${attempts.length} with browser ${attempt.browser} using config ${configFile}.`,
    );

    try {
      const results = specs
        ? await dependencies.cypressRunner.run({
            browser: attempt.browser,
            configFile,
            spec: specs,
          })
        : await dependencies.cypressRunner.run({
            browser: attempt.browser,
            configFile,
          });

      if ('failures' in results) {
        const errorMessage = results.message;

        if (
          isRetryableCypressLaunchFailure(errorMessage) &&
          index < attempts.length - 1
        ) {
          dependencies.log(
            `Retryable Cypress browser launch failure on attempt ${index + 1}/${attempts.length}: ${errorMessage}`,
          );
          lastError = new Error(errorMessage);
          continue;
        }

        lastError = new Error(errorMessage);
        break;
      }

      return results;
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);

      if (
        isRetryableCypressLaunchFailure(errorMessage) &&
        index < attempts.length - 1
      ) {
        dependencies.log(
          `Caught retryable Cypress browser launch error on attempt ${index + 1}/${attempts.length}: ${errorMessage}`,
        );
        lastError = error instanceof Error ? error : new Error(errorMessage);
        continue;
      }

      throw error;
    }
  }

  throw lastError;
};

export const determineSuiteFromSpecs = ({
  extantSpecs,
}: {
  extantSpecs: string[];
}): string => {
  const suspectedSuites: string[] = [];
  for (const specFile of extantSpecs) {
    if (specFile.toLowerCase().includes('public')) {
      const suspectedPublicSuite = Object.keys(specDirToSuiteMap).filter(
        specDir => {
          const suiteName = specDirToSuiteMap[specDir];
          return (
            specFile.includes(specDir) &&
            suiteName.toLowerCase().includes('public')
          );
        },
      );
      for (const specDir of suspectedPublicSuite) {
        if (!suspectedSuites.includes(specDirToSuiteMap[specDir])) {
          suspectedSuites.push(specDirToSuiteMap[specDir]);
        }
      }
    } else {
      const suspectedPrivateSuite = Object.keys(specDirToSuiteMap).find(
        specDir => specFile.includes(specDir),
      );
      if (suspectedPrivateSuite) {
        if (
          !suspectedSuites.includes(specDirToSuiteMap[suspectedPrivateSuite])
        ) {
          suspectedSuites.push(specDirToSuiteMap[suspectedPrivateSuite]);
        }
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
  dependencies = defaultDependencies,
}: {
  browser?: string;
  current: boolean;
  cypressSuite?: string;
  dependencies?: RunCypressTestsWithTimingDependencies;
}): Promise<void> => {
  if (!cypressSuite) {
    throw new Error('Must specify --suite to open');
  }
  if (cypressSuite && !(cypressSuite in cypressSuites)) {
    throw new Error(`Invalid Cypress suite: ${cypressSuite}`);
  }
  const determinedBrowser =
    browser && browser.length > 0
      ? browser
      : cypressSuite.toLowerCase().includes('public')
        ? 'chrome'
        : 'edge';
  return await openCypressSuite({
    browserArg: determinedBrowser,
    configFile: cypressSuites[cypressSuite].config,
    current,
    dependencies,
  });
};

export const onSpecs = async ({
  browser,
  current,
  dependencies = defaultDependencies,
  file,
  outputFilePath,
}: {
  browser?: string;
  current: boolean;
  dependencies?: RunCypressTestsWithTimingDependencies;
  file: string;
  outputFilePath?: string;
}): Promise<void> => {
  let determinedSpecs: string;
  const extantSpecs: string[] = [];
  for (const specFile of file.replaceAll(' ', ',').split(',')) {
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
      : determinedSuite.toLowerCase().includes('public')
        ? 'chrome'
        : 'edge';
  const determinedOutputFilePath =
    outputFilePath ?? path.join(os.tmpdir(), `${determinedSuite}-results.json`);
  return await runCypressWithTiming({
    browserArg: determinedBrowser,
    configFile: cypressSuites[determinedSuite].config,
    current,
    dependencies,
    outputFilePath: determinedOutputFilePath,
    specs: determinedSpecs,
  });
};

export const onSuite = async ({
  browser,
  current,
  cypressSuite,
  dependencies = defaultDependencies,
  outputFilePath,
}: {
  browser?: string;
  current: boolean;
  cypressSuite?: string;
  dependencies?: RunCypressTestsWithTimingDependencies;
  outputFilePath?: string;
}): Promise<void> => {
  if (!cypressSuite) {
    throw new Error('Must specify either --suite or --file');
  }
  if (!(cypressSuite in cypressSuites)) {
    throw new Error(`Invalid suite: ${cypressSuite}`);
  }
  const determinedBrowser =
    browser && browser.length > 0
      ? browser
      : cypressSuite.toLowerCase().includes('public')
        ? 'chrome'
        : 'edge';
  const determinedOutputFilePath =
    outputFilePath ?? path.join(os.tmpdir(), `${cypressSuite}-results.json`);
  return await runCypressWithTiming({
    browserArg: determinedBrowser,
    configFile: cypressSuites[cypressSuite].config,
    current,
    dependencies,
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
  dependencies.dawson.isPublic = configFile.toLowerCase().includes('public');

  if (dependencies.env.CI) {
    dependencies.env.CYPRESS_NO_COMMAND_LOG = '1';
  }
  dependencies.env.CYPRESS_CHECK_DEPLOY_DATE_INTERVAL = '5000';
  dependencies.env.CYPRESS_TARGET_ENV = dependencies.env.ENV;

  if (dependencies.dawson.isLocal) {
    const port = dependencies.dawson.isPublic ? '5678' : '1234';
    dependencies.env.CYPRESS_AWS_ACCESS_KEY_ID = 'S3RVER';
    dependencies.env.CYPRESS_AWS_SECRET_ACCESS_KEY = 'S3RVER';
    dependencies.env.CYPRESS_BASE_URL = `http://localhost:${port}`;
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
    if (!dependencies.env.CI && dependencies.env.AWS_SESSION_TOKEN) {
      dependencies.env.CYPRESS_AWS_SESSION_TOKEN =
        dependencies.env.AWS_SESSION_TOKEN;
    }
    dependencies.env.CYPRESS_BASE_URL = `https://${nonPublicPrefix}${cypressColor}.${efcmsDomain}`;
    dependencies.env.CYPRESS_DATABASE_NAME = dependencies.env.DATABASE_NAME;
    dependencies.env.CYPRESS_DEFAULT_ACCOUNT_PASS =
      dependencies.env.DEFAULT_ACCOUNT_PASS;
    dependencies.env.CYPRESS_DEPLOYING_COLOR = cypressColor;
    dependencies.env.CYPRESS_DISABLE_EMAILS = dependencies.env.DISABLE_EMAILS;
    dependencies.env.CYPRESS_EFCMS_DOMAIN = efcmsDomain;
    dependencies.env.CYPRESS_MIGRATE = 'false';
    dependencies.env.CYPRESS_PAY_GOV_ORIGIN = dependencies.env.PAY_GOV_ORIGIN;
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
  const browserWasExplicitlyProvided = !!browserArg && browserArg.length > 0;
  let browser: string;

  if (browserWasExplicitlyProvided) {
    browser = browserArg;
  } else {
    browser = dependencies.dawson.isPublic ? 'chrome' : 'edge';
  }

  const results = await runCypressWithBrowserRetries({
    browser,
    browserWasExplicitlyProvided,
    configFile,
    dependencies,
    specs,
  });

  dependencies.writeTestFileTimes({
    filePath: outputFilePath,
    testFileTimes: dependencies.getCypressTestFileTimes({
      results,
    }),
  });

  dependencies.exit(results.totalFailed);
};
