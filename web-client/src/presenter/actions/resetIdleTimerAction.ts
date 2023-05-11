import { state } from 'cerebral';

/**
 * obtains the idleTimeRef ref and calls its reset() method to reset the idle timer
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function used for getting state
 */
export const resetIdleTimerAction = ({ get }: ActionProps) => {
  const ref = get(state.idleTimerRef);

  if (ref) {
    ref.reset();
  }
};
