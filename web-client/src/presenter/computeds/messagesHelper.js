import { state } from 'cerebral';

export const messagesHelper = get => {
  const messageBoxToDisplay = get(state.messageBoxToDisplay);
  const showIndividualMessages = messageBoxToDisplay.queue === 'my';
  const showSectionMessages = messageBoxToDisplay.queue === 'section';

  const messagesInboxCount = get(state.messagesInboxCount);
  const messagesSectionCount = get(state.messagesSectionCount);
  const inboxCount = showIndividualMessages
    ? messagesInboxCount
    : messagesSectionCount;

  const messagesTitle = showIndividualMessages
    ? 'My Messages'
    : 'Section Messages';

  return {
    inboxCount,
    messagesTitle,
    showIndividualMessages,
    showSectionMessages,
  };
};
