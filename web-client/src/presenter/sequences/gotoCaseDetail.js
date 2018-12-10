import { state } from 'cerebral';
import { set } from 'cerebral/factories';

import clearAlerts from '../actions/clearAlerts';
import getCase from '../actions/getCase';
import getUserRole from '../actions/getUserRole';
import setBaseUrl from '../actions/setBaseUrl';
import setCase from '../actions/setCase';
import setCurrentPage from '../actions/setCurrentPage';

export default [
  setBaseUrl,
  clearAlerts,
  getCase,
  setCase,
  set(state.currentTab, 'Docket Record'),
  getUserRole,
  {
    taxpayer: [setCurrentPage('CaseDetailPetitioner')],
    petitionsclerk: [setCurrentPage('CaseDetailInternal')],
    intakeclerk: [setCurrentPage('CaseDetailInternal')],
    respondent: [setCurrentPage('CaseDetailPetitioner')], // TODO: display different dashboard maybe?
  },
];
