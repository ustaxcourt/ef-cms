import { pathsToModuleNameMapper } from 'ts-jest';
import type { Config } from 'jest';
import { loadTsConfigPaths } from '../../utils/load-tsconfig-paths.mjs';

const tsConfigPaths = loadTsConfigPaths();

const config: Config = {
  clearMocks: true,
  moduleNameMapper: pathsToModuleNameMapper(tsConfigPaths, {
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
};

export default config;
