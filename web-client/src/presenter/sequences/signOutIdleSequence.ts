import { setLogoutTypeAction } from '@web-client/presenter/actions/setLogoutTypeAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { signOutSequence } from '@web-client/presenter/sequences/signOutSequence';

// The sequence to call when the user is forced to sign out due to idle activity
export const signOutIdleSequence = [
  setLogoutTypeAction('idleLogout'),
  signOutSequence,
  setupCurrentPageAction('IdleLogout'),
];
