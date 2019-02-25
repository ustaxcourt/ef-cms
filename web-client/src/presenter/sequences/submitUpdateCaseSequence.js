import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearFormAction } from '../actions/clearFormAction';
import { setAlertSuccess } from '../actions/setAlertSuccessAction';
import { setCase } from '../actions/setCaseAction';
import { updateCase } from '../actions/updateCaseAction';

export const submitUpdateCaseSequence = [
  clearAlertsAction,
  clearFormAction,
  updateCase,
  setCase,
  setAlertSuccess,
];
