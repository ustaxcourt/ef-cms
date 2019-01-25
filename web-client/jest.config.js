module.exports = {
  testEnvironment: 'node',
  collectCoverage: true,
  coverageDirectory: './coverage',
  coverageThreshold: {
    global: {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: 95,
    },
  },
  // TODO: remove 'e2e/**/*.js' - this is including e2e tests in our global coverage %
  // TODO: add in '!src/**/*.test.js' - this is including unit tests in our global coverage %
  // collectCoverageFrom: ['src/**/*.js', 'e2e/**/*.js'],
};
