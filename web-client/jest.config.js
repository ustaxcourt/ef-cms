module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.js',
    '!integration-tests/**/*.js',
    '!integration-tests-public/**/*.js',
    '!src/applicationContext.js',
    '!src/router.js',
    '!src/index.dev.js',
    '!src/index.prod.js',
  ],
  coverageDirectory: './coverage',
  coverageThreshold: {
    global: {
      branches: 93,
      functions: 95,
      lines: 95,
      statements: 95,
    },
  },
  globals: {
    window: { document: {} },
  },
  testEnvironment: 'node',
  // this is to ignore imported html files
  transform: {
    '^.+\\.html?$': './htmlLoader.js',
    '^.+\\.js$': 'babel-jest',
    '^.+\\.jsx$': 'babel-jest',
  },
  verbose: true,
};
