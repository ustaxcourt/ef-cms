import clearAlerts from '../actions/clearAlertsAction';
import getCase from '../actions/getCaseAction';
import setBaseUrl from '../actions/setBaseUrlAction';
import setCase from '../actions/setCaseAction';
import setCurrentPage from '../actions/setCurrentPageAction';
import setDocumentId from '../actions/setDocumentIdAction';
import clearWorkItemActionMap from '../actions/clearWorkItemActionMapAction';
import clearForms from '../actions/clearFormsAction';

export default [
  clearAlerts,
  clearWorkItemActionMap,
  clearForms,
  setDocumentId,
  getCase,
  setCase,
  setBaseUrl,
  setCurrentPage('DocumentDetail'),
];
