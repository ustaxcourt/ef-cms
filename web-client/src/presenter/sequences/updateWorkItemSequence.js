import clearAlerts from '../actions/clearAlertsAction';
import updateWorkItem from '../actions/updateWorkItemAction';
import setAlertError from '../actions/setAlertErrorAction';
import setAlertSuccess from '../actions/setAlertSuccessAction';

export default [
  clearAlerts,
  updateWorkItem,
  {
    error: [setAlertError],
    success: [setAlertSuccess],
  },
];
