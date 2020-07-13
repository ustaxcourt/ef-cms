import { state } from 'cerebral';

export const messagesHelper = get => {
  const messageBoxToDisplay = get(state.messageBoxToDisplay);
  const showIndividualMessages = messageBoxToDisplay.queue === 'my';
  const showSectionMessages = messageBoxToDisplay.queue === 'section';

  const messagesTitle = showIndividualMessages
    ? 'My Messages'
    : 'Section Messages';

  return { messagesTitle, showIndividualMessages, showSectionMessages };
};
