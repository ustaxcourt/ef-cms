import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

export const clearModalFormSequence = [
  stopShowValidationAction,
  clearAlertsAction,
  clearModalAction,
  clearModalStateAction,
];
