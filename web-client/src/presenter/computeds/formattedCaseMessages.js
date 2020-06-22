import { formatDateIfToday } from './formattedWorkQueue';
import { state } from 'cerebral';

export const formattedCaseMessages = (get, applicationContext) => {
  const messages = get(state.caseDetail.messages) || [];

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

  return { completedMessages, inProgressMessages };
};
