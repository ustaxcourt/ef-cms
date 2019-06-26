import { state } from 'cerebral';

/**
 * sets the state.messageId and state.currentTab
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object containing the props.messageId
 * @param {object} providers.store the cerebral store used for setting the state.messageId
 */
export const setMessageIdAndCurrentTabFromUrlAction = ({ props, store }) => {
  if (props.messageId) {
    store.set(state.messageId, props.messageId);
    store.set(state.currentTab, 'Messages');
  }
};
