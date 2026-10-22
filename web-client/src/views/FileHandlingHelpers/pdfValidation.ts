import {
  ErrorTypes,
  FileValidationResponse,
} from '@web-client/views/FileHandlingHelpers/fileValidation';
import {
  validatePdfHeader,
  validatePermissions,
} from '@web-client/views/FileHandlingHelpers/pdfValidationHelpers';
import { getPdfJs } from '@shared/business/utilities/pdfs/getPdfJs';
import {
  hasDuplicateObjectNumbers,
  hasRaisedGenerationHeader,
} from '@shared/business/utilities/pdfs/hasDuplicateObjectNumbers';

export const UNSUPPORTED_BROWSER_ERROR_MESSAGE =
  'Your internet browser is unsupported. Please update your browser and try again.';

export const PDF_PASSWORD_PROTECTED_ERROR_MESSAGE =
  'The file is encrypted or password protected. Remove encryption or password protection and try again.';
export const PDF_CORRUPTED_ERROR_MESSAGE =
  'The file is corrupted or in an unsupported PDF format. Ensure that the file is not corrupted and/or is in a supported PDF format and try again.';

const GENERIC_FILE_ERROR_MESSAGE =
  'There is a problem uploading the file. Try again later.';

// A function, not a constant: ErrorTypes is unset while these two modules load each other.
const duplicateObjectNumberError = (): FileValidationResponse => ({
  errorInformation: {
    errorMessageToDisplay: PDF_CORRUPTED_ERROR_MESSAGE,
    errorMessageToLog: `${PDF_CORRUPTED_ERROR_MESSAGE} (DuplicateObjectNumberException)`,
    errorType: ErrorTypes.CORRUPT_FILE,
  },
  isValid: false,
});

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
        console.error(
          `FileReader result is invalid for file: ${file.name}. Result: ${result}`,
        );
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
        // pdf.js takes ownership of this buffer, so keep a copy for later use.
        const bytesForRevisionCheck = hasRaisedGenerationHeader(
          fileAsArrayBuffer,
        )
          ? fileAsArrayBuffer.slice()
          : undefined;

        const pdfjs = await getPdfJs();
        const document = await pdfjs.getDocument({
          data: fileAsArrayBuffer,
        }).promise;

        // Check that the PDF doesn't have password protection on edits
        if (!(await validatePermissions(document))) {
          const readOnlyError = new Error(
            'PDF has password protection on edits',
          );
          readOnlyError.name = 'ReadOnlyException';
          throw readOnlyError;
        }

        // Valid to every reader, but our save path rewrites it into a broken file.
        if (
          bytesForRevisionCheck &&
          (await hasDuplicateObjectNumbers(bytesForRevisionCheck, {
            alreadyScreened: true,
          }))
        ) {
          resolve(duplicateObjectNumberError());

          return;
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
          } else if (['UnsupportedBrowserException'].includes(err.name)) {
            resolve({
              errorInformation: {
                errorMessageToDisplay: UNSUPPORTED_BROWSER_ERROR_MESSAGE,
                errorMessageToLog: `${UNSUPPORTED_BROWSER_ERROR_MESSAGE} (User agent: ${navigator.userAgent})`,
                errorType: ErrorTypes.UNSUPPORTED_BROWSER,
              },
              isValid: false,
            });
            return;
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

/** For inputs that skip the checks above: still refuse a PDF our upload would break. */
export const validatePdfSurvivesUpload = async ({
  file,
}: {
  file: File;
}): Promise<FileValidationResponse> => {
  let bytes: Uint8Array;
  try {
    bytes = new Uint8Array(await file.arrayBuffer());
  } catch (error) {
    return {
      errorInformation: {
        errorMessageToDisplay: GENERIC_FILE_ERROR_MESSAGE,
        errorMessageToLog: `${GENERIC_FILE_ERROR_MESSAGE} (Failed to read file: ${error}.)`,
        errorType: ErrorTypes.UNKNOWN,
      },
      isValid: false,
    };
  }

  return (await hasDuplicateObjectNumbers(bytes))
    ? duplicateObjectNumberError()
    : { isValid: true };
};
