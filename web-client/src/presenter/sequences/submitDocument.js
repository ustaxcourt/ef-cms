import clearAlerts from '../actions/clearAlerts';
import navigateToCaseDetail from '../actions/navigateToCaseDetail';
import setAlertSuccess from '../actions/setAlertSuccess';
import setFormSubmitting from '../actions/setFormSubmitting';
import unsetFormSubmitting from '../actions/unsetFormSubmitting';
import uploadDocument from '../actions/uploadDocument';

export default [
  setFormSubmitting,
  clearAlerts,
  uploadDocument,
  setAlertSuccess,
  unsetFormSubmitting,
  navigateToCaseDetail,
];
