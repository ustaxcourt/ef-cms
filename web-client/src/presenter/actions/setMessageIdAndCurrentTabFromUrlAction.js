import { state } from 'cerebral';

/**
 * sets the state.currentViewMetadata.messageId and state.currentViewMetadata.tab
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object containing the props.messageId
 * @param {object} providers.store the cerebral store used for setting the state.currentViewMetadata.tab
 */
export const setMessageIdAndCurrentTabFromUrlAction = ({ props, store }) => {
  store.set(state.currentViewMetadata.messageId, props.messageId || null);
  if (props.messageId) {
    store.set(state.currentViewMetadata.tab, 'Messages');
  }
};
