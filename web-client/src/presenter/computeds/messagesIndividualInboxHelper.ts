import { Get } from 'cerebral';
import { state } from '@web-client/presenter/app.cerebral';

export const messagesIndividualInboxHelper = (
  get: Get,
): {
  allMessagesSelected: boolean;
  someMessagesSelected: boolean;
  isCompletionButtonEnabled: boolean;
  completedMessages: string[];
  messagesCompletedAt: string;
  messagesCompletedBy: string;
  allMessagesCheckboxEnabled: boolean;
} => {
  const messagesInboxCount = get(state.messagesInboxCount);
  const messagesSelectedCount = get(state.messagesPage.selectedMessages).size;
  const completedMessages = get(state.messagesPage.completedMessagesList);
  const messagesCompletedAt = get(state.messagesPage.messagesCompletedAt);
  const messagesCompletedBy = get(state.messagesPage.messagesCompletedBy);

  const allMessagesSelected = messagesInboxCount === messagesSelectedCount;
  const someMessagesSelected = messagesSelectedCount > 0;
  const isCompletionButtonEnabled = someMessagesSelected;

  return {
    allMessagesCheckboxEnabled: !!messagesInboxCount,
    allMessagesSelected,
    completedMessages,
    isCompletionButtonEnabled,
    messagesCompletedAt,
    messagesCompletedBy,
    someMessagesSelected,
  };
};
