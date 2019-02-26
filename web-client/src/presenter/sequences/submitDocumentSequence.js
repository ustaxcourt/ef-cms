import { state } from 'cerebral';
import { set } from 'cerebral/factories';

import { clearAlertsAction } from '../actions/clearAlertsAction';
import { fileRespondentDocumentAction } from '../actions/fileRespondentDocumentAction';
import { getCaseAction } from '../actions/getCaseAction';
import { getDocumentTypeAction } from '../actions/getDocumentTypeAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setFormSubmittingAction } from '../actions/setFormSubmittingAction';
import { unsetFormSubmittingAction } from '../actions/unsetFormSubmittingAction';

export const submitDocumentSequence = [
  clearAlertsAction,
  setFormSubmittingAction,
  getDocumentTypeAction,
  {
    answer: [fileRespondentDocumentAction],
    stipulatedDecision: [fileRespondentDocumentAction],
  },
  getCaseAction,
  setCaseAction,
  setAlertSuccessAction,
  unsetFormSubmittingAction,
  set(state.currentTab, 'Docket Record'),
];
