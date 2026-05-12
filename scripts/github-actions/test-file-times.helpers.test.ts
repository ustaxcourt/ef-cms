import fs from 'fs';
import os from 'os';
import path from 'path';
import {
  getTestFileTimesFilePaths,
  getCypressTestFileTimes,
  getJestTestFileTimes,
  testFileTimes,
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

  describe('getTestFileTimesFilePaths', () => {
    it('returns sorted json timing file paths from a directory', () => {
      const directoryPath = path.join(tempDir, 'shards');

      fs.mkdirSync(directoryPath, { recursive: true });
      fs.writeFileSync(path.join(directoryPath, 'b.json'), '{}');
      fs.writeFileSync(path.join(directoryPath, 'a.json'), '{}');
      fs.writeFileSync(path.join(directoryPath, 'notes.txt'), 'ignore me');

      expect(getTestFileTimesFilePaths(directoryPath)).toEqual([
        path.join(directoryPath, 'a.json'),
        path.join(directoryPath, 'b.json'),
      ]);
    });

    it('throws when the directory is missing or contains no json files', () => {
      const missingDirectoryPath = path.join(tempDir, 'missing-shards');
      const emptyDirectoryPath = path.join(tempDir, 'empty-shards');

      fs.mkdirSync(emptyDirectoryPath, { recursive: true });

      expect(() => getTestFileTimesFilePaths(missingDirectoryPath)).toThrow(
        `No timing files found in directory: ${missingDirectoryPath}`,
      );
      expect(() => getTestFileTimesFilePaths(emptyDirectoryPath)).toThrow(
        `No timing files found in directory: ${emptyDirectoryPath}`,
      );
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

      testFileTimes(['from-jest', inputFilePath, outputFilePath]);

      expect(JSON.parse(fs.readFileSync(outputFilePath, 'utf8'))).toEqual({
        './scripts/example.test.ts': 15,
      });
    });

    it('writes standardized timings from cypress output', () => {
      const inputFilePath = path.join(tempDir, 'cypress-results.json');
      const outputFilePath = path.join(tempDir, 'cypress-timings.json');

      fs.writeFileSync(
        inputFilePath,
        JSON.stringify({
          runs: [
            {
              spec: {
                relative: 'cypress/example.cy.ts',
              },
              stats: {
                duration: 1234,
              },
            },
          ],
        }),
      );

      testFileTimes(['from-cypress', inputFilePath, outputFilePath]);

      expect(JSON.parse(fs.readFileSync(outputFilePath, 'utf8'))).toEqual({
        './cypress/example.cy.ts': 1234,
      });
    });

    it('merges timing files', () => {
      const leftFilePath = path.join(tempDir, 'left.json');
      const rightFilePath = path.join(tempDir, 'right.json');
      const outputFilePath = path.join(tempDir, 'merged.json');
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

      fs.writeFileSync(leftFilePath, JSON.stringify({ './left.test.ts': 10 }));
      fs.writeFileSync(
        rightFilePath,
        JSON.stringify({ './right.test.ts': 20 }),
      );

      testFileTimes(['merge', outputFilePath, leftFilePath, rightFilePath]);

      expect(JSON.parse(fs.readFileSync(outputFilePath, 'utf8'))).toEqual({
        './left.test.ts': 10,
        './right.test.ts': 20,
      });
      expect(consoleLogSpy).toHaveBeenCalledWith(
        `Merged 2 shard timing files into ${outputFilePath} (2 test files).`,
      );

      consoleLogSpy.mockRestore();
    });

    it('merges timing files from a directory', () => {
      const directoryPath = path.join(tempDir, 'merge-directory');
      const outputFilePath = path.join(tempDir, 'merged-from-directory.json');
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

      fs.mkdirSync(directoryPath, { recursive: true });
      fs.writeFileSync(
        path.join(directoryPath, 'second.json'),
        JSON.stringify({ './right.test.ts': 20 }),
      );
      fs.writeFileSync(
        path.join(directoryPath, 'first.json'),
        JSON.stringify({ './left.test.ts': 10 }),
      );

      testFileTimes(['merge-directory', outputFilePath, directoryPath]);

      expect(JSON.parse(fs.readFileSync(outputFilePath, 'utf8'))).toEqual({
        './left.test.ts': 10,
        './right.test.ts': 20,
      });
      expect(consoleLogSpy).toHaveBeenCalledWith(
        `Merged 2 shard timing files into ${outputFilePath} (2 test files).`,
      );

      consoleLogSpy.mockRestore();
    });

    it('throws for invalid commands', () => {
      expect(() => testFileTimes(['oops'])).toThrow(
        'Usage: scripts/github-actions/test-file-times.ts <from-jest|from-cypress|merge|merge-directory> ...args',
      );
    });

    it('throws when required arguments are missing', () => {
      expect(() => testFileTimes(['from-jest'])).toThrow(
        'Usage: scripts/github-actions/test-file-times.ts from-jest <input> <output>',
      );
      expect(() => testFileTimes(['from-cypress'])).toThrow(
        'Usage: scripts/github-actions/test-file-times.ts from-cypress <input> <output>',
      );
      expect(() =>
        testFileTimes(['merge', path.join(tempDir, 'merged.json')]),
      ).toThrow(
        'Usage: scripts/github-actions/test-file-times.ts merge <output> <input...>',
      );
      expect(() =>
        testFileTimes([
          'merge-directory',
          path.join(tempDir, 'merged-from-directory.json'),
        ]),
      ).toThrow(
        'Usage: scripts/github-actions/test-file-times.ts merge-directory <output> <directory>',
      );
    });
  });
});
