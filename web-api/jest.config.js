const baseConfig = require('../jest.config');
module.exports = {
  ...baseConfig,
  collectCoverage: true,
  collectCoverageFrom: [
    'bulkImportPractitionerUsers.js',
    'switch-environment-color.js',
    'src/**/*.js',
    'migration-terraform/main/lambdas/migrations/*.js',
    '!src/applicationContext.js',
    '!src/**/*Handlers.js',
    '!src/**/*Lambda.js',
    '!src/**/*.test.js',
    '!src/app.js',
    '!src/app-public.js',
    '!src/app-local.js',
    '!src/app-public-local.js',
  ],
  verbose: false,
};
