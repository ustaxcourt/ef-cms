import { state } from 'cerebral';

import { formatDateIfToday } from './formattedWorkQueue';

export const formattedMessages = (get, applicationContext) => {
  const messages = get(state.messages) || [];

  const result = messages.map(message => ({
    ...message,
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
