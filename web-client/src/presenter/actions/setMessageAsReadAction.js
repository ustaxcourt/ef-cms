import { state } from 'cerebral';

/**
 * sets the given message as read
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.props the cerebral store object
 */
export const setMessageAsReadAction = async ({
  applicationContext,
  get,
  props,
  store,
}) => {
  const { messageToMarkRead } = props;

  await applicationContext
    .getUseCases()
    .setMessageAsReadInteractor(applicationContext, {
      docketNumber: messageToMarkRead.docketNumber,
      messageId: messageToMarkRead.messageId,
    });

  const { unreadMessageCount } = get(state.notifications) || 0;

  if (unreadMessageCount) {
    store.set(state.notifications.unreadMessageCount, unreadMessageCount - 1);
  }
};
