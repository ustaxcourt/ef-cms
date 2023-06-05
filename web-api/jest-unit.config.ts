import type { Config } from 'jest';

const config: Config = {
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: [
    'switch-environment-color.{js,ts}',
    'src/**/*.{js,ts}',
    'workflow-terraform/migration/main/lambdas/migrations/*.{js,ts}',
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
  coverageDirectory: './coverage',
  coverageProvider: 'babel',
  coverageThreshold: {
    global: {
      branches: 97,
      functions: 99,
      lines: 99,
      statements: 99,
    },
  },
  testEnvironment: 'node',
  transform: {
    '\\.[jt]sx?$': ['babel-jest', { rootMode: 'upward' }],
  },
  verbose: false,
  workerIdleMemoryLimit: '20%',
};
// eslint-disable-next-line import/no-default-export
export default config;
