import { pathsToModuleNameMapper } from 'ts-jest';
import fs from 'fs';
import path from 'path';
const tsconfigPath = path.join(process.cwd(), 'tsconfig.json');
const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));

/** @type {import('jest').Config} */
const config = {
  clearMocks: true,
  collectCoverage: false,
  moduleNameMapper: pathsToModuleNameMapper(tsconfig.compilerOptions.paths, {
    prefix: '<rootDir>/../../',
  }),
  testEnvironment: 'node',
  testMatch: [
    '**/web-api/hostedEnvironmentTests/**/?(*.)+(spec|test).[jt]s?(x)',
  ],
  testTimeout: 30000,
  transform: {
    '\\.[jt]sx?$': ['babel-jest', { rootMode: 'upward' }],
  },
  verbose: false,
};

export default config;
