import * as fileValidation from './fileValidation';
import * as pdfValidation from './pdfValidation';
import { TROUBLESHOOTING_INFO } from '@shared/business/entities/EntityConstants';
import {
  validateFile,
  validateFileOnSelect,
  validateFileSize,
} from './fileValidation';
import { validatePdf } from './pdfValidation';

describe('validateFileSize', () => {
  it('should reject a file that is too big', () => {
    const maxFileSize = 5;
    const blob = new Blob([new ArrayBuffer((maxFileSize + 1) * 1024 * 1024)], {
      type: 'application/pdf',
    });
    const file = new File([blob], 'test.pdf');
    const validationResult = validateFileSize({
      file,
      megabyteLimit: maxFileSize,
    });
    expect(validationResult.isValid).toBe(false);
  });

  it('should accept a file that is not too big', () => {
    const maxFileSize = 5;
    const blob = new Blob([new ArrayBuffer(maxFileSize * 1024 * 1024)], {
      type: 'application/pdf',
    });
    const file = new File([blob], 'test.pdf');
    const validationResult = validateFileSize({
      file,
      megabyteLimit: maxFileSize,
    });
    expect(validationResult.isValid).toBe(true);
  });
});

describe('validateFileOnSelect', () => {
  beforeEach(() => {
    jest.spyOn(fileValidation, 'validateFile').mockImplementation(jest.fn());
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should call onError with "No file selected" when no file is selected', async () => {
    const onError = jest.fn();
    const onSuccess = jest.fn();
    const event = {
      target: { files: [] }, // No files selected
    } as unknown as React.ChangeEvent<HTMLInputElement>;

    await validateFileOnSelect({
      allowedFileExtensions: ['.pdf'],
      e: event,
      megabyteLimit: 5,
      onError,
      onSuccess,
    });

    expect(onError).toHaveBeenCalledWith({
      messageToDisplay: 'No file selected. Please upload a file.',
    });
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it('should call onError with the validation error message when the file is invalid', async () => {
    const onError = jest.fn();
    const onSuccess = jest.fn();
    const event = {
      target: {
        files: [
          new File(['dummy content'], 'test.txt', { type: 'text/plain' }),
        ],
      },
    } as unknown as React.ChangeEvent<HTMLInputElement>;

    await validateFileOnSelect({
      allowedFileExtensions: ['.pdf'],
      e: event,
      megabyteLimit: 5,
      onError,
      onSuccess,
    });

    expect(onError).toHaveBeenCalledWith({
      errorType: fileValidation.ErrorTypes.WRONG_FILE_TYPE,
      messageToDisplay:
        'The file is not a PDF. Select a PDF file or resave the file as a PDF.',
    });
    expect(onSuccess).not.toHaveBeenCalled();
    expect(event.target.value).toBe('');
  });

  it('should call onSuccess with the file when the file is valid', async () => {
    const mockFile = new File(['dummy content'], 'test.txt', {
      type: 'text/plain',
    });
    const onError = jest.fn();
    const onSuccess = jest.fn();
    const event = {
      target: {
        files: [mockFile],
        value: 'test.txt',
      },
    } as unknown as React.ChangeEvent<HTMLInputElement>;

    await validateFileOnSelect({
      allowedFileExtensions: ['.txt'],
      e: event,
      megabyteLimit: 5,
      onError,
      onSuccess,
    });

    expect(onError).not.toHaveBeenCalled();
    expect(onSuccess).toHaveBeenCalledWith(
      expect.objectContaining({
        selectedFile: mockFile,
      }),
    );
    expect(event.target.value).toBe('test.txt');
  });

  it('should call onSuccess with a file of incorrect type when skipFileTypeValidation is true', async () => {
    const mockFile = new File(['dummy content'], 'test.txt', {
      type: 'text/plain',
    });
    const onError = jest.fn();
    const onSuccess = jest.fn();
    const event = {
      target: {
        files: [mockFile],
        value: 'test.txt',
      },
    } as unknown as React.ChangeEvent<HTMLInputElement>;

    await validateFileOnSelect({
      allowedFileExtensions: ['.pdf'],
      e: event,
      megabyteLimit: 5,
      onError,
      onSuccess,
      skipFileTypeValidation: true,
    });

    expect(onError).not.toHaveBeenCalled();
    expect(onSuccess).toHaveBeenCalledWith(
      expect.objectContaining({
        selectedFile: mockFile,
      }),
    );
    expect(event.target.value).toBe('test.txt');
  });
});

describe('validateFile', () => {
  beforeEach(() => {
    jest.spyOn(pdfValidation, 'validatePdf').mockImplementation(jest.fn());
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return invalid with error message for improper file with one allowed extension', async () => {
    const file = new File([], 'test.csv');
    const allowedFileExtensions = ['.pdf'];

    const validationResult = await validateFile({
      allowedFileExtensions,
      file,
      megabyteLimit: 250,
    });

    expect(validationResult.isValid).toBe(false);
    expect(validationResult.errorInformation?.errorMessageToDisplay).toBe(
      'The file is not a PDF. Select a PDF file or resave the file as a PDF.',
    );
  });

  it('should return invalid with error message for improper file multiple allowed extensions', async () => {
    const file = new File([], 'test.csv');
    const allowedFileExtensions = ['.pdf', '.doc', '.docx'];

    const validationResult = await validateFile({
      allowedFileExtensions,
      file,
      megabyteLimit: 250,
    });

    expect(validationResult.isValid).toBe(false);
    expect(validationResult.errorInformation?.errorMessageToDisplay).toBe(
      'The file is not in a supported format (.pdf, .doc, .docx). Select a different file or resave it in a supported format.',
    );
  });

  it('should return invalid with error message for file too big', async () => {
    const file = new File([], 'test.csv');
    const allowedFileExtensions = ['.pdf', '.doc', '.docx'];
    const megabyteLimit = -1;

    const validationResult = await validateFile({
      allowedFileExtensions,
      file,
      megabyteLimit,
    });

    expect(validationResult.isValid).toBe(false);
    expect(validationResult.errorInformation?.errorMessageToDisplay).toBe(
      `The file size is too big. The maximum file size is ${megabyteLimit}MB. Reduce the file size and try again.`,
    );
  });

  it('should call pdf validation for a pdf', async () => {
    const file = new File([], 'test.pdf', { type: 'application/pdf' });
    const allowedFileExtensions = ['.pdf'];
    const megabyteLimit = 250;

    await validateFile({
      allowedFileExtensions,
      file,
      megabyteLimit,
    });

    expect(validatePdf).toHaveBeenCalled();
  });

  it('should not validate file type if skipFileTypeValidation is passed', async () => {
    const file = new File([], 'test.pdf', { type: 'application/pdf' });
    const allowedFileExtensions = ['.csv'];
    const megabyteLimit = 250;
    (validatePdf as jest.Mock).mockReturnValue({ isValid: true });

    const validationResult = await validateFile({
      allowedFileExtensions,
      file,
      megabyteLimit,
      skipFileTypeValidation: true,
    });

    expect(validationResult).toMatchObject({ isValid: true });
  });

  it('BUG: should return valid for valid file with uppercase extension', async () => {
    const file = new File([], 'test.TXT');
    const allowedFileExtensions = ['.txt'];
    const megabyteLimit = 250;

    const validationResult = await validateFile({
      allowedFileExtensions,
      file,
      megabyteLimit,
    });

    expect(validationResult).toMatchObject({ isValid: true });
  });

  it('should return valid for valid PDF', async () => {
    const file = new File([], 'test.pdf', { type: 'application/pdf' });
    const allowedFileExtensions = ['.pdf'];
    const megabyteLimit = 250;
    (validatePdf as jest.Mock).mockReturnValue({ isValid: true });

    const validationResult = await validateFile({
      allowedFileExtensions,
      file,
      megabyteLimit,
    });

    expect(validationResult).toMatchObject({ isValid: true });
  });
});

describe('getFileExtension', () => {
  it('should get correct file extension for .pdf file', () => {
    expect(fileValidation.getFileExtension('test.pdf')).toBe('.pdf');
  });
  it('should get correct file extension for .PDF file (case insensitive)', () => {
    expect(fileValidation.getFileExtension('test.PDF')).toBe('.pdf');
  });
  it('should get correct file extension when file has multiple periods', () => {
    expect(fileValidation.getFileExtension('test.pdf.txt')).toBe('.txt');
  });
  it('should get no file extension for a file without a file extension', () => {
    expect(fileValidation.getFileExtension('test')).toBe('');
  });
});

describe('genericOnValidationErrorHandler', () => {
  it('should call error modal sequence with correct arguments for an error that is not wrong file type', () => {
    const mockFunc = jest.fn();
    fileValidation.genericOnValidationErrorHandler({
      errorType: fileValidation.ErrorTypes.CORRUPT_FILE,
      messageToDisplay: 'messageToDisplayTest',
      messageToLog: 'messageToLogTest',
      showFileUploadErrorModalSequence: mockFunc,
    });
    expect(mockFunc).toHaveBeenCalledWith({
      contactSupportMessage:
        'If you still have a problem uploading the file, email',
      errorToLog: 'messageToLogTest',
      message: 'messageToDisplayTest',
      title: 'There Is a Problem With This File',
      troubleshootingInfo: {
        linkMessage: 'Learn about troubleshooting files',
        linkUrl: TROUBLESHOOTING_INFO.FILE_UPLOAD_TROUBLESHOOTING_LINK,
      },
    });
  });

  it('should call error modal sequence with correct arguments for wrong file type error', () => {
    const mockFunc = jest.fn();
    fileValidation.genericOnValidationErrorHandler({
      errorType: fileValidation.ErrorTypes.WRONG_FILE_TYPE,
      messageToDisplay: 'messageToDisplayTest',
      messageToLog: 'messageToLogTest',
      showFileUploadErrorModalSequence: mockFunc,
    });
    expect(mockFunc).toHaveBeenCalledWith({
      contactSupportMessage:
        'If you still have a problem uploading the file, email',
      errorToLog: 'messageToLogTest',
      message: 'messageToDisplayTest',
      title: 'There Is a Problem With This File',
    });
  });
});
