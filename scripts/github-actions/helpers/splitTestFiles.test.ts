import fs from 'fs';
import os from 'os';
import path from 'path';
import {
  countLinesInFile,
  distributeFilesByWeight,
  getCiNodeConfig,
  getHistoricalTestFileTimes,
  getOutputsForCurrentCiNode,
  type SplittableFile,
} from './splitTestFiles';

describe('splitTestFiles', () => {
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
});
