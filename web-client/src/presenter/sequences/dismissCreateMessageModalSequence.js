import { clearModalAction } from '../actions/clearModalAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearFormAction } from '../actions/clearFormAction';

export const dismissCreateMessageModalSequence = [
  stopShowValidationAction,
  clearFormAction,
  clearAlertsAction,
  clearModalAction,
];
