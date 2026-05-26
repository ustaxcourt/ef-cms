import { pathsToModuleNameMapper } from 'ts-jest';
import type { Config } from 'jest';
import { loadTsConfigPaths } from '../utils/load-tsconfig-paths.mjs';
import path from 'node:path';

const tsConfigPaths = loadTsConfigPaths('tsconfig.json');

const config: Config = {
  displayName: 'shared',
  clearMocks: true,
  // type files ignored
  collectCoverageFrom: [
    'src/**/*.{js,ts}',
    '!src/sharedAppContext.ts',
    '!src/applicationContextForTests.ts',
    '!src/business/test/**/*.ts',
    '!src/business/assets/*.ts',
    '!src/tools/**/*.ts',
    '!src/test/**/*.ts',
    '!src/**/*_.ts',
    '!src/business/utilities/documentGenerators/**/*.ts',
    '!src/business/utilities/chromium/**',
    '!src/business/utilities/generateHTMLTemplateForPDF/generateHTMLTemplateForPDF.ts',
    '!src/business/utilities/htmlGenerator/**',
    '!src/business/entities/caseAssociation/CaseAssociationRequestDocument.ts',
    '!src/business/entities/trialSessions/SpecialTrialSessions.ts',
    '!src/business/utilities/trialSessionPlanningReport/trialSessionPlanningReportDataTypes.ts',
    '!src/business/entities/trialSessionMinutes/MinuteSheet.ts',
  ],
  coverageDirectory: './coverage',
  coverageReporters: ['json', 'lcov'],
  maxWorkers: '50%',
  moduleFileExtensions: ['js', 'ts', 'tsx', 'jsx'],
  testMatch: [
    '<rootDir>/admin-tools/**/?(*.)+(spec|test).[jt]s?(x)',
    '<rootDir>/src/**/?(*.)+(spec|test).[jt]s?(x)',
  ],
  moduleNameMapper: {
    ...pathsToModuleNameMapper(tsConfigPaths, {
      prefix: '<rootDir>/../',
    }),
    '^uuid$': 'uuid',
    // @smithy/core@3.24.2 and @aws-sdk/core@3.1051.0 stub node-only exports as Symbol.for("node-only")
    // in its browser bundles. Jest's jsdom environment picks up the browser
    // export condition via its `exports` map, breaking any test that
    // transitively instantiates an AWS SDK client. Force the Node.js CJS
    // bundles for all affected subpaths.
    '^@smithy/core/config$':
      '<rootDir>/../node_modules/@smithy/core/dist-cjs/submodules/config/index.js',
    '^@smithy/core/retry$':
      '<rootDir>/../node_modules/@smithy/core/dist-cjs/submodules/retry/index.js',
    '^@smithy/core/serde$':
      '<rootDir>/../node_modules/@smithy/core/dist-cjs/submodules/serde/index.js',
    '^@aws-sdk/core/client$':
      '<rootDir>/../node_modules/@aws-sdk/core/dist-cjs/submodules/client/index.js',
  },
  setupFiles: ['core-js'],
  testEnvironment: path.resolve(
    process.cwd(),
    'web-client/JsdomWithTextEncoderEnvironment.ts',
  ),
  testPathIgnorePatterns: ['src/business/utilities/documentGenerators'],
  transform: {
    '\\.[jt]sx?$': ['babel-jest', { rootMode: 'upward' }],
  },
  transformIgnorePatterns: [
    '/node_modules/(?!uuid|sinon|aws-sdk-client-mock|export-to-csv|htmlparser2|dom-serializer|domhandler|domelementtype|domutils|entities|kysely)',
  ],
  // After a jest runner uses X% of total system memory, recreate the runner.
  workerIdleMemoryLimit: '20%',
  setupFilesAfterEnv: [
    '<rootDir>../web-api/src/persistence/postgres/featureFlag/mocks.jest.ts',
  ],
};

export default config;
