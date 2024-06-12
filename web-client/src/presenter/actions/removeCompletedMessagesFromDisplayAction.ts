import { state } from '@web-client/presenter/app.cerebral';

export const removeCompletedMessagesFromDisplayAction = ({
  get,
  store,
}: ActionProps) => {
  const selectedMap = get(state.messagesPage.selectedMessages);
  const completedMessages = Array.from(selectedMap.keys());
  const formattedMessages = get(state.formattedMessages);
  console.log('formatted', formattedMessages);
  // either remove only the message from display, or remove everything about the message from the whole object
  // I opt for #1
  const messagesInInbox = formattedMessages.messages;
  const remainingInboxItems = messagesInInbox.filter(
    message => !completedMessages.includes(message.messageId),
  );

  console.log('remaining', remainingInboxItems);
  store.set(state.formattedMessages.messages, remainingInboxItems);
  store.set(state.formattedMessages.hasMessages, !!remainingInboxItems.length);
};
