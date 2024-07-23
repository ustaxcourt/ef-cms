import { LOGOUT_BROADCAST_MESSAGES } from '@shared/business/entities/EntityConstants';
import { setLogoutTypeAction } from '@web-client/presenter/actions/setLogoutTypeAction';
import { signOutSequence } from '@web-client/presenter/sequences/signOutSequence';

// The sequence to call when the user voluntarily decides to sign out
export const signOutUserInitiatedSequence = [
  setLogoutTypeAction(LOGOUT_BROADCAST_MESSAGES.userLogout),
  signOutSequence,
];
