import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { validateFileAction } from './validateFileAction';
import { ErrorTypes, validateFile } from '@web-client/views/FileHandlingHelpers/fileValidation';

jest.mock('@web-client/views/FileHandlingHelpers/fileValidation', () => ({
  ...jest.requireActual('@web-client/views/FileHandlingHelpers/fileValidation'),
  validateFile: jest.fn(),
}));

describe('validateFileAction', () => {
  let validStub: jest.Mock;
  let invalidStub: jest.Mock;
  const mockFile = new File(['test content'], 'test.pdf', {
    type: 'application/pdf',
  });

  beforeAll(() => {
    validStub = jest.fn();
    invalidStub = jest.fn();

    presenter.providers.applicationContext = applicationContext;
    presenter.providers.path = {
      invalid: invalidStub,
      valid: validStub,
    };
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return invalid path when no file is provided', async () => {
    await void runAction(validateFileAction, {
      modules: {
        presenter,
      },
      props: {},
    });

    expect(invalidStub).toHaveBeenCalledWith({
      errorInformation: {
        errorMessageToDisplay: 'No file selected. Please upload a file.',
        errorType: ErrorTypes.UNKNOWN,
      },
    });
    expect(validStub).not.toHaveBeenCalled();
  });

  it('should return valid path with file when validation succeeds', async () => {
    (validateFile as jest.Mock).mockResolvedValue({ isValid: true });

    await void runAction(validateFileAction, {
      modules: {
        presenter,
      },
      props: {
        file: mockFile,
      },
    });

    expect(validateFile).toHaveBeenCalledWith({
      allowedFileExtensions: ['.pdf'],
      file: mockFile,
      megabyteLimit: applicationContext.getConstants().MAX_FILE_SIZE_MB,
      skipFileTypeValidation: false,
    });
    expect(validStub).toHaveBeenCalledWith({ file: mockFile });
    expect(invalidStub).not.toHaveBeenCalled();
  });

  it('should return invalid path with error information when validation fails', async () => {
    const mockErrorInfo = {
      errorType: ErrorTypes.FILE_TOO_BIG,
      errorMessageToDisplay: 'File is too large',
      errorMessageToLog: 'File size exceeds limit',
    };

    (validateFile as jest.Mock).mockResolvedValue({
      isValid: false,
      errorInformation: mockErrorInfo,
    });

    await void runAction(validateFileAction, {
      modules: {
        presenter,
      },
      props: {
        file: mockFile,
      },
    });

    expect(validateFile).toHaveBeenCalled();
    expect(invalidStub).toHaveBeenCalledWith({
      errorInformation: mockErrorInfo,
    });
    expect(validStub).not.toHaveBeenCalled();
  });

  it('should use custom allowedFileExtensions when provided', async () => {
    (validateFile as jest.Mock).mockResolvedValue({ isValid: true });

    await void runAction(validateFileAction, {
      modules: {
        presenter,
      },
      props: {
        allowedFileExtensions: ['.doc', '.docx'],
        file: mockFile,
      },
    });

    expect(validateFile).toHaveBeenCalledWith({
      allowedFileExtensions: ['.doc', '.docx'],
      file: mockFile,
      megabyteLimit: applicationContext.getConstants().MAX_FILE_SIZE_MB,
      skipFileTypeValidation: false,
    });
  });

  it('should use custom megabyteLimit when provided', async () => {
    (validateFile as jest.Mock).mockResolvedValue({ isValid: true });

    await void runAction(validateFileAction, {
      modules: {
        presenter,
      },
      props: {
        file: mockFile,
        megabyteLimit: 10,
      },
    });

    expect(validateFile).toHaveBeenCalledWith({
      allowedFileExtensions: ['.pdf'],
      file: mockFile,
      megabyteLimit: 10,
      skipFileTypeValidation: false,
    });
  });

  it('should use skipFileTypeValidation when provided', async () => {
    (validateFile as jest.Mock).mockResolvedValue({ isValid: true });

    await void runAction(validateFileAction, {
      modules: {
        presenter,
      },
      props: {
        file: mockFile,
        skipFileTypeValidation: true,
      },
    });

    expect(validateFile).toHaveBeenCalledWith({
      allowedFileExtensions: ['.pdf'],
      file: mockFile,
      megabyteLimit: applicationContext.getConstants().MAX_FILE_SIZE_MB,
      skipFileTypeValidation: true,
    });
  });
});
