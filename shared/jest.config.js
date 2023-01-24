const baseConfig = require('../jest-browser.config');

module.exports = {
  ...baseConfig,
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,ts}',
    '!src/sharedAppContext.js',
    '!src/applicationContextForTests.js',
    '!src/**/getScannerMockInterface.js',
    '!src/business/test/**/*.js',
    '!src/business/assets/*',
    '!src/proxies/**/*.js',
    '!src/tools/**/*.js',
    '!src/test/**/*.js',
    '!src/**/*_.js',
    '!src/persistence/sqs/deleteMessage.js',
    '!src/persistence/sqs/getMessages.js',
    '!src/persistence/dynamo/**/*.js',
  ],
  coverageThreshold: {
    global: {
      branches: 96.13,
      functions: 96.16,
      lines: 98.34,
      statements: 98.25,
    },
  },
  verbose: false,
};
