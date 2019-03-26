import { state } from 'cerebral';
import { set } from 'cerebral/factories';

import { clearAlertsAction } from '../actions/clearAlertsAction';
import { computeFormDateAction } from '../actions/computeFormDateAction';
import { createCaseFromPaperAction } from '../actions/createCaseFromPaperAction';
import { getCreateCaseAlertSuccessAction } from '../actions/getCreateCaseAlertSuccessAction';
import { navigateToDashboardAction } from '../actions/navigateToDashboardAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setFormSubmittingAction } from '../actions/setFormSubmittingAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { unsetFormSubmittingAction } from '../actions/unsetFormSubmittingAction';
import { validatePetitionFromPaperAction } from '../actions/validatePetitionFromPaperAction';

export const submitPetitionFromPaperSequence = [
  clearAlertsAction,
  set(state.showValidation, true),
  computeFormDateAction,
  validatePetitionFromPaperAction,
  {
    error: [
      setAlertErrorAction,
      setValidationErrorsAction,
      setValidationAlertErrorsAction,
      unsetFormSubmittingAction,
    ],
    success: [
      set(state.showValidation, false),
      setFormSubmittingAction,
      createCaseFromPaperAction,
      setCaseAction,
      getCreateCaseAlertSuccessAction,
      setAlertSuccessAction,
      unsetFormSubmittingAction,
      navigateToDashboardAction,
    ],
  },
];
