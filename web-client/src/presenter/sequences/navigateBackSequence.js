import { clearAlertsAction } from '../actions/clearAlertsAction';
import { navigateBackAction } from '../actions/navigateBackAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

export const navigateBackSequence = [
  clearAlertsAction,
  stopShowValidationAction,
  navigateBackAction,
];
