import { checkClientNeedsToRefresh } from '@web-client/presenter/actions/checkClientNeedsToRefresh';
import { navigateToLoginSequence } from '@web-client/presenter/sequences/Login/navigateToLoginSequence';
import { signOutSequence } from '@web-client/presenter/sequences/signOutSequence';

// The sequence to call when the user voluntarily decides to sign out
export const signOutUserInitiatedSequence = [
  checkClientNeedsToRefresh,
  {
    clientDoesNotNeedToRefresh: [signOutSequence, navigateToLoginSequence],
    clientNeedsToRefresh: [],
  },
] as unknown as (props: {
  skipBroadcast?: boolean;
  fromModal?: boolean;
}) => void;
