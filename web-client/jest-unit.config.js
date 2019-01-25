module.exports = {
  testEnvironment: 'node',
  collectCoverage: true,
  coverageDirectory: './coverage-unit',
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 40,
      lines: 50,
      statements: 50,
    },
  },
  collectCoverageFrom: ['src/**/*.js', '!e2e/**/*.js', '!src/**/*.test.js'],
};
