import { clearModalAction } from '../actions/clearModalAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { clearAlertsAction } from '../actions/clearAlertsAction';

export const dismissSelectDocumentTypeModalSequence = [
  stopShowValidationAction,
  clearAlertsAction,
  clearModalAction,
];
