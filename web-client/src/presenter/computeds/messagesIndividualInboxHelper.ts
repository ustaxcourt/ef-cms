import { Get } from 'cerebral';
import { state } from '@web-client/presenter/app.cerebral';

export const messagesIndividualInboxHelper = (
  get: Get,
): { allMessagesSelected: boolean; someMessagesSelected: boolean } => {
  const messagesInboxCount = get(state.messagesInboxCount);
  const messagesSelectedCount = get(state.messagesPage.selectedMessages).length;

  return {
    allMessagesSelected: messagesInboxCount === messagesSelectedCount,
    someMessagesSelected: messagesSelectedCount > 0,
  };
};
