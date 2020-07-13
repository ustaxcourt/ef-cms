import { state } from 'cerebral';

/**
 * sets the state.messages based on the props.messages passed in.
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 * @param {object} providers.props the cerebral props object
 * @returns {undefined}
 */
export const setCaseMessagesAction = ({ props, store }) => {
  store.set(state.messages, props.messages);
};
