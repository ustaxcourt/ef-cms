import { validateFile, ErrorTypes } from '@web-client/views/FileHandlingHelpers/fileValidation';

/**
 * Validates a file for size, type, and PDF integrity
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.path the cerebral path which contains the next path in the sequence (path of valid or invalid)
 * @param {object} providers.props the cerebral props object containing file, allowedFileExtensions, megabyteLimit, and skipFileTypeValidation
 * @returns {object} path.valid with file or path.invalid with error information
 */
export const validateFileAction = async ({
  applicationContext,
  path,
  props,
}: ActionProps) => {
  const { MAX_FILE_SIZE_MB } = applicationContext.getConstants();
  const {
    file,
    allowedFileExtensions = ['.pdf'],
    megabyteLimit = MAX_FILE_SIZE_MB,
    skipFileTypeValidation = false,
  } = props;

  if (!file) {
    return path.invalid({
      errorInformation: {
        errorMessageToDisplay: 'No file selected. Please upload a file.',
        errorType: ErrorTypes.UNKNOWN,
      },
    });
  }

  const validationResult = await validateFile({
    allowedFileExtensions,
    file,
    megabyteLimit,
    skipFileTypeValidation,
  });

  if (validationResult.isValid) {
    return path.valid({ file });
  } else {
    return path.invalid({
      errorInformation: validationResult.errorInformation,
    });
  }
};
