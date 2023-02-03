const baseConfig = require('../../../../../jest-browser.config');

module.exports = {
  ...baseConfig,
  collectCoverage: false,
  maxWorkers: 1, // because generating pdf is a heavy test, we are locking this to 1 to reduce load on the ci/cd runners
  testMatch: [
    '**/shared/src/business/utilities/documentGenerators/(*.)+(spec|test).[jt]s',
  ],
  testTimeout: 30000,
  verbose: false,
};

// testMatch: ['**/web-client/src/**/?(*.)+(spec|test).[jt]s?(x)']
