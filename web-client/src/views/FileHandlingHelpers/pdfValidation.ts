import {
  ErrorTypes,
  FileValidationResponse,
} from '@web-client/views/FileHandlingHelpers/fileValidation';
import { applicationContext } from '@web-client/applicationContext';

export const PDF_PASSWORD_PROTECTED_ERROR_MESSAGE =
  'The file is encrypted or password protected. Remove encryption or password protection and try again.';
export const PDF_CORRUPTED_ERROR_MESSAGE =
  'The file is corrupted or in an unsupported PDF format. Ensure that the file is not corrupted and/or is in a supported PDF format and try again.';

const GENERIC_FILE_ERROR_MESSAGE =
  'There is a problem uploading the file. Try again later.';

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
          errorMessageToDisplay: GENERIC_FILE_ERROR_MESSAGE,
          errorMessageToLog: 'Failed to read file as ArrayBuffer.',
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
              errorMessageToDisplay: PDF_PASSWORD_PROTECTED_ERROR_MESSAGE,
              errorType: ErrorTypes.ENCRYPTED_FILE,
              isValid: false,
            });
          } else if (err.name === 'InvalidPDFException') {
            resolve({
              errorMessageToDisplay: PDF_CORRUPTED_ERROR_MESSAGE,
              errorType: ErrorTypes.CORRUPT_FILE,
              isValid: false,
            });
          }
        }
        resolve({
          errorMessageToDisplay: GENERIC_FILE_ERROR_MESSAGE,
          errorMessageToLog: 'An unknown error occurred: ${err}',
          isValid: false,
        });
      }
    };

    fileReader.onerror = () => {
      resolve({
        errorMessageToDisplay: GENERIC_FILE_ERROR_MESSAGE,
        errorMessageToLog: GENERIC_FILE_ERROR_MESSAGE,
        isValid: false,
      });
    };
  });
};
