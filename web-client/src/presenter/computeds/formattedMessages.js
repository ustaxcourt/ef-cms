import { formatDateIfToday } from './formattedWorkQueue';
import { state } from 'cerebral';

export const getFormattedMessages = ({ applicationContext, messages }) => {
  const formattedMessages = messages
    .map(message => ({
      ...message,
      completedAtFormatted: formatDateIfToday(
        message.completedAt,
        applicationContext,
      ),
      createdAtFormatted: formatDateIfToday(
        message.createdAt,
        applicationContext,
      ),
    }))
    .sort((a, b) => {
      return a.createdAt.localeCompare(b.createdAt);
    });

  const inProgressMessages = formattedMessages.filter(
    message => !message.isRepliedTo,
  );
  const completedMessages = formattedMessages.filter(
    message => message.isCompleted,
  );

  completedMessages.sort((a, b) => b.completedAt.localeCompare(a.completedAt));

  return { completedMessages, inProgressMessages, messages: formattedMessages };
};

export const formattedMessages = (get, applicationContext) => {
  const { completedMessages, messages } = getFormattedMessages({
    applicationContext,
    messages: get(state.messages) || [],
  });

  return {
    completedMessages,
    messages,
  };
};
