import type { Config } from 'jest';

const config: Config = {
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,ts}',
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
  coverageReporters: ['json', 'lcov'],
  globals: {
    File() {},
    FileReader() {},
    atob: x => x,
    presenter: { providers: { applicationContext: {} } },
  },
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  testEnvironment: 'jsdom',
  transform: {
    '\\.[jt]sx?$': ['babel-jest', { rootMode: 'upward' }],
    '^.+\\.html?$': `${__dirname}/htmlLoader.js`, //this is to ignore imported html files
  },
  verbose: false,
};

// eslint-disable-next-line import/no-default-export
export default config;
