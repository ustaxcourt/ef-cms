import { getFormattedMessages } from '../utilities/processFormattedMessages';
import { state } from '@web-client/presenter/app.cerebral';

export const formattedCaseMessages = (get, applicationContext) => {
  const caseDetail = get(state.caseDetail);
  const messages = caseDetail.messages || [];

  const { completedMessages, inProgressMessages } = getFormattedMessages({
    applicationContext,
    messages,
  });

  return { completedMessages, inProgressMessages };
};
