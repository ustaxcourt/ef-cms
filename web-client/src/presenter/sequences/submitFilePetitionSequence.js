import { state } from 'cerebral';
import { set } from 'cerebral/factories';

import { clearAlertsAction } from '../actions/clearAlertsAction';
import { createCaseAction } from '../actions/createCaseAction';
import { getCreateCaseAlertSuccess } from '../actions/getCreateCaseAlertSuccessAction';
import { navigateToDashboard } from '../actions/navigateToDashboardAction';
import { setAlertError } from '../actions/setAlertErrorAction';
import { setAlertSuccess } from '../actions/setAlertSuccessAction';
import { setFormSubmitting } from '../actions/setFormSubmittingAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { unsetFormSubmitting } from '../actions/unsetFormSubmittingAction';
import { validatePetition } from '../actions/validatePetitionAction';

export const submitFilePetitionSequence = [
  clearAlertsAction,
  set(state.showValidation, true),
  validatePetition,
  {
    success: [
      set(state.showValidation, false),
      setFormSubmitting,
      createCaseAction,
      getCreateCaseAlertSuccess,
      setAlertSuccess,
      unsetFormSubmitting,
      navigateToDashboard,
    ],
    error: [
      setAlertError,
      setValidationErrorsAction,
      setValidationAlertErrorsAction,
      unsetFormSubmitting,
    ],
  },
];
