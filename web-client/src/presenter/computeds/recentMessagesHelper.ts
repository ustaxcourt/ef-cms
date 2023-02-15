import { getFormattedMessages } from '../utilities/processFormattedMessages';
import { setTrialInformationOnMessage } from './formattedMessages';
import { state } from 'cerebral';

export const recentMessagesHelper = (get, applicationContext) => {
  const { messages } = getFormattedMessages({
    applicationContext,
    messages: get(state.messages) || [],
  });

  const { STATUS_TYPES } = applicationContext.getConstants();

  messages.forEach(message => {
    message.showTrialInformation =
      message.caseStatus === STATUS_TYPES.calendared;

    if (message.showTrialInformation) {
      setTrialInformationOnMessage({
        applicationContext,
        message,
      });
    }
  });

  const recentMessages = messages.reverse().splice(0, 5);

  return {
    recentMessages,
  };
};
