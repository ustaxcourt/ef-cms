import { BROADCAST_MESSAGES } from '@shared/business/entities/EntityConstants';
import { navigateToLoginSequence } from '@web-client/presenter/sequences/Login/navigateToLoginSequence';
import { setLogoutTypeAction } from '@web-client/presenter/actions/setLogoutTypeAction';
import { signOutSequence } from '@web-client/presenter/sequences/signOutSequence';

// The sequence to call when the user voluntarily decides to sign out
export const signOutUserInitiatedSequence = [
  setLogoutTypeAction(BROADCAST_MESSAGES.userLogout),
  signOutSequence,
  navigateToLoginSequence,
] as unknown as (props: {
  skipBroadcast?: boolean;
  fromModal?: boolean;
}) => void;
