import { state } from 'cerebral';

/**
 * obtains the idleTimeRef ref and calls its reset() method to reset the idle timer
 *
 * @param {object} providers
 * @param {function} providers.get cerebral get function
 */
export const resetIdleTimerAction = ({ get }) => {
  const ref = get(state.idleTimerRef);

  if (ref) {
    ref.reset();
  }
};
