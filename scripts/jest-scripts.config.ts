import { pathsToModuleNameMapper } from 'ts-jest';
import type { Config } from 'jest';
import { loadTsConfig } from '../utils/load-tsconfig.mjs';

const tsconfig = loadTsConfig('tsconfig.json');

const config: Config = {
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: [
    '**/*.{js,ts}',
    '!archived/**',
    '!checkAllFilesForTypeErrorCount.ts',
    '!circleci/*.ts',
    '!circleci/judge/bulkImportJudgeUsers.helpers.ts',
    '!circleci/judge/bulkImportJudgeUsers.ts',
    '!cloudwatch/perform-query.ts',
    '!compareTypescriptErrors.ts',
    '!coverage/**',
    '!download-all-case-documents.ts',
    '!ecr/**',
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
    '!helpers/prompts.ts',
    '!helpers/runCommand.ts',
    '!import-case-status-changes-from-csv.ts',
    '!irs-super-user.ts',
    '!jest-scripts.config.ts',
    '!judge/update-judge-isSeniorJudge.ts',
    '!judge/update-judge-titles.ts',
    '!migration/is-migration-needed.ts',
    '!migration/migrationFilesHelper.ts',
    '!migration/read-segment.ts',
    '!migration/set-local-migration-complete-marker.ts',
    '!migration/track-successful-migrations.ts',
    '!npm/upgrade-npm-packages.ts',
    '!postgres/**',
    '!reindex/**',
    '!reports/**',
    '!run-once-scripts/**',
    '!secrets/**',
    '!seed/add-missing-seed-docket-entries-pdfs.js',
    '!send-maintenance-mode-notifications-locally.ts',
    '!template.ts',
    '!judge/get-judge-name.ts',
    '!judge/set-judge-title.ts',
    '!upload-practitioner-application-packages.ts',
    '!user/**',
  ],
  coverageDirectory: './coverage',
  coverageProvider: 'babel',
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
    ...pathsToModuleNameMapper(tsconfig.compilerOptions.paths, {
      prefix: '<rootDir>/../',
    }),
    '^uuid$': 'uuid',
  },
  testEnvironment: 'node',
  testMatch: ['**/scripts/**/?(*.)+(spec|test).[jt]s?(x)'],
  transform: {
    '\\.[jt]sx?$': ['babel-jest', { rootMode: 'upward' }],
  },
  transformIgnorePatterns: ['/node_modules/(?!uuid)'],
  verbose: false,
};

export default config;
