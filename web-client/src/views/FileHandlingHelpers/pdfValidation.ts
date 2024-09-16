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

      // eslint-disable-next-line spellcheck/spell-checker
      // As of 2024 September, pdfjs can sometimes render PDFs with invalid characters,
      // and it only indicates this by logging a warning via console.log.
      // These PDFs are corrupt and should not be allowed to be uploaded.
      // Therefore, to catch these warnings, we will temporarily override console.log.
      const consoleLog = console.log;

      // We will try to load the PDF. If we get any errors, we will return an errorInformation object accordingly.
      try {
        let pdfIsCorrupt = false;
        // We will listen for invalid hex string warnings logged by pdfjs, which indicate a corrupt PDF
        console.log = message => {
          consoleLog(message);
          if (message.includes('Warning: getHexString')) {
            pdfIsCorrupt = true;
          }
        };

        // Attempt to load the PDF
        const pdfjs = await applicationContext.getPdfJs();
        await pdfjs.getDocument({
          data: fileAsArrayBuffer,
          isEvalSupported: false,
        }).promise;

        // We raise a custom error even if the load was successful
        // when invalid hex string warnings were caught
        if (pdfIsCorrupt) {
          const corruptPdfError = new Error('PDF has invalid characters');
          corruptPdfError.name = 'CorruptPDFException';
          throw corruptPdfError;
        }

        resolve({ isValid: true });
      } catch (err) {
        if (err instanceof Error) {
          if (err.name === 'PasswordException') {
            resolve({
              errorInformation: {
                errorMessageToDisplay: PDF_PASSWORD_PROTECTED_ERROR_MESSAGE,
                errorType: ErrorTypes.ENCRYPTED_FILE,
              },
              isValid: false,
            });
          } else if (
            ['InvalidPDFException', 'CorruptPDFException'].includes(err.name)
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
      } finally {
        console.log = consoleLog;
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
