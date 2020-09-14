import { state } from 'cerebral';

/**
 * Used for setting the user's section inbox count
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store object
 */
export const setSectionInboxMessageCountAction = ({ props, store }) => {
  store.set(state.messagesSectionCount, (props.messages || []).length);
};
