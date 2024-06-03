import { Get } from 'cerebral';
import { state } from '@web-client/presenter/app.cerebral';

export const messagesIndividualInboxHelper = (
  get: Get,
): { allMessagesSelected: boolean; someMessagesSelected: boolean } => {
  const messagesInboxCount = get(state.messagesInboxCount);
  const formattedMessages = get(state.formattedMessages);
  const messagesSelectedCount = formattedMessages.messages.filter(
    message => message.isSelected,
  ).length;

  return {
    allMessagesSelected: messagesInboxCount === messagesSelectedCount,
    someMessagesSelected:
      messagesSelectedCount > 0 && messagesSelectedCount < messagesInboxCount,
  };
};
