import { getFormattedMessages } from './formattedMessages';
import { state } from 'cerebral';

export const formattedCaseMessages = (get, applicationContext) => {
  const messages = get(state.caseDetail.messages) || [];

  const { completedMessages, inProgressMessages } = getFormattedMessages({
    applicationContext,
    messages,
  });

  return { completedMessages, inProgressMessages };
};
