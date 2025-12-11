import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { validateDocumentSelectedForScanAction } from './validateDocumentSelectedForScanAction';

describe('validateDocumentSelectedForScanAction', () => {
  beforeEach(() => {
    Object.assign(presenter.providers, {
      path: {
        error: jest.fn(),
        success: jest.fn(),
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return error path when documentSelectedForScan is null', async () => {
    await runAction(validateDocumentSelectedForScanAction, {
      modules: {
        presenter,
      },
      state: {
        currentViewMetadata: {
          documentSelectedForScan: null,
        },
      },
    });

    expect(presenter.providers.path.error).toHaveBeenCalledTimes(1);
    const errorCall = presenter.providers.path.error.mock.calls[0][0];
    expect(errorCall.error).toBeInstanceOf(Error);
    expect(errorCall.error.message).toBe('No document selected for scan');
    expect(presenter.providers.path.success).not.toHaveBeenCalled();
  });

  it('should return error path when documentSelectedForScan is undefined', async () => {
    await runAction(validateDocumentSelectedForScanAction, {
      modules: {
        presenter,
      },
      state: {
        currentViewMetadata: {
          documentSelectedForScan: undefined,
        },
      },
    });

    expect(presenter.providers.path.error).toHaveBeenCalledTimes(1);
    const errorCall = presenter.providers.path.error.mock.calls[0][0];
    expect(errorCall.error).toBeInstanceOf(Error);
    expect(errorCall.error.message).toBe('No document selected for scan');
    expect(presenter.providers.path.success).not.toHaveBeenCalled();
  });

  it('should return error path when documentSelectedForScan is empty string', async () => {
    await runAction(validateDocumentSelectedForScanAction, {
      modules: {
        presenter,
      },
      state: {
        currentViewMetadata: {
          documentSelectedForScan: '',
        },
      },
    });

    expect(presenter.providers.path.error).toHaveBeenCalledTimes(1);
    const errorCall = presenter.providers.path.error.mock.calls[0][0];
    expect(errorCall.error).toBeInstanceOf(Error);
    expect(errorCall.error.message).toBe('No document selected for scan');
    expect(presenter.providers.path.success).not.toHaveBeenCalled();
  });

  it('should return success path when documentSelectedForScan is whitespace only (whitespace is considered valid)', async () => {
    await runAction(validateDocumentSelectedForScanAction, {
      modules: {
        presenter,
      },
      state: {
        currentViewMetadata: {
          documentSelectedForScan: '   ',
        },
      },
    });

    expect(presenter.providers.path.success).toHaveBeenCalledTimes(1);
    expect(presenter.providers.path.success).toHaveBeenCalledWith();
    expect(presenter.providers.path.error).not.toHaveBeenCalled();
  });

  it('should return error path when currentViewMetadata is undefined', async () => {
    await runAction(validateDocumentSelectedForScanAction, {
      modules: {
        presenter,
      },
      state: {
        // currentViewMetadata not set - tests behavior when state path doesn't exist
        currentViewMetadata: undefined,
      },
    });

    expect(presenter.providers.path.error).toHaveBeenCalledTimes(1);
    const errorCall = presenter.providers.path.error.mock.calls[0][0];
    expect(errorCall.error).toBeInstanceOf(Error);
    expect(errorCall.error.message).toBe('No document selected for scan');
    expect(presenter.providers.path.success).not.toHaveBeenCalled();
  });

  it('should return success path when documentSelectedForScan is set', async () => {
    await runAction(validateDocumentSelectedForScanAction, {
      modules: {
        presenter,
      },
      state: {
        currentViewMetadata: {
          documentSelectedForScan: 'petition',
        },
      },
    });

    expect(presenter.providers.path.success).toHaveBeenCalledTimes(1);
    expect(presenter.providers.path.success).toHaveBeenCalledWith();
    expect(presenter.providers.path.error).not.toHaveBeenCalled();
  });

  it('should return success path when documentSelectedForScan is set to any string value', async () => {
    await runAction(validateDocumentSelectedForScanAction, {
      modules: {
        presenter,
      },
      state: {
        currentViewMetadata: {
          documentSelectedForScan: 'stin',
        },
      },
    });

    expect(presenter.providers.path.success).toHaveBeenCalledTimes(1);
    expect(presenter.providers.path.success).toHaveBeenCalledWith();
    expect(presenter.providers.path.error).not.toHaveBeenCalled();
  });
});
