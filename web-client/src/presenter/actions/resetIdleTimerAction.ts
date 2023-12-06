import { state } from '@web-client/presenter/app.cerebral';

/**
 * obtains the idleTimeRef ref and calls its reset() method to reset the idle timer
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function used for getting state
 */
export const resetIdleTimerAction = ({ store }: ActionProps) => {
  store.set(state.lastIdleAction, Date.now());
  store.set(state.idleLogoutState, {
    logoutAt: undefined,
    state: 'INITIAL',
  });
};
