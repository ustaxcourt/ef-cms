import { toggle } from 'cerebral/factories';
import { state } from 'cerebral';

import clearAlerts from '../actions/clearAlertsAction';
import setValidationAlertErrorsAction from '../actions/setValidationAlertErrorsAction';
import validateCaseDetail from '../actions/validateCaseDetailAction';

export default [
  clearAlerts,
  validateCaseDetail,
  {
    success: [toggle(state.showModal)],
    error: [setValidationAlertErrorsAction],
  },
];
