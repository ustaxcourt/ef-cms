import fs from 'fs';
import { getOutputsForCurrentCiNode } from './helpers/splitTestFiles';
import { main } from './split-tests';

jest.mock('fs');
jest.mock('./helpers/splitTestFiles', () => ({
  getOutputsForCurrentCiNode: jest.fn(),
}));

describe('split-tests', () => {
  const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation();
  const originalArgv = process.argv;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    process.argv = originalArgv;
  });

  it('logs integration test files for the requested suffix', () => {
    jest
      .mocked(fs.readdirSync)
      .mockReturnValue([
        'alpha.test.ts',
        'notes.md',
        'beta.test.ts',
      ] as string[]);
    jest
      .mocked(getOutputsForCurrentCiNode)
      .mockReturnValue(['beta.test.ts', 'alpha.test.ts']);

    const result = main(['-public']);

    expect(fs.readdirSync).toHaveBeenCalledWith(
      './web-client/integration-tests-public',
    );
    expect(getOutputsForCurrentCiNode).toHaveBeenCalledWith({
      files: [
        {
          output: 'alpha.test.ts',
          path: './web-client/integration-tests-public/alpha.test.ts',
        },
        {
          output: 'beta.test.ts',
          path: './web-client/integration-tests-public/beta.test.ts',
        },
      ],
    });
    expect(mockConsoleLog).toHaveBeenCalledWith('beta.test.ts alpha.test.ts');
    expect(result).toBe('beta.test.ts alpha.test.ts');
  });

  it('uses process.argv by default when no args are provided', () => {
    process.argv = ['node', 'script'];
    jest
      .mocked(fs.readdirSync)
      .mockReturnValue(['default.test.ts'] as string[]);
    jest
      .mocked(getOutputsForCurrentCiNode)
      .mockReturnValue(['default.test.ts']);

    const result = main();

    expect(fs.readdirSync).toHaveBeenCalledWith(
      './web-client/integration-tests',
    );
    expect(result).toBe('default.test.ts');
  });
});
