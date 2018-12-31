import clearAlerts from '../actions/clearAlertsAction';
import getCase from '../actions/getCaseAction';
import setBaseUrl from '../actions/setBaseUrlAction';
import setCase from '../actions/setCaseAction';
import setCurrentPage from '../actions/setCurrentPageAction';
import setDocumentId from '../actions/setDocumentIdAction';

export default [
  clearAlerts,
  setDocumentId,
  getCase,
  setCase,
  setBaseUrl,
  setCurrentPage('DocumentDetail'),
];
