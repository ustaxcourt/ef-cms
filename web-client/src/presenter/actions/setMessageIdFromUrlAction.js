import { state } from 'cerebral';

/**
 * sets the state.messageId
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.props the cerebral props object containing the props.messageId
 * @param {Object} providers.store the cerebral store used for setting the state.messageId
 */
export const setMessageIdFromUrlAction = ({ store, props }) => {
  store.set(state.messageId, props.messageId);
};
