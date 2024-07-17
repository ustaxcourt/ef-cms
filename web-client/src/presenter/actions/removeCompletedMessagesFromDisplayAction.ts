import { state } from '@web-client/presenter/app.cerebral';

export const removeCompletedMessagesFromDisplayAction = ({
  get,
  props,
  store,
}: ActionProps) => {
  const { completedMessageIds } = props;
  const allMessages = get(state.messages);

  const remainingMessages = allMessages.filter(
    message => !completedMessageIds.includes(message.messageId),
  );

  const unreadMessageCount = remainingMessages.filter(
    message => !message.isRead,
  ).length;

  store.set(state.notifications.unreadMessageCount, unreadMessageCount);
  store.set(state.messagesInboxCount, remainingMessages.length);
  store.set(state.messages, remainingMessages);
};
