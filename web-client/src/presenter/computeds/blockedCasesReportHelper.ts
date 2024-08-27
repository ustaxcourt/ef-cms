import { state } from '@web-client/presenter/app.cerebral';

/**
 * gets the blocked cases and formats them and filters based on procedureType
 * @param {Function} get the cerebral get function used
 * for getting state.form.procedureType and state.blockedCases
 * @param {object} applicationContext the application context
 * @returns {object} {blockedCasesFormatted: *[], blockedCasesCount: number}
 */
import { CaseStatus } from '@shared/business/entities/EntityConstants';
import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';

export type BlockedFormattedCase = {
  docketNumber: string;
  inConsolidatedGroup: boolean;
  consolidatedIconTooltipText: string;
  isLeadCase: boolean;
  blockedDateEarliest: string;
  caseTitle: string;
  procedureType: string;
  status: CaseStatus;
  blockedReason?: string;
  automaticBlockedReason?: string;
  docketNumberWithSuffix?: string;
};

type BlockedCaseReportHelperResults = {
  blockedCasesCount: number;
  blockedCasesFormatted: BlockedFormattedCase[];
  displayMessage: string | undefined;
};

const setFormattedBlockDates = (
  blockedCase: RawCase & {
    inConsolidatedGroup: boolean;
    consolidatedIconTooltipText: string;
    shouldIndent: boolean;
    isLeadCase: boolean;
  },
  applicationContext: ClientApplicationContext,
): BlockedFormattedCase => {
  const blockedFormattedCase: BlockedFormattedCase = {
    ...blockedCase,
    blockedDateEarliest: '',
    caseTitle: '',
  };

  if (blockedCase.blockedDate && blockedCase.automaticBlocked) {
    if (blockedCase.blockedDate < blockedCase.automaticBlockedDate!) {
      blockedFormattedCase.blockedDateEarliest = applicationContext
        .getUtilities()
        .formatDateString(blockedCase.blockedDate, 'MMDDYY');
    } else {
      blockedFormattedCase.blockedDateEarliest = applicationContext
        .getUtilities()
        .formatDateString(blockedCase.automaticBlockedDate!, 'MMDDYY');
    }
  } else if (blockedCase.blocked) {
    blockedFormattedCase.blockedDateEarliest = applicationContext
      .getUtilities()
      .formatDateString(blockedCase.blockedDate!, 'MMDDYY');
  } else if (blockedCase.automaticBlocked) {
    blockedFormattedCase.blockedDateEarliest = applicationContext
      .getUtilities()
      .formatDateString(blockedCase.automaticBlockedDate!, 'MMDDYY');
  }
  return blockedFormattedCase;
};

export const blockedCasesReportHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): BlockedCaseReportHelperResults => {
  const blockedCases: RawCase[] = get(state.blockedCases);
  const { caseStatusFilter, procedureTypeFilter, reasonFilter } = get(
    state.blockedCaseReportFilter,
  );

  let blockedCasesFormatted: BlockedFormattedCase[] = [];
  let displayMessage: string | undefined;

  if (blockedCases && blockedCases.length) {
    blockedCasesFormatted = blockedCases
      .sort(applicationContext.getUtilities().compareCasesByDocketNumber)
      .map(blockedCase => {
        const blockedCaseWithConsolidatedProperties = applicationContext
          .getUtilities()
          .setConsolidationFlagsForDisplay(blockedCase);

        const updatedCase = {
          ...setFormattedBlockDates(
            blockedCaseWithConsolidatedProperties,
            applicationContext,
          ),
          caseTitle: applicationContext.getCaseTitle(
            blockedCase.caseCaption || '',
          ),
          docketNumberWithSuffix: blockedCase.docketNumberWithSuffix,
        };

        return updatedCase;
      })
      .filter(blockedCase => {
        return procedureTypeFilter && procedureTypeFilter !== 'All'
          ? blockedCase.procedureType === procedureTypeFilter
          : true;
      })
      .filter(blockedCase => {
        if (caseStatusFilter === 'All') return true;
        return blockedCase.status === caseStatusFilter;
      })
      .filter(blockedCase => {
        if (reasonFilter === 'All') return true;
        if (reasonFilter === 'Manual Block') return !!blockedCase.blockedReason;
        return blockedCase.automaticBlockedReason === reasonFilter;
      });
  }

  if (blockedCasesFormatted.length === 0) {
    displayMessage = 'There are no blocked cases for this location.';

    if (procedureTypeFilter && procedureTypeFilter !== 'All') {
      displayMessage = 'There are no blocked cases for this case type.';
    }
  }

  return {
    blockedCasesCount: blockedCasesFormatted.length,
    blockedCasesFormatted,
    displayMessage,
  };
};
