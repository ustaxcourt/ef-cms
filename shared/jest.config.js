module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/sharedAppContext.js',
    '!src/**/ContactFactory.js',
    '!src/**/getScannerMockInterface.js',
    '!src/business/test/**/*.js',
    '!src/business/assets/*',
    '!src/proxies/**/*.js',
    '!src/tools/**/*.js',
    '!src/test/**/*.js',
    '!src/**/*_.js',
  ],
  coverageDirectory: './coverage',
  coverageThreshold: {
    global: {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: 95,
    },
  },
  verbose: false,
};
