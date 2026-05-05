import fs from 'fs';
import os from 'os';
import path from 'path';
import { getOutputsForCurrentCiNode } from './helpers/splitTestFiles';
import { main } from './split-tests';

jest.mock('./helpers/splitTestFiles', () => ({
  getOutputsForCurrentCiNode: jest.fn(),
}));

describe('split-tests', () => {
  const mockConsoleLog = jest
    .spyOn(console, 'log')
    .mockImplementation((): void => undefined);
  const originalArgv = process.argv;
  const originalCwd = process.cwd();
  const tempDir: string = fs.mkdtempSync(
    path.join(os.tmpdir(), 'split-tests-script-'),
  );
  const integrationDir: string = path.join(
    tempDir,
    'web-client/integration-tests',
  );
  const integrationPublicDir: string = path.join(
    tempDir,
    'web-client/integration-tests-public',
  );

  const resetDirectory = (directoryPath: string): void => {
    fs.rmSync(directoryPath, { force: true, recursive: true });
    fs.mkdirSync(directoryPath, { recursive: true });
  };

  const writeFile = (directoryPath: string, fileName: string): void => {
    fs.writeFileSync(path.join(directoryPath, fileName), '');
  };

  beforeEach((): void => {
    jest.clearAllMocks();
    process.chdir(tempDir);
    resetDirectory(integrationDir);
    resetDirectory(integrationPublicDir);
  });

  afterAll((): void => {
    process.chdir(originalCwd);
    process.argv = originalArgv;
    fs.rmSync(tempDir, { force: true, recursive: true });
  });

  it('logs integration test files for the requested suffix', (): void => {
    writeFile(integrationPublicDir, 'alpha.test.ts');
    writeFile(integrationPublicDir, 'notes.md');
    writeFile(integrationPublicDir, 'beta.test.ts');
    jest
      .mocked(getOutputsForCurrentCiNode)
      .mockReturnValue(['beta.test.ts', 'alpha.test.ts']);

    const result = main(['-public']);

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

  it('uses process.argv by default when no args are provided', (): void => {
    process.argv = ['node', 'script'];
    writeFile(integrationDir, 'default.test.ts');
    jest
      .mocked(getOutputsForCurrentCiNode)
      .mockReturnValue(['default.test.ts']);

    const result = main();

    expect(result).toBe('default.test.ts');
  });
});
