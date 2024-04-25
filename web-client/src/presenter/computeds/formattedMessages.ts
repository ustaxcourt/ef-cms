import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
import { MessageResult } from '@shared/business/entities/MessageResult';
import {
  applyFiltersToCompletedMessages,
  applyFiltersToMessages,
  getFormattedMessages,
} from '../utilities/processFormattedMessages';
import { state } from '@web-client/presenter/app.cerebral';

type FormattedMessageResult = MessageResult & {
  createdAtFormatted: string;
  isLeadCase: boolean;
  inConsolidatedGroup: boolean;
  consolidatedIconTooltipText: string;
  messageDetailLink: string;
  fromSectionFormatted: string;
};

export const formattedMessages = (
  get: Get,
  applicationContext: ClientApplicationContext,
): {
  caseStatuses: string[];
  completedByUsers: string[];
  completedMessages: MessageResult[];
  fromSections: string[];
  fromUsers: string[];
  hasMessages: boolean;
  messages: FormattedMessageResult[];
  toSections: string[];
  toUsers: string[];
} => {
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

  const hasMessages = messages.length > 0;

  const messageFilterResults = applyFiltersToMessages({
    messages,
    screenMetadata: get(state.screenMetadata),
  });

  const completedMessageFilterResults = applyFiltersToCompletedMessages({
    completedMessages,
    screenMetadata: get(state.screenMetadata),
  });

  const sharedComputedResult = {
    ...messageFilterResults.filterValues,
    ...completedMessageFilterResults.filterValues,
    completedMessages: completedMessageFilterResults.filteredCompletedMessages,
    hasMessages,
    messages: messageFilterResults.filteredMessages,
  };

  return sharedComputedResult;
};
