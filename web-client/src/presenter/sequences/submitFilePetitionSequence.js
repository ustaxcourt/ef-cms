import { set } from 'cerebral/factories';
import { state } from 'cerebral';

import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearModalAction } from '../actions/clearModalAction';
import { computeIrsNoticeDateAction } from '../actions/computeIrsNoticeDateAction';
import { createCaseAction } from '../actions/createCaseAction';
import { getCreateCaseAlertSuccessAction } from '../actions/getCreateCaseAlertSuccessAction';
import { navigateToDashboardAction } from '../actions/navigateToDashboardAction';
import { openFileUploadStatusModalAction } from '../actions/openFileUploadStatusModalAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { validatePetitionAction } from '../actions/validatePetitionAction';

export const submitFilePetitionSequence = [
  clearAlertsAction,
  set(state.showValidation, true),
  computeIrsNoticeDateAction,
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
      setCaseAction,
      getCreateCaseAlertSuccessAction,
      setAlertSuccessAction,
      clearModalAction,
      navigateToDashboardAction,
    ],
  },
];
