import fs from 'fs';
import { getOutputsForCurrentCiNode } from './helpers/splitTestFiles';
import { main } from './split-tests-cypress';

jest.mock('fs');
jest.mock('./helpers/splitTestFiles', () => ({
  getOutputsForCurrentCiNode: jest.fn(),
}));

describe('split-tests-cypress', () => {
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

  it('filters requested cypress tests and excludes public tests by default', (): void => {
    const directoryEntries: string[] = [
      'integration/case-detail.cy.ts',
      'integration/public/ignore.cy.ts',
      'integration/notes.txt',
      'accessibility/a11y.cy.ts',
    ];

    jest.mocked(fs.readdirSync).mockReturnValue(directoryEntries);
    jest
      .mocked(getOutputsForCurrentCiNode)
      .mockReturnValue([
        './cypress/local-only/tests/integration/case-detail.cy.ts',
      ]);

    const result = main(['integration']);

    expect(fs.readdirSync).toHaveBeenCalledWith('./cypress/local-only/tests', {
      encoding: 'utf8',
      recursive: true,
    });
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
    const directoryEntries: string[] = ['integration/public/public-case.cy.ts'];

    jest.mocked(fs.readdirSync).mockReturnValue(directoryEntries);
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
    const directoryEntries: string[] = [];

    jest.mocked(fs.readdirSync).mockReturnValue(directoryEntries);
    jest.mocked(getOutputsForCurrentCiNode).mockReturnValue([]);

    const result = main();

    expect(fs.readdirSync).toHaveBeenCalledWith('./cypress/local-only/tests', {
      encoding: 'utf8',
      recursive: true,
    });
    expect(result).toBe('');
  });
});
