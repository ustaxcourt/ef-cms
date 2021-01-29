import { cancelDelayedLogoutAction } from '../actions/cancelDelayedLogoutAction';
import { clearModalAction } from '../actions/clearModalAction';

export const confirmStayLoggedInSequence = [
  cancelDelayedLogoutAction,
  clearModalAction, // TODO 7501 - if we use the appInstances showAppTimeoutModal value, we can remove clearModalAction and update that instead
];
