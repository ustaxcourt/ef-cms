import { pathsToModuleNameMapper } from 'ts-jest';
//import tsconfig from '../tsconfig.json';
import type { Config } from 'jest';

import fs from 'node:fs';
import path from 'node:path';
const __dirname = import.meta.dirname;

const tsconfigPath = path.resolve(process.cwd(), './tsconfig.json');
const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));

const config: Config = {
  clearMocks: true,
  collectCoverage: true,
  // type files ignored
  collectCoverageFrom: [
    'src/**/*.{js,ts}',
    '!src/sharedAppContext.ts',
    '!src/applicationContextForTests.ts',
    '!src/business/test/**/*.ts',
    '!src/business/assets/*.ts',
    '!src/proxies/**/*.ts',
    '!src/tools/**/*.ts',
    '!src/test/**/*.ts',
    '!src/**/*_.ts',
    '!src/business/utilities/documentGenerators/**/*.ts',
    '!src/business/utilities/generateHTMLTemplateForPDF/generateHTMLTemplateForPDF.ts',
    '!src/business/utilities/htmlGenerator/**',
    '!src/business/entities/caseAssociation/CaseAssociationRequestDocument.ts',
    '!src/business/entities/trialSessions/SpecialTrialSessions.ts',
    '!src/business/utilities/trialSessionPlanningReport/trialSessionPlanningReportDataTypes.ts',
    '!src/business/entities/trialSessionMinutes/MinuteSheet.ts',
  ],
  coverageDirectory: './coverage',
  coverageProvider: 'babel',
  coverageReporters: ['json', 'lcov'],
  maxWorkers: '50%',
  moduleFileExtensions: ['js', 'ts', 'tsx', 'jsx'],
  moduleNameMapper: {
    ...pathsToModuleNameMapper(tsconfig.compilerOptions.paths, {
      prefix: '<rootDir>/../',
    }),
    '^uuid$': 'uuid',
  },
  setupFiles: ['core-js'],
  testEnvironment: `${__dirname}/../web-client/JsdomWithTextEncoderEnvironment.ts`,
  testPathIgnorePatterns: ['src/business/utilities/documentGenerators'],
  transform: {
    '\\.[jt]sx?$': ['babel-jest', { rootMode: 'upward' }],
  },
  transformIgnorePatterns: ['/node_modules/(?!uuid|sinon|aws-sdk-client-mock|export-to-csv)'],
  // After a jest runner uses X% of total system memory, recreate the runner.
  verbose: false,
  workerIdleMemoryLimit: '20%',
  setupFilesAfterEnv: [
    '<rootDir>../web-api/src/persistence/postgres/featureFlag/mocks.jest.ts',
  ],
};

export default config;
