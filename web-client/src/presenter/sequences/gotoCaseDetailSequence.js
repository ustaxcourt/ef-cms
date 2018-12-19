import { state } from 'cerebral';
import { set } from 'cerebral/factories';

import clearAlerts from '../actions/clearAlertsAction';
import getCase from '../actions/getCaseAction';
import getUserRole from '../actions/getUserRoleAction';
import setCase from '../actions/setCaseAction';
import setCurrentPage from '../actions/setCurrentPageAction';

export default [
  clearAlerts,
  getCase,
  setCase,
  set(state.currentTab, 'Docket Record'),
  getUserRole,
  {
    public: [setCurrentPage('CaseDetailPublic')],
    taxpayer: [setCurrentPage('CaseDetailPetitioner')],
    petitionsclerk: [setCurrentPage('CaseDetailInternal')],
    intakeclerk: [setCurrentPage('CaseDetailInternal')],
    respondent: [setCurrentPage('CaseDetailRespondent')],
  },
];
