import type { Config } from 'jest';

const config: Config = {
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,ts}',
    '!src/sharedAppContext.ts',
    '!src/applicationContextForTests.ts',
    '!src/**/getScannerMockInterface.ts',
    '!src/business/test/**/*.ts',
    '!src/business/assetst*',
    '!src/proxies/**/*.ts',
    '!src/tools/**/*.ts',
    '!src/test/**/*.ts',
    '!src/**/*_.ts',
    '!src/persistence/sqs/deleteMessage.ts',
    '!src/persistence/sqs/getMessages.ts',
    '!src/persistence/dynamo/**/*.ts',
    '!src/business/utilities/documentGenerators/*.ts',
  ],
  coverageDirectory: './coverage',
  coverageProvider: 'babel',
  coverageThreshold: {
    global: {
      branches: 96.13,
      functions: 96.16,
      lines: 98.34,
      statements: 98.25,
    },
  },
  maxWorkers: '50%',
  testEnvironment: `${__dirname}/../web-client/JsdomWithTextEncoderEnvironment.js`,
  testPathIgnorePatterns: ['src/business/utilities/documentGenerators'],
  transform: {
    '\\.[jt]sx?$': ['babel-jest', { rootMode: 'upward' }],
  },
  verbose: false,
};

// eslint-disable-next-line import/no-default-export
export default config;
