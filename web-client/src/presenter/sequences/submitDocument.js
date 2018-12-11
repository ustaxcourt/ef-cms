import { state } from 'cerebral';
import { set } from 'cerebral/factories';

import clearAlerts from '../actions/clearAlerts';
import getCase from '../actions/getCase';
import setAlertSuccess from '../actions/setAlertSuccess';
import setCase from '../actions/setCase';
import setFormSubmitting from '../actions/setFormSubmitting';
import unsetFormSubmitting from '../actions/unsetFormSubmitting';
import uploadDocument from '../actions/uploadDocument';

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
