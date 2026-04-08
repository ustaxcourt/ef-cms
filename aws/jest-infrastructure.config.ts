import { pathsToModuleNameMapper } from 'ts-jest';
import type { Config } from 'jest';
import { loadTsConfigPaths } from '../utils/load-tsconfig-paths.mjs';

const tsconfigPaths = loadTsConfigPaths('tsconfig.json');

const config: Config = {
  displayName: 'infrastructure',
  clearMocks: true,
  collectCoverageFrom: [
    'lambdas/**/*.js',
    'lambdas/**/*.ts',
    '!lambdas/**/test/**',
  ],
  moduleNameMapper: {
    ...pathsToModuleNameMapper(tsconfigPaths, {
      prefix: '<rootDir>/../',
    }),
    '^uuid$': 'uuid',
  },
  testEnvironment: 'node',
  testMatch: ['<rootDir>/lambdas/**/?(*.)+(spec|test).[jt]s?(x)'],
  transform: {
    '\\.[jt]sx?$': ['babel-jest', { rootMode: 'upward' }],
  },
  transformIgnorePatterns: ['/node_modules/(?!uuid)'],
};

export default config;
