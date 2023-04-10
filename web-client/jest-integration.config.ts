import type { Config } from 'jest';

const config: Config = {
  clearMocks: true,
  collectCoverage: false,
  globals: {
    File() {},
    FileReader: () => {},
    atob: x => x,
  },
  maxWorkers: 1, // because running integration tests are heavy and can interfere with one another, we are locking this to 1 worker
  testEnvironment: 'node',
  // testMatch: [
  //   '**/web-client/integration-tests/**/?(*.)+(spec|test).[jt]s?(x)',
  //   '**/web-client/integration-tests-public/**/?(*.)+(spec|test).[jt]s?(x)',
  // ], // Uncomment testMatch to run all integration tests in integration-tests + integration-tests-public
  testTimeout: 30000,
  transform: {
    '\\.[jt]sx?$': ['babel-jest', { rootMode: 'upward' }],
  },
  verbose: false,
  workerIdleMemoryLimit: '10%', // After a jest runner uses X% of total system memory, recreate the runner.
};

// eslint-disable-next-line import/no-default-export
export default config;
