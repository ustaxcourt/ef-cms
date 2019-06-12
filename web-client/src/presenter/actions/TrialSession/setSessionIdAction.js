import { state } from 'cerebral';

/**
 * sets the state.sessionId
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object containing the props.sessionId
 * @param {object} providers.store the cerebral store used for setting the state.sessionId
 */
export const setSessionIdAction = ({ store, props }) => {
  store.set(state.sessionId, props.sessionId);
};
