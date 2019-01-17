import { state } from 'cerebral';
import { set } from 'cerebral/factories';

import clearAlerts from '../actions/clearAlertsAction';
import getCase from '../actions/getCaseAction';
import getUserRole from '../actions/getUserRoleAction';
import setBaseUrl from '../actions/setBaseUrlAction';
import setCase from '../actions/setCaseAction';
import setCurrentPage from '../actions/setCurrentPageAction';

export default [
  clearAlerts,
  getCase,
  setCase,
  set(state.currentTab, 'Docket Record'),
  setBaseUrl,
  getUserRole,
  {
    docketclerk: [setCurrentPage('CaseDetailInternal')],
    intakeclerk: [setCurrentPage('CaseDetailInternal')],
    petitionsclerk: [setCurrentPage('CaseDetailInternal')],
    public: [setCurrentPage('CaseDetailPublic')],
    respondent: [setCurrentPage('CaseDetailRespondent')],
    seniorattorney: [setCurrentPage('CaseDetailInternal')],
    petitioner: [setCurrentPage('CaseDetailPetitioner')],
  },
];
