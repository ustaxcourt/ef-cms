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
  getUserRole,
  {
    taxpayer: [setCurrentPage('CaseDetail')],
    petitionsclerk: [setCurrentPage('ValidateCase')],
    intakeclerk: [setCurrentPage('ValidateCase')],
    irsattorney: [setCurrentPage('CaseDetail')], // TODO: display different dashboard maybe?
  },
];
