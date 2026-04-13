import { pathsToModuleNameMapper } from 'ts-jest';
import type { Config } from 'jest';
import { loadTsConfigPaths } from '../../../../../utils/load-tsconfig-paths.mjs';

const tsConfigPaths = loadTsConfigPaths('tsconfig.json');

const config: Config = {
  clearMocks: true,
  maxWorkers: 1, // because generating pdf is a heavy test, we are locking this to 1 to reduce load on the ci/cd runners
  moduleNameMapper: {
    ...pathsToModuleNameMapper(tsConfigPaths, {
      prefix: '<rootDir>/../../../../../',
    }),
    '^uuid$': 'uuid',
  },
  testMatch: [
    '**/shared/src/business/utilities/documentGenerators/(*.)+(spec|test).[jt]s',
  ],
  testTimeout: 30000,
  transform: {
    '\\.[jt]sx?$': ['babel-jest', { rootMode: 'upward' }],
    // '^.+\\.html?$': `${__dirname}/web-client/htmlLoader.js`, //this is to ignore imported html files
  },
  transformIgnorePatterns: ['/node_modules/(?!uuid|pixelmatch)'],
  workerIdleMemoryLimit: '5%', // After a jest runner uses X% of total system memory, recreate the runner.
};

export default config;
