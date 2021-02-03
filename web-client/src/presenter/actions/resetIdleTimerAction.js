import { state } from 'cerebral';

export const resetIdleTimerAction = ({ get }) => {
  const ref = get(state.idleTimerRef);

  if (ref) {
    console.log('resetting idle status!!');
    ref.reset();
  }
};
