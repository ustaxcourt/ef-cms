import { state } from 'cerebral';
import { set } from 'cerebral/factories';

import clearAlerts from '../actions/clearAlertsAction';
import getCase from '../actions/getCaseAction';
import setAlertSuccess from '../actions/setAlertSuccessAction';
import setCase from '../actions/setCaseAction';
import setFormSubmitting from '../actions/setFormSubmittingAction';
import unsetFormSubmitting from '../actions/unsetFormSubmittingAction';
import uploadDocument from '../actions/uploadDocumentAction';

export default [
  setFormSubmitting,
  clearAlerts,
  uploadDocument,
  getCase,
  setCase,
  setAlertSuccess,
  unsetFormSubmitting,
  set(state.currentTab, 'Docket Record'),
];
