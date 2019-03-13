import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearFormAction } from '../actions/clearFormAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { updateCaseAction } from '../actions/updateCaseAction';

export const submitUpdateCaseSequence = [
  clearAlertsAction,
  clearFormAction,
  updateCaseAction,
  setCaseAction,
  setAlertSuccessAction,
];
