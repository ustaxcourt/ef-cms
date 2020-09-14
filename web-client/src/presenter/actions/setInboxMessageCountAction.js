import { state } from 'cerebral';

/**
 * Used for setting the user's inbox count
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store object
 */
export const setInboxMessageCountAction = ({ props, store }) => {
  store.set(state.messagesInboxCount, (props.messages || []).length);
};
