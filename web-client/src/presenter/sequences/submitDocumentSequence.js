import { state } from 'cerebral';
import { set } from 'cerebral/factories';

import clearAlerts from '../actions/clearAlertsAction';
import getCase from '../actions/getCaseAction';
import setAlertSuccess from '../actions/setAlertSuccessAction';
import setCase from '../actions/setCaseAction';
import setFormSubmitting from '../actions/setFormSubmittingAction';
import unsetFormSubmitting from '../actions/unsetFormSubmittingAction';
import fileRespondentDocument from '../actions/fileRespondentDocumentAction';
import fileGenericDocument from '../actions/fileGenericDocumentAction';
import getDocumentType from '../actions/getDocumentTypeAction';

export default [
  setFormSubmitting,
  clearAlerts,
  getDocumentType,
  {
    answer: [fileRespondentDocument],
    stipulatedDecision: [fileRespondentDocument],
    generic: [fileGenericDocument],
  },
  getCase,
  setCase,
  setAlertSuccess,
  unsetFormSubmitting,
  set(state.currentTab, 'Docket Record'),
];
