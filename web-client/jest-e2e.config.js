module.exports = {
  testEnvironment: 'node',
  collectCoverage: true,
  coverageDirectory: './coverage-e2e',
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },
  collectCoverageFrom: [
    'src/presenter/**/*.js',
    '!e2e/**/*.js',
    '!src/**/*.test.js',
  ],
};
