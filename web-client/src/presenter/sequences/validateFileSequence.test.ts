import { CerebralTest } from 'cerebral/test';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';
import { validateFileSequence } from './validateFileSequence';
import { ErrorTypes, validateFile } from '@web-client/views/FileHandlingHelpers/fileValidation';

jest.mock('@web-client/views/FileHandlingHelpers/fileValidation', () => ({
  ...jest.requireActual('@web-client/views/FileHandlingHelpers/fileValidation'),
  validateFile: jest.fn(),
}));

describe('validateFileSequence', () => {
  let cerebralTest: ReturnType<typeof CerebralTest>;
  const mockFile = new File(['test content'], 'test.pdf', {
    type: 'application/pdf',
  });

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
    presenter.sequences = {
      validateFileSequence,
    };
    cerebralTest = CerebralTest(presenter);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not show error modal when file is valid', async () => {
    (validateFile as jest.Mock).mockResolvedValue({ isValid: true });

    await cerebralTest.runSequence('validateFileSequence', {
      file: mockFile,
    });

    expect(validateFile).toHaveBeenCalled();
    expect(cerebralTest.getState('modal.showModal')).toBeUndefined();
  });

  it('should show error modal with correct props when file validation fails', async () => {
    const mockErrorInfo = {
      errorType: ErrorTypes.FILE_TOO_BIG,
      errorMessageToDisplay: 'File is too large',
      errorMessageToLog: 'File size exceeds limit',
    };

    (validateFile as jest.Mock).mockResolvedValue({
      isValid: false,
      errorInformation: mockErrorInfo,
    });

    await cerebralTest.runSequence('validateFileSequence', {
      file: mockFile,
    });

    expect(validateFile).toHaveBeenCalled();
    expect(cerebralTest.getState('modal.title')).toBe('There is a problem with this file');
    expect(cerebralTest.getState('modal.message')).toBe('File is too large');
    expect(cerebralTest.getState('modal.showModal')).toBe('FileUploadErrorModal');
  });

  it('should show error modal when no file is provided', async () => {
    await cerebralTest.runSequence('validateFileSequence', {});

    expect(cerebralTest.getState('modal.title')).toBe('There is a problem with this file');
    expect(cerebralTest.getState('modal.message')).toBe('No file selected. Please upload a file.');
    expect(cerebralTest.getState('modal.showModal')).toBe('FileUploadErrorModal');
  });

  it('should pass custom props to validateFile', async () => {
    (validateFile as jest.Mock).mockResolvedValue({ isValid: true });

    await cerebralTest.runSequence('validateFileSequence', {
      allowedFileExtensions: ['.doc', '.docx'],
      file: mockFile,
      megabyteLimit: 10,
      skipFileTypeValidation: true,
    });

    expect(validateFile).toHaveBeenCalledWith({
      allowedFileExtensions: ['.doc', '.docx'],
      file: mockFile,
      megabyteLimit: 10,
      skipFileTypeValidation: true,
    });
  });

  it('should handle WRONG_FILE_TYPE error without troubleshooting info', async () => {
    const mockErrorInfo = {
      errorType: ErrorTypes.WRONG_FILE_TYPE,
      errorMessageToDisplay: 'Wrong file type',
    };

    (validateFile as jest.Mock).mockResolvedValue({
      isValid: false,
      errorInformation: mockErrorInfo,
    });

    await cerebralTest.runSequence('validateFileSequence', {
      file: mockFile,
    });

    expect(cerebralTest.getState('modal.showModal')).toBe('FileUploadErrorModal');
    expect(cerebralTest.getState('modal.troubleshootingInfo')).toBeUndefined();
  });

  it('should handle other error types with troubleshooting info', async () => {
    const mockErrorInfo = {
      errorType: ErrorTypes.CORRUPT_FILE,
      errorMessageToDisplay: 'File is corrupt',
    };

    (validateFile as jest.Mock).mockResolvedValue({
      isValid: false,
      errorInformation: mockErrorInfo,
    });

    await cerebralTest.runSequence('validateFileSequence', {
      file: mockFile,
    });

    expect(cerebralTest.getState('modal.showModal')).toBe('FileUploadErrorModal');
    expect(cerebralTest.getState('modal.troubleshootingInfo')).toBeDefined();
  });
});
