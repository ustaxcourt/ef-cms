import { Get } from 'cerebral';
import { state } from '@web-client/presenter/app.cerebral';

export const messagesIndividualInboxHelper = (
  get: Get,
): {
  allMessagesSelected: boolean;
  someMessagesSelected: boolean;
  isCompletionButtonEnabled: boolean;
  messagesCompletedAt: string;
  messagesCompletedBy: string;
  allMessagesCheckboxEnabled: boolean;
  completionSuccess: boolean;
} => {
  const messagesDisplayedCount = get(state.formattedMessages.messages).length;
  const messagesSelectedCount = get(state.messagesPage.selectedMessages).size;
  const completionSuccess = get(state.messagesPage.completionSuccess);
  const messagesCompletedAt = get(state.messagesPage.messagesCompletedAt);
  const messagesCompletedBy = get(state.messagesPage.messagesCompletedBy);

  const allMessagesSelected =
    messagesDisplayedCount > 0 &&
    messagesDisplayedCount === messagesSelectedCount;
  const someMessagesSelected = messagesSelectedCount > 0;
  const isCompletionButtonEnabled = someMessagesSelected;

  return {
    allMessagesCheckboxEnabled: !!messagesDisplayedCount,
    allMessagesSelected,
    completionSuccess,
    isCompletionButtonEnabled,
    messagesCompletedAt,
    messagesCompletedBy,
    someMessagesSelected,
  };
};
