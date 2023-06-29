import { state } from '@web-client/presenter/app.cerebral';

/**
 * Used for setting the user's inbox count
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store object
 */
export const setMessageCountsAction = ({ props, store }: ActionProps) => {
  const messagesSectionCount = props.notifications?.userSectionCount || 0;
  const messagesInboxCount = props.notifications?.userInboxCount || 0;

  store.set(state.messagesSectionCount, messagesSectionCount);
  store.set(state.messagesInboxCount, messagesInboxCount);
};
