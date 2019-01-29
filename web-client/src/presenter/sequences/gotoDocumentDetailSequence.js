import clearAlerts from '../actions/clearAlertsAction';
import clearForms from '../actions/clearFormsAction';
import clearWorkItemActionMap from '../actions/clearWorkItemActionMapAction';
import getCase from '../actions/getCaseAction';
import getInternalUsers from '../actions/getInternalUsersAction';
import setBaseUrl from '../actions/setBaseUrlAction';
import setCase from '../actions/setCaseAction';
import setCurrentPage from '../actions/setCurrentPageAction';
import setDefaultDocumentDetailTab from '../actions/setDefaultDocumentDetailTabAction';
import setDocumentId from '../actions/setDocumentIdAction';
import setFormForCaseAction from '../actions/setFormForCaseAction';
import setInternalUsers from '../actions/setInternalUsersAction';

export default [
  clearAlerts,
  clearWorkItemActionMap,
  clearForms,
  setDocumentId,
  getCase,
  setCase,
  setFormForCaseAction,
  setBaseUrl,
  getInternalUsers,
  setInternalUsers,
  setDefaultDocumentDetailTab,
  setCurrentPage('DocumentDetail'),
];
