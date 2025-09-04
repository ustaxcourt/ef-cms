import { pathsToModuleNameMapper } from 'ts-jest';
import tsconfig from './tsconfig.json';
import type { Config } from 'jest';

const config: Config = {
  clearMocks: true,
  collectCoverage: false,
  coverageDirectory: './coverage',
  coverageProvider: 'babel',
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  moduleNameMapper: {
    ...pathsToModuleNameMapper(tsconfig.compilerOptions.paths, {
      prefix: '<rootDir>',
    }),
    uuid: require.resolve('uuid'), // https://github.com/microsoft/accessibility-insights-web/pull/5421
  },
  testEnvironment: 'jsdom',
  testSequencer: `${__dirname}/jestSequencer.js`,
  transform: {
    '\\.[jt]sx?$': ['babel-jest', { rootMode: 'upward' }],
    '^.+\\.html?$': `${__dirname}/web-client/htmlLoader.js`,
  },
  transformIgnorePatterns: [
    'node_modules/(?!(uuid|sinon|aws-sdk-client-mock)/)',
  ],
  verbose: false,
  setupFilesAfterEnv: [
    '<rootDir>/web-api/src/persistence/postgres/featureFlag/mocks.jest.ts',
  ],
};

export default config;
