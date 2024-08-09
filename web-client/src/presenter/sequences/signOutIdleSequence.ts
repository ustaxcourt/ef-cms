import { BROADCAST_MESSAGES } from '@shared/business/entities/EntityConstants';
import { checkDawsonHasUpdatedAction } from '@web-client/presenter/actions/checkDawsonHasUpdatedAction';
import { isLoggedInAction } from '@web-client/presenter/actions/isLoggedInAction';
import { setLogoutTypeAction } from '@web-client/presenter/actions/setLogoutTypeAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { signOutSequence } from '@web-client/presenter/sequences/signOutSequence';

// The sequence to call when the user is forced to sign out due to idle activity
export const signOutIdleSequence = [
  isLoggedInAction,
  {
    // To avoid race conditions, we ignore redundant calls to sign out that arise when
    // multiple tabs broadcast the idle sign out event.
    no: [],
    yes: [
      checkDawsonHasUpdatedAction,
      {
        dawsonHasNotUpdated: [
          setLogoutTypeAction(BROADCAST_MESSAGES.idleLogout),
          signOutSequence,
          setupCurrentPageAction('IdleLogout'),
        ],
        // If DAWSON has been updated, then we do not want to attempt to sign the user out.
        // The sign-out will fail, and this can lead to inconsistent front-end behavior (e.g., clearing modals).
        dawsonHasUpdated: [],
      },
    ],
  },
] as unknown as (props: {
  skipBroadcast?: boolean;
  fromModal?: boolean;
}) => void;