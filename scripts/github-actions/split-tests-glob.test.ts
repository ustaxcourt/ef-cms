import {
  afterAll,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import { getOutputsForCurrentCiNode } from './helpers/splitTestFiles';
import { main } from './split-tests-glob';

jest.mock('glob', () => ({
  sync: jest.fn(),
}));
jest.mock('./helpers/splitTestFiles', () => ({
  getOutputsForCurrentCiNode: jest.fn(),
}));

const glob: {
  sync: jest.MockedFunction<(pattern: string) => string[]>;
} = require('glob');

describe('split-tests-glob', () => {
  const mockConsoleLog = jest
    .spyOn(console, 'log')
    .mockImplementation((): void => undefined);
  const originalArgv = process.argv;

  beforeEach((): void => {
    jest.clearAllMocks();
  });

  afterAll((): void => {
    process.argv = originalArgv;
  });

  it('loads unit test files and logs the selected shard output', (): void => {
    jest
      .mocked(glob.sync)
      .mockReturnValue([
        './web-client/src/a.test.ts',
        './web-client/src/b.test.tsx',
      ]);
    jest
      .mocked(getOutputsForCurrentCiNode)
      .mockReturnValue(['./web-client/src/b.test.tsx']);

    const result = main(['-unit']);

    expect(glob.sync).toHaveBeenCalledWith(
      './web-client/src/**/?(*.)+(spec|test).[jt]s?(x)',
    );
    expect(getOutputsForCurrentCiNode).toHaveBeenCalledWith({
      files: [
        {
          output: './web-client/src/a.test.ts',
          path: './web-client/src/a.test.ts',
        },
        {
          output: './web-client/src/b.test.tsx',
          path: './web-client/src/b.test.tsx',
        },
      ],
    });
    expect(mockConsoleLog).toHaveBeenCalledWith('./web-client/src/b.test.tsx');
    expect(result).toBe('./web-client/src/b.test.tsx');
  });

  it('loads shared test files when requested', (): void => {
    jest.mocked(glob.sync).mockReturnValue(['./shared/src/example.test.ts']);
    jest
      .mocked(getOutputsForCurrentCiNode)
      .mockReturnValue(['./shared/src/example.test.ts']);

    main(['-shared']);

    expect(glob.sync).toHaveBeenCalledWith(
      './shared/src/**/?(*.)+(spec|test).[jt]s',
    );
  });

  it('handles unknown test types without globbing', (): void => {
    jest.mocked(getOutputsForCurrentCiNode).mockReturnValue([]);

    const result = main(['-other']);

    expect(glob.sync).not.toHaveBeenCalled();
    expect(getOutputsForCurrentCiNode).toHaveBeenCalledWith({
      files: [],
    });
    expect(mockConsoleLog).toHaveBeenCalledWith('');
    expect(result).toBe('');
  });

  it('uses process.argv by default when args are omitted', (): void => {
    process.argv = ['node', 'script'];
    jest.mocked(getOutputsForCurrentCiNode).mockReturnValue([]);

    const result = main();

    expect(glob.sync).not.toHaveBeenCalled();
    expect(result).toBe('');
  });
});
