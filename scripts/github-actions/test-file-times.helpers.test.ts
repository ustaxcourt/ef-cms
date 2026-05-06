import fs from 'fs';
import os from 'os';
import path from 'path';
import {
  getCypressTestFileTimes,
  getJestTestFileTimes,
  main,
  mergeTestFileTimes,
  normalizeTestFilePath,
  readTestFileTimes,
  writeTestFileTimes,
} from './test-file-times.helpers';

describe('test-file-times', () => {
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
  describe('main', () => {
    const tempDir = fs.mkdtempSync(
      path.join(os.tmpdir(), 'test-file-times-cli-'),
    );

    afterAll(() => {
      fs.rmSync(tempDir, { force: true, recursive: true });
    });

    it('writes standardized timings from jest output', () => {
      const inputFilePath = path.join(tempDir, 'jest-results.json');
      const outputFilePath = path.join(tempDir, 'timings.json');

      fs.writeFileSync(
        inputFilePath,
        JSON.stringify({
          testResults: [
            {
              endTime: 25,
              name: path.join(process.cwd(), 'scripts/example.test.ts'),
              startTime: 10,
            },
          ],
        }),
      );

      main(['from-jest', inputFilePath, outputFilePath]);

      expect(JSON.parse(fs.readFileSync(outputFilePath, 'utf8'))).toEqual({
        './scripts/example.test.ts': 15,
      });
    });

    it('merges timing files', () => {
      const leftFilePath = path.join(tempDir, 'left.json');
      const rightFilePath = path.join(tempDir, 'right.json');
      const outputFilePath = path.join(tempDir, 'merged.json');

      fs.writeFileSync(leftFilePath, JSON.stringify({ './left.test.ts': 10 }));
      fs.writeFileSync(
        rightFilePath,
        JSON.stringify({ './right.test.ts': 20 }),
      );

      main(['merge', outputFilePath, leftFilePath, rightFilePath]);

      expect(JSON.parse(fs.readFileSync(outputFilePath, 'utf8'))).toEqual({
        './left.test.ts': 10,
        './right.test.ts': 20,
      });
    });

    it('throws for invalid commands', () => {
      expect(() => main(['oops'])).toThrow(
        'Usage: scripts/github-actions/test-file-times.ts <from-jest|merge> ...args',
      );
    });

    it('throws when required arguments are missing', () => {
      expect(() => main(['from-jest'])).toThrow(
        'Usage: scripts/github-actions/test-file-times.ts from-jest <input> <output>',
      );
      expect(() => main(['merge', path.join(tempDir, 'merged.json')])).toThrow(
        'Usage: scripts/github-actions/test-file-times.ts merge <output> <input...>',
      );
    });
  });
});
