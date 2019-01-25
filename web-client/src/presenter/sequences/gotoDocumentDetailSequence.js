import clearAlerts from '../actions/clearAlertsAction';
import clearForms from '../actions/clearFormsAction';
import clearWorkItemActionMap from '../actions/clearWorkItemActionMapAction';
import getCase from '../actions/getCaseAction';
import getInternalUsers from '../actions/getInternalUsersAction';
import setAlertError from '../actions/setAlertErrorAction';
import setBaseUrl from '../actions/setBaseUrlAction';
import setCase from '../actions/setCaseAction';
import setCurrentPage from '../actions/setCurrentPageAction';
import setDocumentId from '../actions/setDocumentIdAction';
import setFormForCaseAction from '../actions/setFormForCaseAction';
import setInternalUsers from '../actions/setInternalUsersAction';
import setDefaultDocumentDetailTab from '../actions/setDefaultDocumentDetailTabAction';

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
  {
    error: [setAlertError],
    success: [setInternalUsers],
  },
  setDefaultDocumentDetailTab,
  setCurrentPage('DocumentDetail'),
];
