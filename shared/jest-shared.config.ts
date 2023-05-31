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
  coverageReporters: ['json', 'lcov'],
  maxWorkers: '50%',
  moduleFileExtensions: ['js', 'ts', 'tsx', 'jsx'],
  testEnvironment: `${__dirname}/../web-client/JsdomWithTextEncoderEnvironment.js`,
  testPathIgnorePatterns: ['src/business/utilities/documentGenerators'],
  transform: {
    '\\.[jt]sx?$': ['babel-jest', { rootMode: 'upward' }],
  },
  // After a jest runner uses X% of total system memory, recreate the runner.
  verbose: false,
  workerIdleMemoryLimit: '20%',
};

// eslint-disable-next-line import/no-default-export
export default config;
