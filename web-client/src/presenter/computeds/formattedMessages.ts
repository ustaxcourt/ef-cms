import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
import {
  applyFiltersToCompletedMessages,
  applyFiltersToMessages,
  getFormattedMessages,
} from '../utilities/processFormattedMessages';
import { state } from '@web-client/presenter/app.cerebral';

export const formattedMessages = (
  get: Get,
  applicationContext: ClientApplicationContext,
): any => {
  const tableSort = get(state.tableSort);

  const { completedMessages, messages } = getFormattedMessages({
    applicationContext,
    cacheKey: get(state.messageCacheKey),
    messages: get(state.messages) || [],
    tableSort,
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

  const { role } = get(state.user);
  const { USER_ROLES } = applicationContext.getConstants();

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
