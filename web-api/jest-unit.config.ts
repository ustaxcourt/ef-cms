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
    '!src/applicationContext.{js,ts}',
    '!src/gateways/worker/workerLocal.ts',
    '!src/getPersistenceGateway.{js,ts}',
    '!src/getUseCases.{js,ts}',
    '!src/getUseCaseHelpers.{js,ts}',
    '!src/getUserGateway.ts',
    '!src/**/*Handlers.{js,ts}',
    '!src/**/*Lambda.{js,ts}',
    '!src/app.{js,ts}',
    '!src/app-public.{js,ts}',
    '!src/app-local.{js,ts}',
    '!src/app-public-local.{js,ts}',
    '!src/getDocumentGenerators.ts',
    '!src/persistence/cognito/getCognito.ts',
    '!src/persistence/s3/zipDocuments.ts',
    '!src/persistence/sqs/deleteMessage.ts',
    '!src/persistence/sqs/getMessages.ts',
    '!src/persistence/messages/*.ts',
    '!src/persistence/dynamo/**/*.ts',
    '!src/persistence/postgres/**/*.ts',
    '!src/lambdas/websockets/websockets.ts',
    '!src/lambdas/websockets/switch-colors-cron.ts',
    '!src/lambdas/cognitoAuthorizer/worker-handler.ts',
    '!src/lambdas/api/api.ts',
    '!src/lambdas/api-public/api-public.ts',
    '!src/lambdas/migration/utilities/getRecordSize.ts',
  ],
  coverageDirectory: './coverage',
  coverageProvider: 'babel',
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
  moduleNameMapper: {
    ...pathsToModuleNameMapper(tsconfig.compilerOptions.paths, {
      prefix: '<rootDir>/../',
    }),
    uuid: require.resolve('uuid'),
  },
  testEnvironment: 'node',
  testPathIgnorePatterns: ['hostedEnvironmentTests'],
  transform: {
    '\\.[jt]sx?$': ['babel-jest', { rootMode: 'upward' }],
  },
  verbose: false,
};
// eslint-disable-next-line import/no-default-export
export default config;
