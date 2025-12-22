import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { generatePdfFromScanSessionAction } from './generatePdfFromScanSessionAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('generatePdfFromScanSessionAction', () => {
  beforeEach(() => {
    Object.assign(presenter.providers, {
      applicationContext,
      path: {
        error: jest.fn(),
        success: jest.fn(),
      },
    });

    global.File = class MockFile {
      foo: string;
      constructor() {
        this.foo = 'bar';
      }
    } as unknown as typeof File;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('generates a PDF from provided scan batches', async () => {
    await runAction(generatePdfFromScanSessionAction, {
      modules: {
        presenter,
      },
      state: {
        currentViewMetadata: {
          documentSelectedForScan: 'petition',
        },
        scanner: {
          batches: {
            petition: [{ pages: [] }],
          },
          isScanning: true,
        },
      },
    });

    expect(
      applicationContext.getUseCases().generatePDFFromJPGDataInteractor,
    ).toHaveBeenCalled();
    expect(presenter.providers.path.success).toHaveBeenCalledTimes(1);
    const successCall = presenter.providers.path.success.mock.calls[0][0];
    expect(successCall.file).toBeDefined();
    expect(presenter.providers.path.error).not.toHaveBeenCalled();
  });

  it('should return error path when batches is null', async () => {
    await runAction(generatePdfFromScanSessionAction, {
      modules: {
        presenter,
      },
      state: {
        currentViewMetadata: {
          documentSelectedForScan: 'petition',
        },
        scanner: {
          batches: {
            petition: null,
          },
        },
      },
    });

    expect(presenter.providers.path.error).toHaveBeenCalledTimes(1);
    const errorCall = presenter.providers.path.error.mock.calls[0][0];
    expect(errorCall.error).toBeInstanceOf(Error);
    expect(errorCall.error.message).toBe(
      'No batches found for document type: petition',
    );
    expect(presenter.providers.path.success).not.toHaveBeenCalled();
  });

  it('should return error path when batches is undefined', async () => {
    await runAction(generatePdfFromScanSessionAction, {
      modules: {
        presenter,
      },
      state: {
        currentViewMetadata: {
          documentSelectedForScan: 'petition',
        },
        scanner: {
          batches: {
            petition: undefined,
          },
        },
      },
    });

    expect(presenter.providers.path.error).toHaveBeenCalledTimes(1);
    const errorCall = presenter.providers.path.error.mock.calls[0][0];
    expect(errorCall.error).toBeInstanceOf(Error);
    expect(errorCall.error.message).toBe(
      'No batches found for document type: petition',
    );
    expect(presenter.providers.path.success).not.toHaveBeenCalled();
  });

  it('should return error path when batches is empty array', async () => {
    await runAction(generatePdfFromScanSessionAction, {
      modules: {
        presenter,
      },
      state: {
        currentViewMetadata: {
          documentSelectedForScan: 'petition',
        },
        scanner: {
          batches: {
            petition: [],
          },
        },
      },
    });

    expect(presenter.providers.path.error).toHaveBeenCalledTimes(1);
    const errorCall = presenter.providers.path.error.mock.calls[0][0];
    expect(errorCall.error).toBeInstanceOf(Error);
    expect(errorCall.error.message).toBe(
      'No batches found for document type: petition',
    );
    expect(presenter.providers.path.success).not.toHaveBeenCalled();
  });
});
