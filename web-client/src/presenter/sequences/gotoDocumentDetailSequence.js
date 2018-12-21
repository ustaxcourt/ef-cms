import clearAlerts from '../actions/clearAlertsAction';
import getCase from '../actions/getCaseAction';
import setCase from '../actions/setCaseAction';
import setDocumentId from '../actions/setDocumentIdAction';
import setCurrentPage from '../actions/setCurrentPageAction';

export default [
  clearAlerts,
  setDocumentId,
  getCase,
  setCase,
  setCurrentPage('DocumentDetail'),
];
