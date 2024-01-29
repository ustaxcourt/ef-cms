import { pathsToModuleNameMapper } from 'ts-jest';
import tsconfig from '../tsconfig.json';
import type { Config } from 'jest';

const config: Config = {
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,ts}',
    '!src/sharedAppContext.ts',
    '!src/applicationContextForTests.ts',
    '!src/business/test/**/*.ts',
    '!src/business/assets/*.ts',
    '!src/proxies/**/*.ts',
    '!src/tools/**/*.ts',
    '!src/test/**/*.ts',
    '!src/**/*_.ts',
    '!src/business/utilities/documentGenerators/**/*.ts',
    '!src/business/utilities/generateHTMLTemplateForPDF/generateHTMLTemplateForPDF.ts',
  ],
  coverageDirectory: './coverage',
  coverageProvider: 'babel',
  coverageReporters: ['json', 'lcov'],
  maxWorkers: '50%',
  moduleFileExtensions: ['js', 'ts', 'tsx', 'jsx'],
  moduleNameMapper: {
    ...pathsToModuleNameMapper(tsconfig.compilerOptions.paths, {
      prefix: '<rootDir>/../',
    }),
    uuid: require.resolve('uuid'),
  },
  setupFiles: ['core-js'],
  testEnvironment: `${__dirname}/../web-client/JsdomWithTextEncoderEnvironment.js`,
  testPathIgnorePatterns: ['src/business/utilities/documentGenerators'],
  transform: {
    '\\.[jt]sx?$': ['babel-jest', { rootMode: 'upward' }],
  },
  transformIgnorePatterns: ['/node_modules/(?!uuid)'],
  // After a jest runner uses X% of total system memory, recreate the runner.
  verbose: false,
  workerIdleMemoryLimit: '20%',
};

// eslint-disable-next-line import/no-default-export
export default config;
