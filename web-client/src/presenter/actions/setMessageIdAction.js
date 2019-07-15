import { state } from 'cerebral';

/**
 * sets the state.messageId based on the props.messageId passed in
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store used for setting the state.messageId
 * @param {object} providers.props the cerebral props object used for passing the props.messageId
 */
export const setMessageIdAction = ({ props, store }) => {
  store.set(state.messageId, props.messageId);
};
