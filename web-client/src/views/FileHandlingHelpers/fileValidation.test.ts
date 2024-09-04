import { validateFile } from '@web-client/views/FileHandlingHelpers/fileValidation';
import { validatePDFUpload } from './pdfValidation';

jest.mock('./pdfValidation', () => ({
  validatePDFUpload: jest.fn(), // Mock the validatePDF function
}));

describe('fileValidation', () => {
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
    expect(validatePDFUpload).toHaveBeenCalled();
  });
  it('should return valid for valid PDF', async () => {
    const file = new File([], 'test.pdf', { type: 'application/pdf' });
    const allowedFileExtensions = ['.pdf'];
    const megabyteLimit = 250;
    (validatePDFUpload as jest.Mock).mockReturnValue({ isValid: true });
    const validationResult = await validateFile({
      allowedFileExtensions,
      file,
      megabyteLimit,
    });
    expect(validationResult).toMatchObject({ isValid: true });
  });
});
