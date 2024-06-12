import { Get } from 'cerebral';
import { state } from '@web-client/presenter/app.cerebral';

export const messagesIndividualInboxHelper = (
  get: Get,
): {
  allMessagesSelected: boolean;
  someMessagesSelected: boolean;
  isCompletionButtonEnabled: boolean;
} => {
  const messagesInboxCount = get(state.messagesInboxCount);
  const messagesSelectedCount = get(state.messagesPage.selectedMessages).size;

  const allMessagesSelected = messagesInboxCount === messagesSelectedCount;
  const someMessagesSelected = messagesSelectedCount > 0;
  const isCompletionButtonEnabled = someMessagesSelected;

  return {
    allMessagesCheckboxChecked: allMessagesSelected && !!messagesInboxCount,
    allMessagesCheckboxEnabled: !!messagesInboxCount,
    allMessagesSelected,
    isCompletionButtonEnabled,
    someMessagesSelected,
  };
};
