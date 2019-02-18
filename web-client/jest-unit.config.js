module.exports = {
  testEnvironment: 'node',
  collectCoverage: true,
  coverageDirectory: './coverage-unit',
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 40,
      lines: 45,
      statements: 45,
    },
  },
  globals: {
    window: true,
  },
  collectCoverageFrom: ['src/**/*.js', '!e2e/**/*.js', '!src/**/*.test.js'],
};
