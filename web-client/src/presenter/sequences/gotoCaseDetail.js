import { state } from 'cerebral';
import { set } from 'cerebral/factories';

import clearAlerts from '../actions/clearAlerts';
import getCase from '../actions/getCase';
import getUserRole from '../actions/getUserRole';
import setCase from '../actions/setCase';
import setCurrentPage from '../actions/setCurrentPage';

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
