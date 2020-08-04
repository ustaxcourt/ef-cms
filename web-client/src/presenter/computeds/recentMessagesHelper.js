import { getFormattedMessages } from './formattedMessages';
import { state } from 'cerebral';

export const recentMessagesHelper = (get, applicationContext) => {
  const { messages } = getFormattedMessages({
    applicationContext,
    messages: get(state.messages) || [],
  });

  const recentMessages = messages.reverse().splice(0, 5);

  return {
    recentMessages,
  };
};
