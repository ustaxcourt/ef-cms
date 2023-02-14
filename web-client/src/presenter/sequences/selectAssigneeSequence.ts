import { clearAlertsAction } from '../actions/clearAlertsAction';
import { getAssignWorkItemsAlertSuccessAction } from '../actions/WorkQueue/getAssignWorkItemsAlertSuccessAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setAssigneeIdAction } from '../actions/setAssigneeIdAction';

export const selectAssigneeSequence = [
  clearAlertsAction,
  setAssigneeIdAction,
  getAssignWorkItemsAlertSuccessAction,
  setAlertSuccessAction,
];
