import { clearAlertsAction } from '../actions/clearAlertsAction';
import { closeFileUploadStatusModalAction } from '../actions/closeFileUploadStatusModalAction';
import { createCaseAction } from '../actions/createCaseAction';
import { navigateToFilePetitionSuccessAction } from '../actions/navigateToFilePetitionSuccessAction';
import { openFileUploadErrorModal } from '../actions/openFileUploadErrorModal';
import { openFileUploadStatusModalAction } from '../actions/openFileUploadStatusModalAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCaseTypeAction } from '../actions/setCaseTypeAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { validatePetitionAction } from '../actions/validatePetitionAction';

export const submitFilePetitionSequence = [
  clearAlertsAction,
  startShowValidationAction,
  validatePetitionAction,
  {
    error: [
      setAlertErrorAction,
      setValidationErrorsAction,
      setValidationAlertErrorsAction,
    ],
    success: [
      stopShowValidationAction,
      openFileUploadStatusModalAction,
      setCaseTypeAction,
      createCaseAction,
      {
        error: [openFileUploadErrorModal],
        success: [
          setCaseAction,
          closeFileUploadStatusModalAction,
          navigateToFilePetitionSuccessAction,
        ],
      },
    ],
  },
];
