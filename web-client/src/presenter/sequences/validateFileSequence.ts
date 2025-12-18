import { TROUBLESHOOTING_INFO } from '@shared/business/entities/EntityConstants';
import { logErrorAction } from '../actions/logErrorAction';
import { openFileUploadErrorModal } from '../actions/openFileUploadErrorModal';
import { setErrorModalTroubleshootingStepsAction } from '../actions/setErrorModalTroubleshootingStepsAction';
import { setModalMessageAction } from '../actions/setModalMessageAction';
import { setModalTitleAction } from '../actions/setModalTitleAction';
import { validateFileAction } from '../actions/validateFileAction';
import { ErrorTypes } from '../../views/FileHandlingHelpers/fileValidation';

/**
 * Sequence to validate a file and show error modal if validation fails
 */
export const validateFileSequence = [
  validateFileAction,
  {
    invalid: [
      ({ props }: ActionProps) => {
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
      },
      setModalTitleAction,
      setModalMessageAction,
      setErrorModalTroubleshootingStepsAction,
      logErrorAction,
      openFileUploadErrorModal,
    ],
    valid: [],
  },
] as unknown as (props: {
  file: File;
  allowedFileExtensions?: string[];
  megabyteLimit?: number;
  skipFileTypeValidation?: boolean;
}) => Promise<{ file: File } | void>;
