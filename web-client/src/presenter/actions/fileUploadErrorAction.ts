import { TROUBLESHOOTING_INFO } from '@shared/business/entities/EntityConstants';
import { ErrorTypes } from '@web-client/views/FileHandlingHelpers/fileValidation';

/**
 * Prepares error props for file upload error modal
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object
 * @returns {object} error props for the modal
 */
export const fileUploadErrorAction = ({
  props,
}: ActionProps) => {
  const { errorInformation } = props;
  const errorType = errorInformation?.errorType;
  return {
    contactSupportMessage:
      'If you still have a problem uploading the file, email',
    errorToLog: errorInformation?.errorMessageToLog || errorInformation?.errorMessageToDisplay,
    message: errorInformation?.errorMessageToDisplay || 'There is a problem with this file.',
    title: 'There is a problem with this file',
    troubleshootingInfo:
      errorType && errorType !== ErrorTypes.WRONG_FILE_TYPE
        ? {
            linkMessage: 'Learn about troubleshooting files',
            linkUrl: TROUBLESHOOTING_INFO.FILE_UPLOAD_TROUBLESHOOTING_LINK,
          }
        : undefined,
  };
};
