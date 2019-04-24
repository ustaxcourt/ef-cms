import { set } from 'cerebral/factories';
import { state } from 'cerebral';

import { clearAlertsAction } from '../actions/clearAlertsAction';
import { getFormCombinedWithCaseDetailAction } from '../actions/getFormCombinedWithCaseDetailAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { updateCaseAction } from '../actions/updateCaseAction';
import { validateCaseDetailAction } from '../actions/validateCaseDetailAction';

import { setFormSubmittingAction } from '../actions/setFormSubmittingAction';
import { unsetFormSubmittingAction } from '../actions/unsetFormSubmittingAction';

export const clickServeToIrsSequence = [
  setFormSubmittingAction,
  clearAlertsAction,
  getFormCombinedWithCaseDetailAction,
  validateCaseDetailAction,
  {
    error: [setValidationAlertErrorsAction],
    success: [updateCaseAction, set(state.showModal, 'ServeToIrsModalDialog')],
  },
  unsetFormSubmittingAction,
];
