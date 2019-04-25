import { cancelAutoLogoutAction } from '../actions/cancelAutoLogoutAction';
import { clearModalAction } from '../actions/clearModalAction';

export const confirmStayLoggedInSequence = [
  cancelAutoLogoutAction,
  clearModalAction,
];
