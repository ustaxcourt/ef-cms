import { formatDateIfToday } from './formattedWorkQueue';
import {
  sortCompletedMessages,
  sortFormattedMessages,
} from '../utilities/processFormattedMessages';
import { state } from 'cerebral';

export const getFormattedMessages = ({
  applicationContext,
  messages,
  tableSort,
}) => {
  const formattedMessages = messages.map(message => ({
    ...message,
    completedAtFormatted: formatDateIfToday(
      message.completedAt,
      applicationContext,
    ),
    createdAtFormatted: formatDateIfToday(
      message.createdAt,
      applicationContext,
    ),
    messageDetailLink: `/messages/${message.docketNumber}/message-detail/${message.parentMessageId}`,
  }));

  const sortedMessages = sortFormattedMessages(formattedMessages, tableSort);

  const inProgressMessages = sortedMessages.filter(
    message => !message.isRepliedTo && !message.isCompleted,
  );

  const completedMessages = sortCompletedMessages(sortedMessages, tableSort);

  return {
    completedMessages,
    inProgressMessages,
    messages: sortedMessages,
  };
};

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
