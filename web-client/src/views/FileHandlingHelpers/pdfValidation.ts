import {
  ErrorTypes,
  FileValidationResponse,
} from '@web-client/views/FileHandlingHelpers/fileValidation';
import {
  validatePdfHeader,
  validatePermissions,
} from '@web-client/views/FileHandlingHelpers/pdfValidationHelpers';
import { getPdfJs } from '@shared/business/utilities/pdfs/getPdfJs';

export const UNSUPPORTED_BROWSER_ERROR_MESSAGE =
  'We noticed you are on an older or unsupported browser. For security reasons, this request could not be completed. \
  You can try updating the browser or using a different browser or machine. If you need help uploading \
  this document, contact DAWSON support.';

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
  const isBrowserSupported = (): boolean => {
    const ua = navigator.userAgent;

    const chromeMatch = ua.match(/Chrome\/(\d+)/);
    if (chromeMatch && parseInt(chromeMatch[1], 10) < 80) {
      return false;
    }

    const firefoxMatch = ua.match(/Firefox\/(\d+)/);
    if (firefoxMatch && parseInt(firefoxMatch[1], 10) < 70) {
      return false;
    }

    const safariMatch = ua.match(/Safari\/(\d+)/) && !ua.includes('Chrome');
    if (
      safariMatch &&
      parseInt(ua.match(/Version\/(\d+)/)?.[1] ?? '0', 10) < 16
    ) {
      return false;
    }

    // NOTE: Should we still support Internet Explorer?
    if (ua.includes('Trident/') || ua.includes('MSIE ')) {
      return false;
    }

    // Default to supported for other browsers
    return true;
  };

  if (!isBrowserSupported()) {
    return Promise.resolve({
      errorInformation: {
        errorMessageToDisplay: UNSUPPORTED_BROWSER_ERROR_MESSAGE,
        errorMessageToLog: `${UNSUPPORTED_BROWSER_ERROR_MESSAGE} (User agent: ${navigator.userAgent})`,
        errorType: ErrorTypes.UNSUPPORTED_BROWSER,
      },
      isValid: false,
    });
  }

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
        const pdfjs = await getPdfJs();
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
