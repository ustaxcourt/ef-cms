import { clearAlertsAction } from '../actions/clearAlertsAction';
import { closeFileUploadStatusModalAction } from '../actions/closeFileUploadStatusModalAction';
import { createCaseAction } from '../actions/createCaseAction';
import { getCreateCaseAlertSuccessAction } from '../actions/getCreateCaseAlertSuccessAction';
import { navigateToDashboardAction } from '../actions/navigateToDashboardAction';
import { openFileUploadErrorModal } from '../actions/openFileUploadErrorModal';
import { openFileUploadStatusModalAction } from '../actions/openFileUploadStatusModalAction';
import { set } from 'cerebral/factories';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { state } from 'cerebral';
import { validatePetitionAction } from '../actions/validatePetitionAction';

export const submitFilePetitionSequence = [
  clearAlertsAction,
  set(state.showValidation, true),
  validatePetitionAction,
  {
    error: [
      setAlertErrorAction,
      setValidationErrorsAction,
      setValidationAlertErrorsAction,
    ],
    success: [
      set(state.showValidation, false),
      openFileUploadStatusModalAction,
      createCaseAction,
      {
        error: [openFileUploadErrorModal],
        success: [
          setCaseAction,
          closeFileUploadStatusModalAction,
          getCreateCaseAlertSuccessAction,
          setAlertSuccessAction,
          set(state.saveAlertsForNavigation, true),
          navigateToDashboardAction,
        ],
      },
    ],
  },
];
