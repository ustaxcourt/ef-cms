import { LOGOUT_OPTIONS } from '@shared/business/entities/EntityConstants';
import { state } from '@web-client/presenter/app.cerebral';

/**
 * only resets the timer if we are not also showing an idle modal
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function used for getting state
 */
export const handlePeerResetIdleTimerAction = ({ get, store }: ActionProps) => {
  const idleLogoutState = get(state.idleLogoutState);
  if (idleLogoutState.state !== LOGOUT_OPTIONS.idleLogoutStates.COUNTDOWN) {
    store.set(state.lastIdleAction, Date.now());
    store.set(state.idleLogoutState, {
      logoutAt: undefined,
      state: LOGOUT_OPTIONS.idleLogoutStates.INITIAL,
    });
  }
};
