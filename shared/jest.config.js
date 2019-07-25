module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/tools/**/*.js',
    '!src/proxies/**/*.js',
    '!src/**/ContactFactory.js',
    '!src/**/getScannerMockInterface.js',
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
