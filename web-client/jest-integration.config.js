module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    'src/presenter/**/*.js',
    '!integration/**/*.js',
    '!src/**/*.test.js',
  ],
  coverageDirectory: './coverage-integration',
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },
  testEnvironment: 'node',
  //this is to ignore imported html files
  transform: {
    '^.+\\.html$': './htmlLoader.js',
    '^.+\\.js$': 'babel-jest',
    '^.+\\.jsx$': 'babel-jest',
  },
};
