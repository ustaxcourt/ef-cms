import { toggle } from 'cerebral/factories';
import { state } from 'cerebral';

import clearAlerts from '../actions/clearAlertsAction';
import getFormCombinedWithCaseDetail from '../actions/getFormCombinedWithCaseDetailAction';
import setValidationAlertErrorsAction from '../actions/setValidationAlertErrorsAction';
import validateCaseDetail from '../actions/validateCaseDetailAction';

export default [
  clearAlerts,
  getFormCombinedWithCaseDetail,
  validateCaseDetail,
  {
    success: [toggle(state.showModal)],
    error: [setValidationAlertErrorsAction],
  },
];
