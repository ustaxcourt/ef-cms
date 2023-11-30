import { pathsToModuleNameMapper } from 'ts-jest';
import tsconfig from '../tsconfig.json';
import type { Config } from 'jest';

const config: Config = {
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: [
    'switch-environment-color.{js,ts}',
    'elasticsearch/*.test.{js,ts}',
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
    '!src/getDocumentGenerators.ts',
    '!src/persistence/sqs/deleteMessage.ts',
    '!src/persistence/sqs/getMessages.ts',
    '!src/persistence/messages/*.ts',
    '!src/persistence/dynamo/**/*.ts',
    '!src/getDynamoEndpoints.ts',
  ],
  coverageDirectory: './coverage',
  coverageProvider: 'babel',
  coverageThreshold: {
    global: {
      branches: 96,
      functions: 96,
      lines: 99,
      statements: 99,
    },
  },
  moduleNameMapper: {
    ...pathsToModuleNameMapper(tsconfig.compilerOptions.paths, {
      prefix: '<rootDir>/../',
    }),
    uuid: require.resolve('uuid'),
  },
  testEnvironment: 'node',
  transform: {
    '\\.[jt]sx?$': ['babel-jest', { rootMode: 'upward' }],
  },
  verbose: false,
};
// eslint-disable-next-line import/no-default-export
export default config;
