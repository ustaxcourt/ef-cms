import { pathsToModuleNameMapper } from 'ts-jest';
import type { Config } from 'jest';
import { loadTsConfig } from '../utils/load-tsconfig.mjs';

const tsconfig = loadTsConfig('tsconfig.json');

const config: Config = {
  clearMocks: true,
  collectCoverage: false,
  globals: {
    File() {},
    FileReader: () => {},
    atob: x => x,
  },
  maxWorkers: 1, // because running integration tests are heavy and can interfere with one another, we are locking this to 1 worker
  // testMatch: [
  //   '**/web-client/integration-tests/**/?(*.)+(spec|test).[jt]s?(x)',
  //   '**/web-client/integration-tests-public/**/?(*.)+(spec|test).[jt]s?(x)',
  // ], // Uncomment testMatch to run all integration tests in integration-tests + integration-tests-public
  moduleNameMapper: {
    ...pathsToModuleNameMapper(tsconfig.compilerOptions.paths, {
      prefix: '<rootDir>/../',
    }),
    '^broadcast-channel$': '<rootDir>/jest.mock-broadcast-channel.ts',
  },
  testEnvironment: 'node',
  testTimeout: 30000,
  transform: {
    '\\.[jt]sx?$': ['babel-jest', { rootMode: 'upward' }],
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(export-to-csv|@faker-js/faker|uuid)/)',
  ],
  verbose: false,
  workerIdleMemoryLimit: '10%', // After a jest runner uses X% of total system memory, recreate the runner.
};

export default config;
