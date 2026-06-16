import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
import { RawMessage } from '@shared/business/entities/Message';
import {
  applyFiltersToCompletedMessages,
  applyFiltersToMessages,
  getFormattedMessages,
} from '@web-client/presenter/utilities/processFormattedMessages';
import { state } from '@web-client/presenter/app.cerebral';

export type DocketClerkReportMessageBox = {
  caseStatuses: string[];
  completedByUsers: string[];
  fromSections: string[];
  fromUsers: string[];
  messages: any[];
  toSections: string[];
  toUsers: string[];
};

export type DocketClerkReportMessagesResults = {
  completed: DocketClerkReportMessageBox;
  inbox: DocketClerkReportMessageBox;
  sent: DocketClerkReportMessageBox;
};

export const docketClerkReportMessagesHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): DocketClerkReportMessagesResults => {
  const tableSort = get(state.tableSort);
  const screenMetadata = get(state.screenMetadata);
  const inboxMessages: RawMessage[] = get(
    state.docketClerkReport.inboxMessages,
  );
  const sentMessages: RawMessage[] = get(state.docketClerkReport.sentMessages);
  const completedMessages: RawMessage[] = get(
    state.docketClerkReport.completedMessages,
  );

  const formatBox = (
    rawMessages: RawMessage[],
  ): DocketClerkReportMessageBox => {
    const { completedMessages: formattedCompleted, messages } =
      getFormattedMessages({
        applicationContext,
        messages: rawMessages,
        tableSort,
      });

    messages.forEach(message => {
      message.caseStatus = applicationContext
        .getUtilities()
        .caseStatusWithTrialInformation({
          caseStatus: message.caseStatus,
          trialDate: message.trialDate,
          trialLocation: message.trialLocation,
        });
    });

    const { filterValues, filteredMessages } = applyFiltersToMessages({
      messages,
      screenMetadata,
    });

    const { filterValues: completedFilterValues } =
      applyFiltersToCompletedMessages({
        completedMessages: formattedCompleted,
        screenMetadata,
      });

    return {
      ...filterValues,
      ...completedFilterValues,
      messages: filteredMessages,
    };
  };

  return {
    completed: formatBox(completedMessages),
    inbox: formatBox(inboxMessages),
    sent: formatBox(sentMessages),
  };
};
