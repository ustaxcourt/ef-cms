import * as fileValidation from './fileValidation';
import * as pdfValidation from './pdfValidation';
import { validateFile, validateFileOnSelect } from './fileValidation';
import { validatePdf } from './pdfValidation';

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

    expect(onError).toHaveBeenCalledWith({ message: 'No file selected' });
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it('should call onError with the validation error message when the file is invalid', async () => {
    (validateFile as jest.Mock).mockResolvedValue({
      errorMessage:
        'File is not a PDF. Select a PDF file or resave the file as a PDF.',
      isValid: false,
    });
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
      message:
        'File is not a PDF. Select a PDF file or resave the file as a PDF.',
    });
    expect(onSuccess).not.toHaveBeenCalled();
    expect(event.target.value).toBe('');
  });

  it('should call onSuccess with the file when the file is valid', async () => {
    (validateFile as jest.Mock).mockResolvedValue({
      isValid: true,
    });
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
});

describe('fileValidation', () => {
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
    expect(validationResult.errorMessage).toBe(
      'File is not a PDF. Select a PDF file or resave the file as a PDF.',
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
    expect(validationResult.errorMessage).toBe(
      'File is not in a supported format (.pdf, .doc, .docx). Select a different file or resave it in a supported format.',
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
    expect(validationResult.errorMessage).toBe(
      `Your file size is too big. The maximum file size is ${megabyteLimit}MB.`,
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
