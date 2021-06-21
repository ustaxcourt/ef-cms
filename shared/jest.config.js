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
