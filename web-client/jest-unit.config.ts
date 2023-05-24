import type { Config } from 'jest';
const testFilesEnv = process.env.TESTFILES;
const testFiles = testFilesEnv?.split(' ') || [];
console.log('testFiles in config', testFiles);

const config: Config = {
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: [
    ...testFiles,
    '!integration-tests/**/*.js',
    '!integration-tests-public/**/*.js',
    '!src/applicationContext.ts',
    '!src/applicationContextPublic.ts',
    '!src/router.ts',
    '!src/index.ts',
    '!src/routerPublic.ts',
    '!src/index-public.ts',
    '!src/index-public.prod.ts',
  ],
  coverageDirectory: './coverage-unit',
  coverageProvider: 'babel',
  coverageThreshold: {
    global: {
      branches: 94.56,
      functions: 98.81,
      lines: 99.25,
      statements: 99.23,
    },
  },
  globals: {
    File() {},
    FileReader() {},
    atob: x => x,
    presenter: { providers: { applicationContext: {} } },
  },
  testEnvironment: 'jsdom',
  // testMatch: ['**/web-client/src/**/?(*.)+(spec|test).[jt]s?(x)'],
  // testSequencer: `${__dirname}/../jestSequencer.js`,
  transform: {
    '\\.[jt]sx?$': ['babel-jest', { rootMode: 'upward' }],
    '^.+\\.html?$': `${__dirname}/htmlLoader.js`, //this is to ignore imported html files
  },
  verbose: false,
};

// eslint-disable-next-line import/no-default-export
export default config;
