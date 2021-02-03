import { state } from 'cerebral';

export const setIdleTimerRefAction = ({ props, store }) => {
  const { ref } = props;
  store.set(state.idleTimerRef, ref);
};
