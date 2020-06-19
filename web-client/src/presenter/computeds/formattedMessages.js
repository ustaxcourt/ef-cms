import { formatDateIfToday } from './formattedWorkQueue';
import { state } from 'cerebral';

export const formattedMessages = (get, applicationContext) => {
  const messages = get(state.messages) || [];

  const result = messages.map(message => ({
    ...message,
    completedAtFormatted: formatDateIfToday(
      message.completedAt,
      applicationContext,
    ),
    createdAtFormatted: formatDateIfToday(
      message.createdAt,
      applicationContext,
    ),
  }));

  result.sort((a, b) => {
    return a.createdAt.localeCompare(b.createdAt);
  });

  return result;
};
