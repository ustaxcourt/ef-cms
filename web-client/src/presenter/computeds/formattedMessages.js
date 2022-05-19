import { formatDateIfToday } from './formattedWorkQueue';
import { sortFormattedMessages } from '../utilities/sortFormattedMessages';
import { state } from 'cerebral';

export const getFormattedMessages = ({
  applicationContext,
  messages,
  tableSort,
}) => {
  // TODO: refactor this whole function
  const formattedCaseMessages = messages.map(message => ({
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

  // extract into a helper function
  const sortedFormattedMessages = sortFormattedMessages(
    formattedCaseMessages,
    tableSort,
  );

  const inProgressMessages = sortedFormattedMessages.filter(
    message => !message.isRepliedTo && !message.isCompleted,
  );
  const completedMessages = sortedFormattedMessages.filter(
    message => message.isCompleted,
  );

  // TODO: Determine if conditional is needed
  if (!tableSort) {
    completedMessages.sort((a, b) =>
      b.completedAt.localeCompare(a.completedAt),
    );
  }

  return {
    completedMessages,
    inProgressMessages,
    messages: sortedFormattedMessages,
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
