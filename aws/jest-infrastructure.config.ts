import { pathsToModuleNameMapper } from 'ts-jest';
import type { Config } from 'jest';
import { loadTsConfigPaths } from '../utils/load-tsconfig-paths.mjs';

const tsConfigPaths = loadTsConfigPaths('tsconfig.json');

const transformIgnoreModules = ['kysely', 'uuid'];

const config: Config = {
  displayName: 'infrastructure',
  clearMocks: true,
  collectCoverageFrom: [
    'lambdas/**/*.js',
    'lambdas/**/*.ts',
    '!lambdas/**/test/**',
  ],
  moduleNameMapper: {
    ...pathsToModuleNameMapper(tsConfigPaths, {
      prefix: '<rootDir>/../',
    }),
    '^uuid$': 'uuid',
  },
  testEnvironment: 'node',
  testMatch: ['<rootDir>/lambdas/**/?(*.)+(spec|test).[jt]s?(x)'],
  transform: {
    '\\.[jt]sx?$': ['babel-jest', { rootMode: 'upward' }],
  },
  transformIgnorePatterns: [
    `/node_modules/(?!(${transformIgnoreModules.join('|')})/)`,
  ],
};

export default config;
