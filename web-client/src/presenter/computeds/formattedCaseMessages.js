import { getFormattedMessages } from './formattedMessages';
import { state } from 'cerebral';

export const formattedCaseMessages = (get, applicationContext) => {
  const caseDetail = get(state.caseDetail);
  const messages = caseDetail.messages || [];

  const { completedMessages, inProgressMessages } = getFormattedMessages({
    applicationContext,
    messages,
  });

  return { completedMessages, inProgressMessages };
};
