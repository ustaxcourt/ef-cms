import { cancelDelayedLogoutAction } from '../actions/cancelDelayedLogoutAction';
import { clearModalAction } from '../actions/clearModalAction';

export const confirmStayLoggedInSequence = [
  cancelDelayedLogoutAction,
  clearModalAction,
];
