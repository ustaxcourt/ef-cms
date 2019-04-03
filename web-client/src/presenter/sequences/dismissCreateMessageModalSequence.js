import { clearModalAction } from '../actions/clearModalAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearFormAction } from '../actions/clearFormAction';
import { clearUsersAction } from '../actions/clearUsersAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';

export const dismissCreateMessageModalSequence = [
  stopShowValidationAction,
  clearFormAction,
  clearUsersAction,
  clearAlertsAction,
  clearModalAction,
  clearModalStateAction,
];
