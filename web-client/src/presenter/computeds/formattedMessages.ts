import {
  applyFiltersToCompletedMessages,
  applyFiltersToMessages,
  getFormattedMessages,
} from '../utilities/processFormattedMessages';
import { state } from 'cerebral';

export const formattedMessages = (get, applicationContext) => {
  const tableSort = get(state.tableSort);

  const { completedMessages, messages } = getFormattedMessages({
    applicationContext,
    cacheKey: get(state.messageCacheKey),
    messages: get(state.messages) || [],
    tableSort,
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

  const { box } = get(state.messageBoxToDisplay);
  const { role } = get(state.user);
  const { USER_ROLES } = applicationContext.getConstants();

  if (box === 'outbox' && role !== USER_ROLES.adc) {
    messages.reverse();
  }
  const hasMessages = messages.length > 0;

  let showFilters = role === USER_ROLES.adc;

  let sharedComputedResult = {
    completedMessages,
    hasMessages,
    messages,
    showFilters,
  };

  if (showFilters) {
    const messageFilterResults = applyFiltersToMessages({
      messages,
      screenMetadata: get(state.screenMetadata),
    });

    const completedMessageFilterResults = applyFiltersToCompletedMessages({
      completedMessages,
      screenMetadata: get(state.screenMetadata),
    });

    sharedComputedResult = {
      ...sharedComputedResult,
      ...messageFilterResults.filterValues,
      ...completedMessageFilterResults.filterValues,
      completedMessages:
        completedMessageFilterResults.filteredCompletedMessages,
      messages: messageFilterResults.filteredMessages,
    };
  }

  return sharedComputedResult;
};

export const setTrialInformationOnMessage = ({
  applicationContext,
  message,
}) => {
  const { TRIAL_SESSION_SCOPE_TYPES } = applicationContext.getConstants();

  if (message.trialLocation !== TRIAL_SESSION_SCOPE_TYPES.standaloneRemote) {
    message.formattedTrialLocation = applicationContext
      .getUtilities()
      .abbreviateState(message.trialLocation);
  } else {
    message.formattedTrialLocation = message.trialLocation;
  }

  message.formattedTrialDate = applicationContext
    .getUtilities()
    .formatDateString(message.trialDate, 'MMDDYY');
};
