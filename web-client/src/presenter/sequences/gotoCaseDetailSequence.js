import { set } from 'cerebral/factories';
import { state } from 'cerebral';

import { clearAlertsAction } from '../actions/clearAlertsAction';
import { getCaseAction } from '../actions/getCaseAction';
import { getUserRoleAction } from '../actions/getUserRoleAction';
import { setBaseUrlAction } from '../actions/setBaseUrlAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';

export const gotoCaseDetailSequence = [
  setCurrentPageAction('Interstitial'),
  clearAlertsAction,
  getCaseAction,
  setCaseAction,
  set(state.documentDetail.tab, 'docketRecord'),
  setBaseUrlAction,
  getUserRoleAction,
  {
    docketclerk: [setCurrentPageAction('CaseDetailInternal')],
    intakeclerk: [setCurrentPageAction('CaseDetailInternal')],
    petitioner: [setCurrentPageAction('CaseDetail')],
    petitionsclerk: [setCurrentPageAction('CaseDetailInternal')],
    practitioner: [setCurrentPageAction('CaseDetail')],
    respondent: [setCurrentPageAction('CaseDetail')],
    seniorattorney: [setCurrentPageAction('CaseDetailInternal')],
  },
];
