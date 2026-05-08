import fs from 'fs';
import glob from 'glob';
import os from 'os';
import path from 'path';
import {
  countLinesInFile,
  distributeFilesByWeight,
  getCiNodeConfig,
  getHistoricalTestFileTimes,
  getOutputsForCurrentCiNode,
  splitTests,
  splitTestsCypress,
  splitTestsGlob,
  type SplittableFile,
} from './split-tests.helpers';

describe('split-tests.helpers', () => {
  const tempDir: string = fs.mkdtempSync(
    path.join(os.tmpdir(), 'split-test-files-'),
  );

  const createTempFile = (
    fileName: string,
    lineCount: number,
  ): SplittableFile => {
    const filePath: string = path.join(tempDir, fileName);
    const fileContents: string = Array.from(
      { length: lineCount },
      (_value: unknown, index: number): string => `line ${index + 1}`,
    ).join('\n');

    fs.writeFileSync(filePath, fileContents);

    return {
      output: fileName,
      path: filePath,
    };
  };

  const parseDelimitedOutput = (
    output: string,
    delimiter: string,
  ): string[] => {
    return output ? output.split(delimiter).sort() : [];
  };

  const writeHistoricalTimingFile = (
    fileName: string,
    testFileTimes: Record<string, number>,
  ): string => {
    const filePath = path.join(tempDir, fileName);

    fs.writeFileSync(filePath, JSON.stringify(testFileTimes));

    return filePath;
  };

  const withEnvironmentVariables = <T>(
    overrides: Record<string, string | undefined>,
    callback: () => T,
  ): T => {
    const originalValues: Record<string, string | undefined> = {};

    try {
      for (const [key, value] of Object.entries(overrides)) {
        originalValues[key] = process.env[key];

        if (typeof value === 'undefined') {
          delete process.env[key];
        } else {
          process.env[key] = value;
        }
      }

      return callback();
    } finally {
      for (const [key, value] of Object.entries(originalValues)) {
        if (typeof value === 'undefined') {
          delete process.env[key];
        } else {
          process.env[key] = value;
        }
      }
    }
  };

  afterAll((): void => {
    fs.rmSync(tempDir, { force: true, recursive: true });
  });

  describe('countLinesInFile', () => {
    it('counts an empty file as one line', () => {
      const emptyFilePath = path.join(tempDir, 'empty.txt');

      fs.writeFileSync(emptyFilePath, '');

      expect(countLinesInFile(emptyFilePath)).toEqual(1);
    });

    it('counts unix and windows newline variants', () => {
      const unixFilePath = path.join(tempDir, 'unix.txt');
      const windowsFilePath = path.join(tempDir, 'windows.txt');

      fs.writeFileSync(unixFilePath, 'a\nb\nc');
      fs.writeFileSync(windowsFilePath, 'a\r\nb\r\nc');

      expect(countLinesInFile(unixFilePath)).toEqual(3);
      expect(countLinesInFile(windowsFilePath)).toEqual(3);
    });
  });

  describe('distributeFilesByWeight', () => {
    it('throws when shard total is invalid', () => {
      expect(() =>
        distributeFilesByWeight({
          files: [],
          total: 0,
        }),
      ).toThrow('CI_NODE_TOTAL must be a positive integer. Received: 0');
    });

    it('greedily balances heavier files across shards', () => {
      const files = [
        createTempFile('a.test.ts', 12),
        createTempFile('b.test.ts', 11),
        createTempFile('c.test.ts', 8),
        createTempFile('d.test.ts', 7),
      ];

      expect(
        distributeFilesByWeight({
          files,
          total: 2,
        }),
      ).toEqual([
        [
          { output: 'a.test.ts', path: files[0].path },
          { output: 'd.test.ts', path: files[3].path },
        ],
        [
          { output: 'b.test.ts', path: files[1].path },
          { output: 'c.test.ts', path: files[2].path },
        ],
      ]);
    });

    it('uses alphabetical tie-breakers for equal weights and output ordering', () => {
      const files = [
        createTempFile('zeta.test.ts', 5),
        createTempFile('alpha.test.ts', 5),
        createTempFile('beta.test.ts', 5),
      ];

      expect(
        distributeFilesByWeight({
          files,
          total: 2,
        }),
      ).toEqual([
        [
          { output: 'alpha.test.ts', path: files[1].path },
          { output: 'zeta.test.ts', path: files[0].path },
        ],
        [{ output: 'beta.test.ts', path: files[2].path }],
      ]);
    });

    it('prefers historical execution times over line counts when available', () => {
      const files = [
        createTempFile('short-but-slow.test.ts', 1),
        createTempFile('long-but-fast.test.ts', 100),
        createTempFile('medium.test.ts', 50),
      ];

      expect(
        distributeFilesByWeight({
          files,
          historicalTestFileTimes: {
            [files[0].path]: 1000,
            [files[1].path]: 10,
            [files[2].path]: 500,
          },
          total: 2,
        }),
      ).toEqual([
        [{ output: 'short-but-slow.test.ts', path: files[0].path }],
        [
          { output: 'long-but-fast.test.ts', path: files[1].path },
          { output: 'medium.test.ts', path: files[2].path },
        ],
      ]);
    });
  });

  describe('getHistoricalTestFileTimes', () => {
    it('returns an empty object when timing env is unset', () => {
      expect(getHistoricalTestFileTimes({})).toEqual({});
    });

    it('reads historical test file timings from disk', () => {
      const timingFilePath = path.join(
        tempDir,
        'historical-test-file-times.json',
      );

      fs.writeFileSync(
        timingFilePath,
        JSON.stringify({
          './example.test.ts': 1000,
        }),
      );

      expect(
        getHistoricalTestFileTimes({
          TEST_FILE_TIMINGS_PATH: timingFilePath,
        }),
      ).toEqual({
        './example.test.ts': 1000,
      });
    });

    it('uses process.env by default when env is omitted', () => {
      const timingFilePath = path.join(
        tempDir,
        'historical-test-file-times-from-process-env.json',
      );
      const originalTimingsPath = process.env.TEST_FILE_TIMINGS_PATH;

      fs.writeFileSync(
        timingFilePath,
        JSON.stringify({
          './process-env.test.ts': 250,
        }),
      );

      try {
        process.env.TEST_FILE_TIMINGS_PATH = timingFilePath;

        expect(getHistoricalTestFileTimes()).toEqual({
          './process-env.test.ts': 250,
        });
      } finally {
        process.env.TEST_FILE_TIMINGS_PATH = originalTimingsPath;
      }
    });
  });

  describe('getCiNodeConfig', () => {
    it('returns parsed shard information', () => {
      expect(
        getCiNodeConfig({
          CI_NODE_INDEX: '1',
          CI_NODE_TOTAL: '3',
        }),
      ).toEqual({
        index: 1,
        total: 3,
      });
    });

    it('throws when CI_NODE_TOTAL is missing or invalid', () => {
      expect(() => getCiNodeConfig({})).toThrow(
        'CI_NODE_TOTAL must be a positive integer. Received: undefined',
      );
      expect(() =>
        getCiNodeConfig({
          CI_NODE_INDEX: '0',
          CI_NODE_TOTAL: 'abc',
        }),
      ).toThrow('CI_NODE_TOTAL must be a positive integer. Received: abc');
    });

    it('throws when CI_NODE_INDEX is missing or out of range', () => {
      expect(() =>
        getCiNodeConfig({
          CI_NODE_TOTAL: '2',
        }),
      ).toThrow(
        'CI_NODE_INDEX must be an integer between 0 and 1. Received: undefined',
      );
      expect(() =>
        getCiNodeConfig({
          CI_NODE_INDEX: '2',
          CI_NODE_TOTAL: '2',
        }),
      ).toThrow(
        'CI_NODE_INDEX must be an integer between 0 and 1. Received: 2',
      );
    });

    it('uses process.env by default when env is omitted', () => {
      const originalNodeTotal = process.env.CI_NODE_TOTAL;
      const originalNodeIndex = process.env.CI_NODE_INDEX;

      try {
        process.env.CI_NODE_TOTAL = '4';
        process.env.CI_NODE_INDEX = '3';

        expect(getCiNodeConfig()).toEqual({
          index: 3,
          total: 4,
        });
      } finally {
        process.env.CI_NODE_TOTAL = originalNodeTotal;
        process.env.CI_NODE_INDEX = originalNodeIndex;
      }
    });
  });

  describe('getOutputsForCurrentCiNode', () => {
    it('returns the outputs assigned to the current shard', () => {
      const files = [
        createTempFile('one.test.ts', 10),
        createTempFile('two.test.ts', 9),
        createTempFile('three.test.ts', 4),
      ];

      expect(
        getOutputsForCurrentCiNode({
          env: {
            CI_NODE_INDEX: '1',
            CI_NODE_TOTAL: '2',
          },
          files,
        }),
      ).toEqual(['three.test.ts', 'two.test.ts']);
    });

    it('uses process.env by default when env is omitted', () => {
      const originalNodeTotal = process.env.CI_NODE_TOTAL;
      const originalNodeIndex = process.env.CI_NODE_INDEX;

      try {
        process.env.CI_NODE_TOTAL = '2';
        process.env.CI_NODE_INDEX = '0';

        const files = [
          createTempFile('left.test.ts', 9),
          createTempFile('right.test.ts', 8),
        ];

        expect(
          getOutputsForCurrentCiNode({
            files,
          }),
        ).toEqual(['left.test.ts']);
      } finally {
        process.env.CI_NODE_TOTAL = originalNodeTotal;
        process.env.CI_NODE_INDEX = originalNodeIndex;
      }
    });
  });

  describe('splitTests', () => {
    it('filters integration tests and logs only matching spec filenames', () => {
      const readdirSyncSpy = jest
        .spyOn(fs, 'readdirSync')
        .mockReturnValue([
          'z-last.test.ts',
          'ignore.md',
          'a-first.test.ts',
          'notes.txt',
        ] as never);
      const consoleSpy = jest
        .spyOn(console, 'log')
        .mockImplementation((): void => undefined);
      const timingFilePath = writeHistoricalTimingFile(
        'split-tests-timings.json',
        {
          './web-client/integration-tests-public/a-first.test.ts': 10,
          './web-client/integration-tests-public/z-last.test.ts': 10,
        },
      );

      try {
        const output = withEnvironmentVariables(
          {
            CI_NODE_INDEX: '0',
            CI_NODE_TOTAL: '1',
            TEST_FILE_TIMINGS_PATH: timingFilePath,
          },
          (): string => splitTests('-public'),
        );

        expect(parseDelimitedOutput(output, ' ')).toEqual([
          'a-first.test.ts',
          'z-last.test.ts',
        ]);
        expect(readdirSyncSpy).toHaveBeenCalledWith(
          './web-client/integration-tests-public',
          'utf8',
        );
        expect(consoleSpy).toHaveBeenCalledWith(output);
      } finally {
        readdirSyncSpy.mockRestore();
        consoleSpy.mockRestore();
      }
    });
  });

  describe('splitTestsCypress', () => {
    it('throws when the requested Cypress suite does not exist', () => {
      expect(() => {
        withEnvironmentVariables(
          {
            CI_NODE_INDEX: '0',
            CI_NODE_TOTAL: '1',
            TEST_FILE_TIMINGS_PATH: '/tmp/jest.json',
          },
          (): string => splitTestsCypress('nonexistent-suite'),
        );
      }).toThrow('Invalid Cypress suite: nonexistent-suite');
    });

    it('excludes public Cypress tests when the requested directory is not public', () => {
      const readdirSyncSpy = jest
        .spyOn(fs, 'readdirSync')
        .mockReturnValue([
          'private-a.cy.ts',
          'nested/private-b.cy.ts',
          'public/public-a.cy.ts',
          'readme.md',
        ] as never);
      const consoleSpy = jest
        .spyOn(console, 'log')
        .mockImplementation((): void => undefined);
      const timingFilePath = writeHistoricalTimingFile(
        'split-tests-cypress-timings.json',
        {
          './cypress/local-only/tests/integration/private-a.cy.ts': 5,
          './cypress/local-only/tests/integration/nested/private-b.cy.ts': 5,
        },
      );

      try {
        const output = withEnvironmentVariables(
          {
            CI_NODE_INDEX: '0',
            CI_NODE_TOTAL: '1',
            TEST_FILE_TIMINGS_PATH: timingFilePath,
          },
          (): string => splitTestsCypress('integration'),
        );

        expect(parseDelimitedOutput(output, ',')).toEqual([
          './cypress/local-only/tests/integration/nested/private-b.cy.ts',
          './cypress/local-only/tests/integration/private-a.cy.ts',
        ]);
        expect(readdirSyncSpy).toHaveBeenCalledWith(
          './cypress/local-only/tests/integration',
          {
            encoding: 'utf8',
            recursive: true,
          },
        );
        expect(consoleSpy).toHaveBeenCalledWith(output);
      } finally {
        readdirSyncSpy.mockRestore();
        consoleSpy.mockRestore();
      }
    });

    it('includes public Cypress tests when the requested directory is public', () => {
      const readdirSyncSpy = jest
        .spyOn(fs, 'readdirSync')
        .mockReturnValue([
          'public-a.cy.ts',
          'nested/public-b.cy.ts',
          'notes.txt',
        ] as never);
      const consoleSpy = jest
        .spyOn(console, 'log')
        .mockImplementation((): void => undefined);
      const timingFilePath = writeHistoricalTimingFile(
        'split-tests-cypress-public-timings.json',
        {
          './cypress/local-only/tests/integration/public/public-a.cy.ts': 5,
          './cypress/local-only/tests/integration/public/nested/public-b.cy.ts': 5,
        },
      );

      try {
        const output = withEnvironmentVariables(
          {
            CI_NODE_INDEX: '0',
            CI_NODE_TOTAL: '1',
            TEST_FILE_TIMINGS_PATH: timingFilePath,
          },
          (): string => splitTestsCypress('integration/public'),
        );

        expect(parseDelimitedOutput(output, ',')).toEqual([
          './cypress/local-only/tests/integration/public/nested/public-b.cy.ts',
          './cypress/local-only/tests/integration/public/public-a.cy.ts',
        ]);
        expect(consoleSpy).toHaveBeenCalledWith(output);
      } finally {
        readdirSyncSpy.mockRestore();
        consoleSpy.mockRestore();
      }
    });
  });

  describe('splitTestsGlob', () => {
    it('selects unit test files via glob and logs the delimited output', () => {
      const globSyncSpy = jest
        .spyOn(glob, 'sync')
        .mockReturnValue([
          './web-client/src/beta.test.ts',
          './web-client/src/nested/alpha.test.ts',
        ]);
      const consoleSpy = jest
        .spyOn(console, 'log')
        .mockImplementation((): void => undefined);
      const timingFilePath = writeHistoricalTimingFile(
        'split-tests-glob-unit.json',
        {
          './web-client/src/beta.test.ts': 10,
          './web-client/src/nested/alpha.test.ts': 10,
        },
      );

      try {
        const output = withEnvironmentVariables(
          {
            CI_NODE_INDEX: '0',
            CI_NODE_TOTAL: '1',
            TEST_FILE_TIMINGS_PATH: timingFilePath,
          },
          (): string => splitTestsGlob('unit'),
        );

        expect(parseDelimitedOutput(output, '|')).toEqual([
          './web-client/src/beta.test.ts',
          './web-client/src/nested/alpha.test.ts',
        ]);
        expect(globSyncSpy).toHaveBeenCalledWith(
          './web-client/src/**/?(*.)+(spec|test).[jt]s?(x)',
        );
        expect(consoleSpy).toHaveBeenCalledWith(output);
      } finally {
        globSyncSpy.mockRestore();
        consoleSpy.mockRestore();
      }
    });

    it('selects shared test files via glob', () => {
      const globSyncSpy = jest
        .spyOn(glob, 'sync')
        .mockReturnValue([
          './shared/src/example.test.ts',
          './shared/src/nested/another.test.ts',
        ]);
      const consoleSpy = jest
        .spyOn(console, 'log')
        .mockImplementation((): void => undefined);
      const timingFilePath = writeHistoricalTimingFile(
        'split-tests-glob-shared.json',
        {
          './shared/src/example.test.ts': 12,
          './shared/src/nested/another.test.ts': 12,
        },
      );

      try {
        const output = withEnvironmentVariables(
          {
            CI_NODE_INDEX: '0',
            CI_NODE_TOTAL: '1',
            TEST_FILE_TIMINGS_PATH: timingFilePath,
          },
          (): string => splitTestsGlob('shared'),
        );

        expect(parseDelimitedOutput(output, '|')).toEqual([
          './shared/src/example.test.ts',
          './shared/src/nested/another.test.ts',
        ]);
        expect(globSyncSpy).toHaveBeenCalledWith(
          './shared/src/**/?(*.)+(spec|test).[jt]s',
        );
        expect(consoleSpy).toHaveBeenCalledWith(output);
      } finally {
        globSyncSpy.mockRestore();
        consoleSpy.mockRestore();
      }
    });

    it('returns an empty string when the test type does not match a known glob', () => {
      const globSyncSpy = jest.spyOn(glob, 'sync');
      const consoleSpy = jest
        .spyOn(console, 'log')
        .mockImplementation((): void => undefined);
      const originalNodeTotal = process.env.CI_NODE_TOTAL;
      const originalNodeIndex = process.env.CI_NODE_INDEX;

      try {
        process.env.CI_NODE_TOTAL = '1';
        process.env.CI_NODE_INDEX = '0';

        expect(splitTestsGlob('integration')).toEqual('');
        expect(globSyncSpy).not.toHaveBeenCalled();
        expect(consoleSpy).toHaveBeenCalledWith('');
      } finally {
        process.env.CI_NODE_TOTAL = originalNodeTotal;
        process.env.CI_NODE_INDEX = originalNodeIndex;
        globSyncSpy.mockRestore();
        consoleSpy.mockRestore();
      }
    });
  });
});
