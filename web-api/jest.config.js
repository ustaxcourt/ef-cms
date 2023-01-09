const baseConfig = require('../jest.config');
module.exports = {
  ...baseConfig,
  collectCoverage: true,
  collectCoverageFrom: [
    'switch-environment-color.{js,ts}',
    'src/**/*.{js,ts}',
    'migration-terraform/main/lambdas/migrations/*.{js,ts}',
    '!src/applicationContext.{js,ts}',
    '!src/getUseCases.{js,ts}',
    '!src/getUseCaseHelpers.{js,ts}',
    '!src/getPersistenceGateway.{js,ts}',
    '!src/**/*Handlers.{js,ts}',
    '!src/**/*Lambda.{js,ts}',
    '!src/app.{js,ts}',
    '!src/app-public.{js,ts}',
    '!src/app-local.{js,ts}',
    '!src/app-public-local.{js,ts}',
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
