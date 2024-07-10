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
  completedAtFormatted: string;
  completionSuccess: boolean;
} => {
  const messagesInboxCount = get(state.messagesInboxCount);
  const messagesSelectedCount = get(state.messagesPage.selectedMessages).size;
  const completedAtFormatted = get(state.messagesPage.completedAtFormatted);
  const completionSuccess = get(state.messagesPage.completionSuccess);
  const messagesCompletedAt = get(state.messagesPage.messagesCompletedAt);
  const messagesCompletedBy = get(state.messagesPage.messagesCompletedBy);

  const allMessagesSelected = messagesInboxCount === messagesSelectedCount;
  const someMessagesSelected = messagesSelectedCount > 0;
  const isCompletionButtonEnabled = someMessagesSelected;

  return {
    allMessagesCheckboxEnabled: !!messagesInboxCount,
    allMessagesSelected,
    completedAtFormatted,
    completionSuccess,
    isCompletionButtonEnabled,
    messagesCompletedAt,
    messagesCompletedBy,
    someMessagesSelected,
  };
};
