import type { Config } from 'jest';

const config: Config = {
  clearMocks: true,
  collectCoverage: false,
  maxWorkers: 1, // because generating pdf is a heavy test, we are locking this to 1 to reduce load on the ci/cd runners
  moduleNameMapper: {
    '^uuid$': require.resolve('uuid'),
  },
  testEnvironment: `${__dirname}/../../../../../web-client/JsdomWithTextEncoderEnvironment.js`,
  testMatch: [
    '**/shared/src/business/utilities/documentGenerators/(*.)+(spec|test).[jt]s',
  ],
  testTimeout: 30000,
  transform: {
    '\\.[jt]sx?$': ['babel-jest', { rootMode: 'upward' }],
    // '^.+\\.html?$': `${__dirname}/web-client/htmlLoader.js`, //this is to ignore imported html files
  },
  transformIgnorePatterns: ['/node_modules/(?!uuid)'],
  verbose: false,
};

// eslint-disable-next-line import/no-default-export
export default config;
