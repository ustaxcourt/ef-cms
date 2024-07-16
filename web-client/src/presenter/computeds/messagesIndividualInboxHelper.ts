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
  const messagesInboxCount = get(state.messages).length;
  const messagesSelectedCount = get(state.messagesPage.selectedMessages).size;
  const completionSuccess = get(state.messagesPage.completionSuccess);
  const messagesCompletedAt = get(state.messagesPage.messagesCompletedAt);
  const messagesCompletedBy = get(state.messagesPage.messagesCompletedBy);

  const allMessagesSelected =
    messagesInboxCount > 0 && messagesInboxCount === messagesSelectedCount;
  const someMessagesSelected = messagesSelectedCount > 0;
  const isCompletionButtonEnabled = someMessagesSelected;

  return {
    allMessagesCheckboxEnabled: !!messagesInboxCount,
    allMessagesSelected,
    completionSuccess,
    isCompletionButtonEnabled,
    messagesCompletedAt,
    messagesCompletedBy,
    someMessagesSelected,
  };
};
