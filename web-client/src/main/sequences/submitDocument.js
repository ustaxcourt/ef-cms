import clearAlerts from '../actions/clearAlerts';
// import getCreateCaseAlertSuccess from '../actions/getCreateCaseAlertSuccess';
import navigateToCaseDetail from '../actions/navigateToCaseDetail';
import setAlertSuccess from '../actions/setAlertSuccess';
import setFormSubmitting from '../actions/setFormSubmitting';
import unsetFormSubmitting from '../actions/unsetFormSubmitting';
import formatSearchParams from '../actions/formatSearchParams';
import uploadDocument from '../actions/uploadDocument';

export default [
  setFormSubmitting,
  clearAlerts,
  uploadDocument,
  unsetFormSubmitting,
  // getCreateCaseAlertSuccess,
  setAlertSuccess,
  formatSearchParams,
  navigateToCaseDetail,
];
