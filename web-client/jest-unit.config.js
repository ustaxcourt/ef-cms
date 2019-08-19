module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.js', '!e2e/**/*.js', '!src/**/*.test.js'],
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
  //this is to ignore imported html files
  testEnvironment: 'node',
  transform: {
    '^.+\\.html?$': './htmlLoader.js',
    '^.+\\.js$': 'babel-jest',
    '^.+\\.jsx$': 'babel-jest',
  },
};
