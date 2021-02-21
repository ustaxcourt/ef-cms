import { state } from 'cerebral';

/**
 * set idleTimerRef reference into state from props
 *
 * @param {object} providers
 * @param {object} providers.props cerebral props
 * @param {object} providers.store cerebral store
 */
export const setIdleTimerRefAction = ({ props, store }) => {
  const { ref } = props;
  store.set(state.idleTimerRef, ref);
};
