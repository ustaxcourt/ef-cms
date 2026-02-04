import { pathsToModuleNameMapper } from 'ts-jest';
import type { Config } from 'jest';
import { loadTsConfig } from './utils/load-tsconfig.mjs';
import path from 'node:path';

const tsconfig = loadTsConfig('tsconfig.json');

const config: Config = {
  projects: [
    '<rootDir>/aws/jest-infrastructure.config.ts',
    '<rootDir>/scripts/jest-scripts.config.ts',
    '<rootDir>/shared/jest-shared.config.ts',
    '<rootDir>/shared/src/business/utilities/documentGenerators/jest_document_generator.config.ts',
    '<rootDir>/web-api/hostedEnvironmentTests/jest-hosted-environment.ts',
    '<rootDir>/web-api/jest-unit.config.ts',
    '<rootDir>/web-client/jest-integration.config.ts',
    '<rootDir>/web-client/jest-unit.config.ts',
  ],
  clearMocks: true,
  collectCoverage: false,
  coverageDirectory: './coverage',
  coverageProvider: 'babel',
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  moduleNameMapper: {
    ...pathsToModuleNameMapper(tsconfig.compilerOptions.paths, {
      prefix: '<rootDir>',
    }),
    '^uuid$': 'uuid',
  },
  testEnvironment: 'jsdom',
  testSequencer: path.resolve(process.cwd(), 'jestSequencer.js'),
  transform: {
    '\\.[jt]sx?$': ['babel-jest', { rootMode: 'upward' }],
    '^.+\\.html?$': path.resolve(process.cwd(), 'web-client/htmlLoader.js'),
  },
  transformIgnorePatterns: [
    'node_modules/(?!(uuid|sinon|aws-sdk-client-mock)/)',
  ],
  verbose: false,
  setupFilesAfterEnv: [
    '<rootDir>/web-api/src/persistence/postgres/featureFlag/mocks.jest.ts',
  ],
};

export default config;
