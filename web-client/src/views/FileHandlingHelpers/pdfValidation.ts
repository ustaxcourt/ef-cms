import {
  ErrorTypes,
  FileValidationResponse,
} from '@web-client/views/FileHandlingHelpers/fileValidation';
import { applicationContext } from '@web-client/applicationContext';
import {
  validatePdfHeader,
  validatePermissions,
} from '@web-client/views/FileHandlingHelpers/pdfValidationHelpers';

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
          errorInformation: {
            errorMessageToDisplay: GENERIC_FILE_ERROR_MESSAGE,
            errorMessageToLog: `${GENERIC_FILE_ERROR_MESSAGE} (Failed to read file as ArrayBuffer.)`,
            errorType: ErrorTypes.UNKNOWN,
          },
          isValid: false,
        });
        return;
      }

      const fileAsArrayBuffer = new Uint8Array(result as ArrayBuffer);

      // We will try to load the PDF. If we get any errors, we will return an errorInformation object accordingly.
      try {
        // Ensure PDF has a valid header
        if (!validatePdfHeader(fileAsArrayBuffer)) {
          const corruptPdfError = new Error('PDF header is invalid');
          corruptPdfError.name = 'CorruptPDFHeaderException';
          throw corruptPdfError;
        }

        // Attempt to load the PDF to check for any errors
        const pdfjs = await applicationContext.getPdfJs();
        const document = await pdfjs.getDocument({
          data: fileAsArrayBuffer,
          isEvalSupported: false,
        }).promise;

        // Check that the PDF doesn't have password protection on edits
        if (!(await validatePermissions(document))) {
          const readOnlyError = new Error(
            'PDF has password protection on edits',
          );
          readOnlyError.name = 'ReadOnlyException';
          throw readOnlyError;
        }

        resolve({ isValid: true });
      } catch (err) {
        if (err instanceof Error) {
          if (['PasswordException', 'ReadOnlyException'].includes(err.name)) {
            resolve({
              errorInformation: {
                errorMessageToDisplay: PDF_PASSWORD_PROTECTED_ERROR_MESSAGE,
                errorMessageToLog: `${PDF_PASSWORD_PROTECTED_ERROR_MESSAGE} (${err.name})`,
                errorType: ErrorTypes.ENCRYPTED_FILE,
              },
              isValid: false,
            });
          } else if (
            ['InvalidPDFException', 'CorruptPDFHeaderException'].includes(
              err.name,
            )
          ) {
            resolve({
              errorInformation: {
                errorMessageToDisplay: PDF_CORRUPTED_ERROR_MESSAGE,
                errorMessageToLog: `${PDF_CORRUPTED_ERROR_MESSAGE} (${err.name})`,
                errorType: ErrorTypes.CORRUPT_FILE,
              },
              isValid: false,
            });
          }
        }
        resolve({
          errorInformation: {
            errorMessageToDisplay: GENERIC_FILE_ERROR_MESSAGE,
            errorMessageToLog: `${GENERIC_FILE_ERROR_MESSAGE} (An unknown error occurred: ${err})`,
            errorType: ErrorTypes.UNKNOWN,
          },
          isValid: false,
        });
      }
    };

    fileReader.onerror = () => {
      const error = fileReader?.error ?? 'Unknown error';
      resolve({
        errorInformation: {
          errorMessageToDisplay: GENERIC_FILE_ERROR_MESSAGE,
          errorMessageToLog: `${GENERIC_FILE_ERROR_MESSAGE} (FileReader encountered an error: ${error}.)`,
          errorType: ErrorTypes.UNKNOWN,
        },
        isValid: false,
      });
    };
  });
};
