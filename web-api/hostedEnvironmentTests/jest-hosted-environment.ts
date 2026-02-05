import { pathsToModuleNameMapper } from 'ts-jest';
import type { Config } from 'jest';
import fs from 'node:fs';
import path from 'node:path';

const tsconfigPath = path.resolve(process.cwd(), './tsconfig.json');
const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));

const config: Config = {
  clearMocks: true,
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
};

export default config;
