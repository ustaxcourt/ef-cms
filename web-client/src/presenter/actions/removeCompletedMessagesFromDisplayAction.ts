import { state } from '@web-client/presenter/app.cerebral';

export const removeCompletedMessagesFromDisplayAction = ({
  get,
  props,
  store,
}: ActionProps) => {
  const { completedMessageIds } = props;
  const messagesInInbox = get(state.formattedMessages.messages);

  const remainingInboxItems = messagesInInbox.filter(
    message => !completedMessageIds.includes(message.messageId),
  );

  store.set(state.messages, remainingInboxItems);
};
