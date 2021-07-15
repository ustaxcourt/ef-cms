const baseConfig = require('../jest.config');
module.exports = {
  ...baseConfig,
  collectCoverage: true,
  collectCoverageFrom: [
    'switch-environment-color.js',
    'src/**/*.js',
    'migration-terraform/main/lambdas/migrations/*.js',
    '!src/applicationContext.js',
    '!src/**/*Handlers.js',
    '!src/**/*Lambda.js',
    '!src/app.js',
    '!src/app-public.js',
    '!src/app-local.js',
    '!src/app-public-local.js',
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
