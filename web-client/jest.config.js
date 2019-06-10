module.exports = {
  collectCoverage: true,
  coverageDirectory: './coverage',
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 95,
      lines: 95,
      statements: 95,
    },
  },
  globals: {
    window: true,
  },
  testEnvironment: 'node',
  // TODO: remove 'e2e/**/*.js' - this is including e2e tests in our global coverage %
  // TODO: add in '!src/**/*.test.js' - this is including unit tests in our global coverage %
  // collectCoverageFrom: ['src/presenter/**/*.js', '!src/**/*.test.js'],
};
