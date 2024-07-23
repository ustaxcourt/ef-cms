import { setLogoutTypeAction } from '@web-client/presenter/actions/setLogoutTypeAction';
import { signOutSequence } from '@web-client/presenter/sequences/signOutSequence';

// The sequence to call when the user voluntarily decides to sign out
export const signOutUserInitiatedSequence = [
  setLogoutTypeAction('userLogout'),
  signOutSequence,
];
