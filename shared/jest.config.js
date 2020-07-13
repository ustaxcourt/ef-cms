const baseConfig = require('../jest.config');

module.exports = {
  ...baseConfig,
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/sharedAppContext.js',
    '!src/applicationContextForTests.js',
    '!src/**/getScannerMockInterface.js',
    '!src/business/test/**/*.js',
    '!src/business/assets/*',
    '!src/proxies/**/*.js',
    '!src/tools/**/*.js',
    '!src/test/**/*.js',
    '!src/**/*_.js',
  ],
  verbose: false,
};
