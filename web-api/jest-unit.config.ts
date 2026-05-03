import { pathsToModuleNameMapper } from 'ts-jest';
import type { Config } from 'jest';
import { loadTsConfigPaths } from '../utils/load-tsconfig-paths.mjs';

const tsConfigPaths = loadTsConfigPaths('tsconfig.json');

const config: Config = {
  displayName: 'web-api',
  clearMocks: true,
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
    '!src/persistence/postgres/**/*.ts',
    '!src/lambdas/websockets/websockets.ts',
    '!src/lambdas/websockets/switch-colors-cron.ts',
    '!src/lambdas/cognitoAuthorizer/worker-handler.ts',
    '!src/lambdas/api/api.ts',
    '!src/lambdas/api-public/api-public.ts',
    '!src/lambdas/migration/utilities/getRecordSize.ts',
    '!src/persistence/elasticsearch/searchClient/getSearchClient.ts',
    '!src/**/mocks.jest.ts',
    '!src/persistence/s3/getStorageClient.ts',
    '!src/persistence/batch/getBatchClient.ts',
    '!src/notifications/getNotificationService.ts',
    '!src/lambdas/**/*',
    '!src/gateways/openSearch/openSearchGateway.ts',
    '!src/gateways/message/getMessagingClient.ts',
    '!src/gateways/lambda/getLambdaClient.ts',
  ],
  coverageDirectory: './coverage',
  testMatch: [
    '<rootDir>/elasticsearch/**/?(*.)+(spec|test).[jt]s?(x)',
    '<rootDir>/src/**/?(*.)+(spec|test).[jt]s?(x)',
  ],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
  moduleNameMapper: {
    ...pathsToModuleNameMapper(tsConfigPaths, {
      prefix: '<rootDir>/../',
    }),
    '^uuid$': 'uuid',
  },
  testEnvironment: 'node',
  testPathIgnorePatterns: ['hostedEnvironmentTests'],
  transform: {
    '\\.[jt]sx?$': ['babel-jest', { rootMode: 'upward' }],
  },
  transformIgnorePatterns: ['node_modules/(?!(uuid|p-queue|p-timeout)/)'],
  setupFilesAfterEnv: [
    '<rootDir>/src/persistence/postgres/featureFlag/mocks.jest.ts',
  ],
};
export default config;
