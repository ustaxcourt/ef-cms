import type { Config } from 'jest';

// console.log('I AM JSWITH TS regex thing: ', JSON.stringify(jsWithTs));
// console.log('I AM JSWITHBABEL regex thing: ', JSON.stringify(jsWithBabel));

const config: Config = {
  clearMocks: true,
  collectCoverage: false,
  collectCoverageFrom: [
    'src/**/*.js',
    '!integration-tests/**/*.js',
    '!integration-tests-public/**/*.js',
    '!src/applicationContext.js',
    '!src/applicationContextPublic.js',
    '!src/router.js',
    '!src/routerPublic.js',
    '!src/index.dev.js',
    '!src/index.prod.js',
    '!src/index-public.dev.js',
    '!src/index-public.prod.js',
    '!src/views/Messages/sortConstants.js',
  ],
  coverageDirectory: './coverage-unit',
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
  // preset: 'ts-jest/presets/js-with-ts',
  testEnvironment: 'jsdom',
  testMatch: ['**/web-client/src/**/?(*.)+(spec|test).[jt]s?(x)'],
  // testRegex: 'web-client/src/.*\\.test\\.tsx',
  testSequencer: `${__dirname}/../jestSequencer.js`,
  transform: {
    '\\.[jt]sx?$': ['babel-jest', { rootMode: 'upward' }],
    '^.+\\.html?$': `${__dirname}/htmlLoader.js`, //this is to ignore imported html files
  },
  // transform: {
  //   '^.+\\.[tj]sx?$': [
  //     'ts-jest',
  //     {
  //       diagnostics: false,
  //       tsconfig: 'web-client/tsconfig.json',
  //     },
  //   ],
  // },
  verbose: false,
};

// eslint-disable-next-line import/no-default-export
export default config;
