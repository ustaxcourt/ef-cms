import { set } from 'cerebral/factories';
import { state } from 'cerebral';

import { clearAlertsAction } from '../actions/clearAlertsAction';
import getFormCombinedWithCaseDetail from '../actions/getFormCombinedWithCaseDetailAction';
import setValidationAlertErrorsAction from '../actions/setValidationAlertErrorsAction';
import validateCaseDetail from '../actions/validateCaseDetailAction';

export const clickServeToIrsSequence = [
  clearAlertsAction,
  getFormCombinedWithCaseDetail,
  validateCaseDetail,
  {
    success: [set(state.showModal, 'ServeToIrsModalDialog')],
    error: [setValidationAlertErrorsAction],
  },
];
