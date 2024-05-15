import { pathsToModuleNameMapper } from 'ts-jest';
import tsconfig from '../../tsconfig.json';
import type { Config } from 'jest';

const config: Config = {
  clearMocks: true,
  collectCoverage: false,
  moduleNameMapper: pathsToModuleNameMapper(tsconfig.compilerOptions.paths, {
    prefix: '<rootDir>/../../',
  }),
  testEnvironment: 'node',
  testMatch: [
    '**/web-api/hostedEnvironmentTests/**/?(*.)+(spec|test).[jt]s?(x)',
  ],
  testTimeout: 30000,
  transform: {
    '\\.[jt]sx?$': ['babel-jest', { rootMode: 'upward' }],
  },
  verbose: false,
};

// eslint-disable-next-line import/no-default-export
export default config;
