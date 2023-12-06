import { getFormattedMessages } from '../utilities/processFormattedMessages';
import { state } from '@web-client/presenter/app.cerebral';

import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
export const recentMessagesHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): any => {
  const { messages } = getFormattedMessages({
    applicationContext,
    messages: get(state.messages) || [],
  });

  messages.forEach(message => {
    const statusWithTrialInfo = applicationContext
      .getUtilities()
      .caseStatusWithTrialInformation({
        applicationContext,
        caseStatus: message.caseStatus,
        trialDate: message.trialDate,
        trialLocation: message.trialLocation,
      });
    message.caseStatus = statusWithTrialInfo;
  });

  const recentMessages = messages.reverse().splice(0, 5);

  return {
    recentMessages,
  };
};
