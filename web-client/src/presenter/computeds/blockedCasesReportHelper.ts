import { CaseStatus } from '@shared/business/entities/EntityConstants';
import { Get } from 'cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import { compareCasesByDocketNumber } from '@shared/business/utilities/trialSession/getFormattedTrialSessionDetails';
import { setConsolidationFlagsForDisplay } from '@shared/business/utilities/setConsolidationFlagsForDisplay';
import { Case } from '@shared/business/entities/cases/Case';
import { formatDateString } from '@shared/business/utilities/DateHandler';

export const blockedCasesReportHelper = (
  get: Get,
): {
  blockedCasesCount: number;
  blockedCasesFormatted: BlockedFormattedCase[];
} => {
  const blockedCases = get(state.blockedCases);
  const { caseStatusFilter, procedureTypeFilter, reasonFilter } = get(
    state.blockedCaseReportFilter,
  );

  const blockedCasesFormatted: BlockedFormattedCase[] = blockedCases
    .sort(compareCasesByDocketNumber)
    .map(blockedCase => {
      const blockedCaseWithConsolidatedProperties =
        setConsolidationFlagsForDisplay(blockedCase);

      return {
        ...blockedCaseWithConsolidatedProperties,
        caseTitle: Case.getCaseTitle(blockedCase.caseCaption || ''),
      };
    })
    .map(blockedCase => {
      let blockedDateEarliest: string = '';
      if (blockedCase.blockedDate && blockedCase.automaticBlocked) {
        if (blockedCase.blockedDate < blockedCase.automaticBlockedDate!) {
          blockedDateEarliest = formatDateString(
            blockedCase.blockedDate,
            'MMDDYY',
          );
        } else {
          blockedDateEarliest = formatDateString(
            blockedCase.automaticBlockedDate!,
            'MMDDYY',
          );
        }
      } else if (blockedCase.blocked) {
        blockedDateEarliest = formatDateString(
          blockedCase.blockedDate!,
          'MMDDYY',
        );
      } else if (blockedCase.automaticBlocked) {
        blockedDateEarliest = formatDateString(
          blockedCase.automaticBlockedDate!,
          'MMDDYY',
        );
      }

      return {
        ...blockedCase,
        blockedDateEarliest,
      };
    })
    .map(blockedCase => {
      if (!blockedCase.blocked && !blockedCase.automaticBlocked) {
        blockedCase.blockedReason = 'Grouped with blocked case';
      }
      return blockedCase;
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

  return {
    blockedCasesCount: blockedCasesFormatted.length,
    blockedCasesFormatted,
  };
};

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
