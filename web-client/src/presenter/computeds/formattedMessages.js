import { getFormattedMessages } from '../utilities/processFormattedMessages';
import { state } from 'cerebral';

export const formattedMessages = (get, applicationContext) => {
  const tableSort = get(state.tableSort);

  const { completedMessages, messages } = getFormattedMessages({
    applicationContext,
    messages: get(state.messages) || [],
    tableSort,
  });

  const { box, section } = get(state.messageBoxToDisplay);
  const { role } = get(state.user);

  const { USER_ROLES } = applicationContext.getConstants();

  if (box === 'outbox' && section === 'section' && role !== USER_ROLES.adc) {
    messages.reverse();
  }

  return {
    completedMessages,
    messages,
  };
};
