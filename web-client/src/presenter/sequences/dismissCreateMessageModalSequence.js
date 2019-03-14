import { clearModalAction } from '../actions/clearModalAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

export const dismissCreateMessageModalSequence = [
  stopShowValidationAction,
  clearModalAction,
];
