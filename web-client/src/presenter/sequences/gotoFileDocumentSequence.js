import clearAlerts from '../actions/clearAlertsAction';
import clearDocument from '../actions/clearDocumentAction';
import setCurrentPage from '../actions/setCurrentPageAction';
import getCase from '../actions/getCaseAction';
import getUserRole from '../actions/getUserRoleAction';
import setCase from '../actions/setCaseAction';

export default [
  clearAlerts,
  clearDocument,
  getCase,
  setCase,
  getUserRole,
  {
    respondent: [setCurrentPage('FileDocument')],
  },
];
