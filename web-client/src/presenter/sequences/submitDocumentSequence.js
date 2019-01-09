import { state } from 'cerebral';
import { set } from 'cerebral/factories';

import clearAlerts from '../actions/clearAlertsAction';
import getCase from '../actions/getCaseAction';
import setAlertSuccess from '../actions/setAlertSuccessAction';
import setAlertError from '../actions/setAlertErrorAction';
import setCase from '../actions/setCaseAction';
import setFormSubmitting from '../actions/setFormSubmittingAction';
import unsetFormSubmitting from '../actions/unsetFormSubmittingAction';
import fileRespondentDocument from '../actions/fileRespondentDocumentAction';
import getDocumentType from '../actions/getDocumentTypeAction';
import validateDocument from '../actions/validateDocumentAction';

export default [
  clearAlerts,
  validateDocument,
  {
    success: [
      setFormSubmitting,
      getDocumentType,
      {
        answer: [fileRespondentDocument],
        stipulatedDecision: [fileRespondentDocument],
      },
      getCase,
      setCase,
      setAlertSuccess,
      unsetFormSubmitting,
      set(state.currentTab, 'Docket Record'),
    ],
    error: [setAlertError],
  },
];
