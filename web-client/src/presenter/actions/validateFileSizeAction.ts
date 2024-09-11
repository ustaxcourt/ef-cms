import { validateFileSize } from '@web-client/views/FileHandlingHelpers/fileValidation';

/**
 * validates whether the given file size does not exceed the set max upload limit
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.path the cerebral path which contains the next path in the sequence (path of valid or invalid)
 * @param {object} providers.props the cerebral store used for getting the props.file
 * @returns {object} path.valid or path.invalid
 */
export const validateFileSizeAction = ({
  applicationContext,
  path,
  props,
}: ActionProps) => {
  const { MAX_FILE_SIZE_MB } = applicationContext.getConstants();
  const { file } = props;

  const fileSizeValidation = validateFileSize({
    file,
    megabyteLimit: MAX_FILE_SIZE_MB,
  });

  if (fileSizeValidation.isValid) {
    return path.valid();
  } else {
    return path.invalid();
  }
};
