module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    '!src/**/ContactFactory.js',
    '!src/**/getScannerMockInterface.js',
    '!src/business/test/**/*.js',
    '!src/proxies/**/*.js',
    '!src/tools/**/*.js',
    'src/**/*.js',
  ],
  coverageDirectory: './coverage',
  coverageThreshold: {
    global: {
      branches: 94,
      functions: 95,
      lines: 95,
      statements: 95,
    },
  },
  verbose: true,
};
