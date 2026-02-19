import { pathsToModuleNameMapper } from 'ts-jest';
import type { Config } from 'jest';
import { loadTsConfig } from '../utils/load-tsconfig.mjs';

const tsconfig = loadTsConfig('tsconfig.json');

const config: Config = {
  displayName: 'infrastructure',
  clearMocks: true,
  collectCoverageFrom: [
    'lambdas/**/*.js',
    'lambdas/**/*.ts',
    '!lambdas/**/test/**',
  ],
  moduleNameMapper: {
    ...pathsToModuleNameMapper(tsconfig.compilerOptions.paths, {
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
