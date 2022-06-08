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
