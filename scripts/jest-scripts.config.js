const baseConfig = require('../jest.config');
module.exports = {
  ...baseConfig,
  collectCoverage: true,
  collectCoverageFrom: [
    '**/*.{js,ts}',
    '!jest-scripts.config.js',
    '!coverage/**',
    '!set-maintenance-mode-locally.js',
    '!data-import/judge/bulkImportJudgeUsers.js',
    '!irs-super-user.js',
  ],
  coverageThreshold: {
    global: {
      branches: 97,
      functions: 99,
      lines: 99,
      statements: 99,
    },
  },
  testEnvironment: 'node',
  verbose: false,
};
