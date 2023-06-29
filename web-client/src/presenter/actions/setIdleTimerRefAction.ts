import { state } from '@web-client/presenter/app.cerebral';

/**
 * set idleTimerRef reference into state from props
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store
 */
export const setIdleTimerRefAction = ({ props, store }: ActionProps) => {
  const { ref } = props;
  store.set(state.idleTimerRef, ref);
};
