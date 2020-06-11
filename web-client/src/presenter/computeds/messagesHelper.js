import { state } from 'cerebral';

export const messagesHelper = get => {
  const messageBoxToDisplay = get(state.messageBoxToDisplay);
  const showIndividualMessages = messageBoxToDisplay.queue === 'my';
  const showSectionMessages = messageBoxToDisplay.queue === 'section';

  return { showIndividualMessages, showSectionMessages };
};
