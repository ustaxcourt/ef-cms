import fs from 'fs';
import { getOutputsForCurrentCiNode } from './helpers/splitTestFiles';
import { main } from './split-tests-cypress';

jest.mock('fs');
jest.mock('./helpers/splitTestFiles', () => ({
  getOutputsForCurrentCiNode: jest.fn(),
}));

describe('split-tests-cypress', () => {
  const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation();
  const originalArgv = process.argv;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    process.argv = originalArgv;
  });

  it('filters requested cypress tests and excludes public tests by default', () => {
    jest
      .mocked(fs.readdirSync)
      .mockReturnValue([
        'integration/case-detail.cy.ts',
        'integration/public/ignore.cy.ts',
        'integration/notes.txt',
        'accessibility/a11y.cy.ts',
      ] as string[]);
    jest
      .mocked(getOutputsForCurrentCiNode)
      .mockReturnValue([
        './cypress/local-only/tests/integration/case-detail.cy.ts',
      ]);

    const result = main(['integration']);

    expect(fs.readdirSync).toHaveBeenCalledWith('./cypress/local-only/tests', {
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

  it('keeps public cypress tests when the requested folder includes public', () => {
    jest
      .mocked(fs.readdirSync)
      .mockReturnValue(['integration/public/public-case.cy.ts'] as string[]);
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

  it('uses process.argv by default when args are omitted', () => {
    process.argv = ['node', 'script'];
    jest.mocked(fs.readdirSync).mockReturnValue([] as string[]);
    jest.mocked(getOutputsForCurrentCiNode).mockReturnValue([]);

    const result = main();

    expect(fs.readdirSync).toHaveBeenCalledWith('./cypress/local-only/tests', {
      recursive: true,
    });
    expect(result).toBe('');
  });
});
