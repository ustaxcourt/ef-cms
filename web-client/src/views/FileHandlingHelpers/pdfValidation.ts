import { FileValidationResponse } from '@web-client/views/FileHandlingHelpers/fileValidation';
import { applicationContext } from '@web-client/applicationContext';

export const PDF_PASSWORD_PROTECTED_ERROR_MESSAGE =
  'File is encrypted or password protected. Remove encryption or password protection and try again.';
export const PDF_CORRUPTED_ERROR_MESSAGE =
  'File is corrupted or in an unsupported PDF format. Ensure the file is not corrupted and/or is in a supported PDF format and try again.';

export const validatePdf = ({
  file,
}: {
  file: File;
}): Promise<FileValidationResponse> => {
  return new Promise(resolve => {
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file);

    fileReader.onload = async () => {
      const { result } = fileReader;

      if (!result || typeof result === 'string') {
        resolve({
          errorMessage: 'Failed to read file as ArrayBuffer.',
          isValid: false,
        });
        return;
      }

      const fileAsArrayBuffer = new Uint8Array(result as ArrayBuffer);

      try {
        const pdfjs = await applicationContext.getPdfJs();
        await pdfjs.getDocument(fileAsArrayBuffer).promise;
        resolve({ isValid: true }); // Return true if the PDF is valid
      } catch (err) {
        if (err instanceof Error) {
          if (err.name === 'PasswordException') {
            resolve({
              errorMessage: PDF_PASSWORD_PROTECTED_ERROR_MESSAGE,
              isValid: false,
            });
          } else if (err.name === 'InvalidPDFException') {
            resolve({
              errorMessage: PDF_CORRUPTED_ERROR_MESSAGE,
              isValid: false,
            });
          }
        }
        console.log(err);
        resolve({ errorMessage: 'An unknown error occurred', isValid: false });
      }
    };

    fileReader.onerror = () => {
      resolve({ errorMessage: 'Error reading the file.', isValid: false });
    };
  });
};
