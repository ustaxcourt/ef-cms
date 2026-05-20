import { pathsToModuleNameMapper } from 'ts-jest';
import type { Config } from 'jest';
import { loadTsConfigPaths } from '../utils/load-tsconfig-paths.mjs';
import path from 'node:path';

const tsConfigPaths = loadTsConfigPaths('tsconfig.json');

const config: Config = {
  displayName: 'web-client-unit',
  clearMocks: true,
  collectCoverageFrom: [
    'src/**/*.{js,ts}',
    '!src/proxies/**/*.ts',
    '!integration-tests/**/*.js',
    '!integration-tests-public/**/*.js',
    '!src/applicationContext.ts',
    '!src/applicationContextPublic.ts',
    '!src/router.ts',
    '!src/index.ts',
    '!src/routerPublic.ts',
    '!src/index-public.ts',
    '!src/index-public.prod.ts',
    '!src/**/getScannerMockInterface.ts',
    '!src/**/localStorage/',
    '!src/**/shared.cerebral.ts',
    '!src/ustc-ui/Utils/types.ts',
    '!src/persistence/localStorage/*.ts',
    '!src/test/createClientTestApplicationContext.ts',
  ],
  coverageDirectory: './coverage-unit',
  coverageReporters: ['json', 'lcov'],
  globals: {
    FileReader() {},
    atob: x => x,
    presenter: { providers: { applicationContext: {} } },
  },
  maxWorkers: '50%',

  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  moduleNameMapper: {
    ...pathsToModuleNameMapper(tsConfigPaths, {
      prefix: '<rootDir>/../',
    }),
    '^uuid$': 'uuid',
  },
  setupFiles: ['core-js'],
  testEnvironment: path.resolve(
    process.cwd(),
    'web-client/JsdomWithTextEncoderEnvironment.ts',
  ),
  testMatch: ['<rootDir>/src/**/?(*.)+(spec|test).[jt]s?(x)'],
  transform: {
    '\\.[jt]sx?$': ['babel-jest', { rootMode: 'upward' }],
    '^.+\\.html?$': path.resolve(process.cwd(), 'web-client/htmlLoader.js'), //this is to ignore imported html files
  },
  transformIgnorePatterns: [
    '/node_modules/(?!uuid|sinon|aws-sdk-client-mock|export-to-csv|htmlparser2|dom-serializer|domhandler|domelementtype|domutils|entities)',
  ],
  setupFilesAfterEnv: [
    '<rootDir>../web-api/src/persistence/postgres/featureFlag/mocks.jest.ts',
  ],
  workerIdleMemoryLimit: '20%',
};

export default config;
