import {
  afterAll,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { getOutputsForCurrentCiNode } from './helpers/splitTestFiles';
import { main } from './split-tests-cypress';

jest.mock('./helpers/splitTestFiles', () => ({
  getOutputsForCurrentCiNode: jest.fn(),
}));

describe('split-tests-cypress', () => {
  const mockConsoleLog = jest
    .spyOn(console, 'log')
    .mockImplementation((): void => undefined);
  const originalArgv = process.argv;
  const originalCwd = process.cwd();
  const tempDir: string = fs.mkdtempSync(
    path.join(os.tmpdir(), 'split-tests-cypress-script-'),
  );
  const specDir: string = path.join(tempDir, 'cypress/local-only/tests');

  const resetDirectory = (directoryPath: string): void => {
    fs.rmSync(directoryPath, { force: true, recursive: true });
    fs.mkdirSync(directoryPath, { recursive: true });
  };

  const writeFile = (fileName: string): void => {
    const filePath: string = path.join(specDir, fileName);

    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, '');
  };

  beforeEach((): void => {
    jest.clearAllMocks();
    process.chdir(tempDir);
    resetDirectory(specDir);
  });

  afterAll((): void => {
    process.chdir(originalCwd);
    process.argv = originalArgv;
    fs.rmSync(tempDir, { force: true, recursive: true });
  });

  it('filters requested cypress tests and excludes public tests by default', (): void => {
    writeFile('integration/case-detail.cy.ts');
    writeFile('integration/public/ignore.cy.ts');
    writeFile('integration/notes.txt');
    writeFile('accessibility/a11y.cy.ts');
    jest
      .mocked(getOutputsForCurrentCiNode)
      .mockReturnValue([
        './cypress/local-only/tests/integration/case-detail.cy.ts',
      ]);

    const result = main(['integration']);

    expect(getOutputsForCurrentCiNode).toHaveBeenCalledWith({
      files: [
        {
          output: './cypress/local-only/tests/integration/case-detail.cy.ts',
          path: './cypress/local-only/tests/integration/case-detail.cy.ts',
        },
      ],
    });
    expect(mockConsoleLog).toHaveBeenCalledWith(
      './cypress/local-only/tests/integration/case-detail.cy.ts',
    );
    expect(result).toBe(
      './cypress/local-only/tests/integration/case-detail.cy.ts',
    );
  });

  it('keeps public cypress tests when the requested folder includes public', (): void => {
    writeFile('integration/public/public-case.cy.ts');
    jest
      .mocked(getOutputsForCurrentCiNode)
      .mockReturnValue([
        './cypress/local-only/tests/integration/public/public-case.cy.ts',
      ]);

    main(['integration/public']);

    expect(getOutputsForCurrentCiNode).toHaveBeenCalledWith({
      files: [
        {
          output:
            './cypress/local-only/tests/integration/public/public-case.cy.ts',
          path: './cypress/local-only/tests/integration/public/public-case.cy.ts',
        },
      ],
    });
  });

  it('uses process.argv by default when args are omitted', (): void => {
    process.argv = ['node', 'script'];
    jest.mocked(getOutputsForCurrentCiNode).mockReturnValue([]);

    const result = main();

    expect(result).toBe('');
  });
});
