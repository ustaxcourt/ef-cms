import { state } from '@web-client/presenter/app.cerebral';

export const setMessageAsReadAction = async ({
  applicationContext,
  get,
  props,
  store,
}: ActionProps) => {
  const { messageToMarkRead } = props;

  await applicationContext
    .getUseCases()
    .setMessageAsReadInteractor(applicationContext, {
      messageId: messageToMarkRead.messageId,
    });

  const { unreadMessageCount } = get(state.notifications) || 0;

  if (unreadMessageCount) {
    store.set(state.notifications.unreadMessageCount, unreadMessageCount - 1);
  }
};
