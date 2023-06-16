import { getFormattedMessages } from '../utilities/processFormattedMessages';
import { state } from '@web-client/presenter/app.cerebral';

import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
export const formattedCaseMessages = (
  get: Get,
  applicationContext: ClientApplicationContext,
) => {
  const caseDetail = get(state.caseDetail);
  const messages = caseDetail.messages || [];

  const { completedMessages, inProgressMessages } = getFormattedMessages({
    applicationContext,
    messages,
  });

  return { completedMessages, inProgressMessages };
};
