import { pathsToModuleNameMapper } from 'ts-jest';
import type { Config } from 'jest';
import { loadTsConfigPaths } from '../utils/load-tsconfig-paths.mjs';

const tsConfigPaths = loadTsConfigPaths('tsconfig.json');

const config: Config = {
  displayName: 'scripts',
  clearMocks: true,
  collectCoverageFrom: [
    '**/*.{js,ts}',
    '!archived/**',
    '!checkAllFilesForTypeErrorCount.ts',
    '!circleci/*.ts',
    '!circleci/judge/bulkImportJudgeUsers.helpers.ts',
    '!circleci/judge/bulkImportJudgeUsers.ts',
    '!compareTypescriptErrors.ts',
    '!coverage/**',
    '!download-all-case-documents.ts',
    '!ecr/pull-and-tag.ts',
    '!elasticsearch/create-temporary-indices.ts',
    '!elasticsearch/docket-entry-search.ts',
    '!elasticsearch/docket-inbox.ts',
    '!elasticsearch/get-users.ts',
    '!elasticsearch/health-migration.ts',
    '!elasticsearch/ready-cluster-for-migration.ts',
    '!elasticsearch/reindex.ts',
    '!elasticsearch/retry-ocr-failures.ts',
    '!email/**',
    '!generate-uuid.ts',
    '!github-actions/download-historical-test-file-times.ts',
    '!github-actions/split-tests.ts',
    '!github-actions/split-tests-cypress.ts',
    '!github-actions/split-tests-glob.ts',
    '!github-actions/test-file-times.ts',
    '!import-case-status-changes-from-csv.ts',
    '!irs-super-user.ts',
    '!jest-scripts.config.ts',
    '!judge/get-judge-name.ts',
    '!judge/set-judge-title.ts',
    '!judge/update-judge-isSeniorJudge.ts',
    '!judge/update-judge-titles.ts',
    '!maintenance/**',
    '!npm/upgrade-npm-packages.ts',
    '!persistence/truncate-all-persistence.ts',
    '!postgres/**',
    '!reindex/**',
    '!reports/**',
    '!run-once-scripts/**',
    '!secrets/**',
    '!seed/add-missing-seed-docket-entries-pdfs.js',
    '!template.ts',
    '!tests/run-cypress.ts',
    '!upload-practitioner-application-packages.ts',
    '!user/!(rotate-environment-secrets.helpers.ts|make-new-password.ts)',
  ],
  coverageDirectory: './coverage',
  coverageThreshold: {
    global: {
      branches: 97,
      functions: 99,
      lines: 99,
      statements: 99,
    },
  },
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  moduleNameMapper: {
    ...pathsToModuleNameMapper(tsConfigPaths, {
      prefix: '<rootDir>/../',
    }),
    '^scripts/(.*)$': '<rootDir>/$1',
    '^uuid$': 'uuid',
  },
  testEnvironment: 'node',
  testMatch: ['<rootDir>/**/?(*.)+(spec|test).[jt]s?(x)'],
  transform: {
    '\\.[jt]sx?$': ['babel-jest', { rootMode: 'upward' }],
  },
  transformIgnorePatterns: ['/node_modules/(?!uuid)'],
};

export default config;
