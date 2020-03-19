module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    'bulkImportAttorneyUsers.js',
    'switch-environment-color.js',
    'migrations/*.js',
    'src/**/*.js',
    '!src/applicationContext.js',
    '!src/**/*Handlers.js',
    '!src/**/*Lambda.js',
    '!src/**/*.test.js',
  ],
  coverageDirectory: './coverage',
  coverageThreshold: {
    global: {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: 95,
    },
  },
  verbose: false,
};
