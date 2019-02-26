import { state } from 'cerebral';
import { set } from 'cerebral/factories';

import { clearAlertsAction } from '../actions/clearAlertsAction';
import { computeIrsNoticeDateAction } from '../actions/computeIrsNoticeDateAction';
import { createCaseAction } from '../actions/createCaseAction';
import { getCreateCaseAlertSuccessAction } from '../actions/getCreateCaseAlertSuccessAction';
import { navigateToDashboardAction } from '../actions/navigateToDashboardAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setFormSubmittingAction } from '../actions/setFormSubmittingAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { unsetFormSubmittingAction } from '../actions/unsetFormSubmittingAction';
import { validatePetitionAction } from '../actions/validatePetitionAction';

export const submitFilePetitionSequence = [
  clearAlertsAction,
  set(state.showValidation, true),
  computeIrsNoticeDateAction,
  validatePetitionAction,
  {
    success: [
      set(state.showValidation, false),
      setFormSubmittingAction,
      createCaseAction,
      getCreateCaseAlertSuccessAction,
      setAlertSuccessAction,
      unsetFormSubmittingAction,
      navigateToDashboardAction,
    ],
    error: [
      setAlertErrorAction,
      setValidationErrorsAction,
      setValidationAlertErrorsAction,
      unsetFormSubmittingAction,
    ],
  },
];
