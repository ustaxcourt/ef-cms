import { state } from 'cerebral';

export const resetIdleTimerAction = ({ get }) => {
  const ref = get(state.idleTimerRef);

  console.log('ref is', ref);
  if (ref) {
    ref.reset();
  }
};
