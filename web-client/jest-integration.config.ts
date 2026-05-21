import { pathsToModuleNameMapper } from 'ts-jest';
import type { Config } from 'jest';
import { loadTsConfigPaths } from '../utils/load-tsconfig-paths.mjs';

const tsConfigPaths = loadTsConfigPaths('tsconfig.json');

const config: Config = {
  displayName: 'web-client-integration',
  clearMocks: true,
  globals: {
    File() {},
    FileReader: () => {},
    atob: x => x,
  },
  maxWorkers: 1, // because running integration tests are heavy and can interfere with one another, we are locking this to 1 worker
  testMatch: [
    '<rootDir>/integration-tests/**/?(*.)+(spec|test).[jt]s?(x)',
    '<rootDir>/integration-tests-public/**/?(*.)+(spec|test).[jt]s?(x)',
  ],
  moduleNameMapper: {
    ...pathsToModuleNameMapper(tsConfigPaths, {
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
    '/node_modules/(?!(export-to-csv|@faker-js/faker|uuid|htmlparser2|dom-serializer|domhandler|domelementtype|domutils|entities|kysely)/)',
  ],
  workerIdleMemoryLimit: '10%', // After a jest runner uses X% of total system memory, recreate the runner.
};

export default config;
