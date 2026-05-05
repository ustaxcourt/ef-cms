import fs from 'fs';
import os from 'os';
import path from 'path';
import {
  getCypressTestFileTimes,
  getJestTestFileTimes,
  mergeTestFileTimes,
  normalizeTestFilePath,
  readTestFileTimes,
  writeTestFileTimes,
} from './testFileTimes';

describe('testFileTimes', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'test-file-times-'));

  afterAll(() => {
    fs.rmSync(tempDir, { force: true, recursive: true });
  });

  describe('normalizeTestFilePath', () => {
    it('normalizes absolute paths relative to the current working directory', () => {
      expect(
        normalizeTestFilePath(
          '/repo/web-client/integration-tests/example.test.ts',
          '/repo',
        ),
      ).toEqual('./web-client/integration-tests/example.test.ts');
    });

    it('prefixes relative paths with dot slash', () => {
      expect(
        normalizeTestFilePath('cypress/local-only/tests/example.cy.ts'),
      ).toEqual('./cypress/local-only/tests/example.cy.ts');
    });

    it('preserves existing dot slash prefixes', () => {
      expect(normalizeTestFilePath('./already-normalized.test.ts')).toEqual(
        './already-normalized.test.ts',
      );
    });
  });

  describe('readTestFileTimes and writeTestFileTimes', () => {
    it('writes and reads standardized timing files', () => {
      const filePath = path.join(tempDir, 'nested', 'timings.json');
      const testFileTimes = {
        './a.test.ts': 1000,
        './b.test.ts': 2000,
      };

      writeTestFileTimes({
        filePath,
        testFileTimes,
      });

      expect(readTestFileTimes(filePath)).toEqual(testFileTimes);
    });

    it('returns an empty object when timing file does not exist', () => {
      expect(readTestFileTimes(path.join(tempDir, 'missing.json'))).toEqual({});
    });
  });

  describe('mergeTestFileTimes', () => {
    it('merges shard timing records', () => {
      expect(
        mergeTestFileTimes([
          {
            './a.test.ts': 1000,
          },
          {
            './b.test.ts': 2000,
          },
        ]),
      ).toEqual({
        './a.test.ts': 1000,
        './b.test.ts': 2000,
      });
    });
  });

  describe('getJestTestFileTimes', () => {
    it('converts jest json results to standardized timing records', () => {
      expect(
        getJestTestFileTimes({
          cwd: '/repo',
          results: {
            testResults: [
              {
                endTime: 2500,
                name: '/repo/shared/src/example.test.ts',
                startTime: 1000,
              },
            ],
          },
        }),
      ).toEqual({
        './shared/src/example.test.ts': 1500,
      });
    });

    it('forces a minimum duration of one millisecond', () => {
      expect(
        getJestTestFileTimes({
          cwd: '/repo',
          results: {
            testResults: [
              {
                endTime: 1000,
                name: '/repo/shared/src/example.test.ts',
                startTime: 1000,
              },
            ],
          },
        }),
      ).toEqual({
        './shared/src/example.test.ts': 1,
      });
    });

    it('falls back to zero when jest omits timing boundaries', () => {
      expect(
        getJestTestFileTimes({
          cwd: '/repo',
          results: {
            testResults: [
              {
                name: '/repo/shared/src/example.test.ts',
              },
            ],
          },
        }),
      ).toEqual({
        './shared/src/example.test.ts': 1,
      });
    });
  });

  describe('getCypressTestFileTimes', () => {
    it('converts cypress run results to standardized timing records', () => {
      expect(
        getCypressTestFileTimes({
          cwd: '/repo',
          results: {
            runs: [
              {
                spec: {
                  relative:
                    'cypress/local-only/tests/integration/example.cy.ts',
                },
                stats: {
                  duration: 4321,
                },
              },
            ],
          },
        }),
      ).toEqual({
        './cypress/local-only/tests/integration/example.cy.ts': 4321,
      });
    });

    it('skips cypress runs that do not include a spec path', () => {
      expect(
        getCypressTestFileTimes({
          results: {
            runs: [
              {
                spec: {},
                stats: {
                  duration: 500,
                },
              },
            ],
          },
        }),
      ).toEqual({});
    });

    it('forces a minimum duration of one millisecond for cypress runs', () => {
      expect(
        getCypressTestFileTimes({
          results: {
            runs: [
              {
                spec: {
                  relative:
                    'cypress/local-only/tests/integration/example.cy.ts',
                },
                stats: {},
              },
            ],
          },
        }),
      ).toEqual({
        './cypress/local-only/tests/integration/example.cy.ts': 1,
      });
    });
  });
});
