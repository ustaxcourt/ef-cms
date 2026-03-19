import { logErrorAction } from '@web-client/presenter/actions/logErrorAction';
import { openFileUploadErrorModal } from '@web-client/presenter/actions/openFileUploadErrorModal';
import { fileUploadErrorAction } from '@web-client/presenter/actions/fileUploadErrorAction';
import { setErrorModalTroubleshootingStepsAction } from '@web-client/presenter/actions/setErrorModalTroubleshootingStepsAction';
import { setModalMessageAction } from '@web-client/presenter/actions/setModalMessageAction';
import { setModalTitleAction } from '@web-client/presenter/actions/setModalTitleAction';
import { validateFileAction } from '@web-client/presenter/actions/validateFileAction';

/**
 * Sequence to validate a file and show error modal if validation fails
 */
export const validateFileSequence = [
  validateFileAction,
  {
    invalid: [
      fileUploadErrorAction,
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
