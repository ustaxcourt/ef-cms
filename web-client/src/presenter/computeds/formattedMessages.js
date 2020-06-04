import { state } from 'cerebral';

import { formatDateIfToday } from './formattedWorkQueue';

export const formattedMessages = (get, applicationContext) => {
  const messages = get(state.messages) || [];

  const formattedMessages = messages.map(message => ({
    ...message,
    createdAtFormatted: formatDateIfToday(
      message.createdAt,
      applicationContext,
    ),
  }));

  return formattedMessages;
};
