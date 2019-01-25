module.exports = {
  testEnvironment: 'node',
  collectCoverage: true,
  coverageDirectory: './coverage-unit',
  coverageThreshold: {
    global: {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: 95,
    },
  },
  collectCoverageFrom: ['src/**/*.js', '!e2e/**/*.js', '!src/**/*.test.js'],
};
