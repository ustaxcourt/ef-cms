import { CaseStatus } from '@shared/business/entities/EntityConstants';
import { Get } from 'cerebral';
import { formatDateString } from '@shared/business/utilities/DateHandler';
import { state } from '@web-client/presenter/app.cerebral';
import { setConsolidationFlagsForDisplay } from '@shared/business/utilities/setConsolidationFlagsForDisplay';
import { Case } from '@shared/business/entities/cases/Case';
import { BlockedCaseData } from '@web-api/persistence/postgres/cases/reports/getBlockedCasesForTrialLocation';

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

  const groupedCases = groupCases(blockedCases);

  const blockedCasesFormatted = [...groupedCases.entries()]
    .filter(([_docketNumber, group]) => {
      return group.some(blockedCase => {
        return procedureTypeFilter && procedureTypeFilter !== 'All'
          ? blockedCase.procedureType === procedureTypeFilter
          : true;
      });
    })
    .filter(([_docketNumber, group]) => {
      return group.some(blockedCase => {
        if (caseStatusFilter === 'All') return true;
        return blockedCase.status === caseStatusFilter;
      });
    })
    .filter(([_docketNumber, group]) => {
      return group.some(blockedCase => {
        if (reasonFilter === 'All') return true;
        if (reasonFilter === 'Manual Block') return !!blockedCase.blockedReason;
        if (reasonFilter === 'Grouped with blocked case') {
          return !blockedCase.blocked && !blockedCase.automaticBlocked;
        }
        return blockedCase.automaticBlockedReason === reasonFilter;
      });
    })
    .sort((a, b) => {
      return Case.docketNumberSort(a[0], b[0]);
    })
    .map(([_, value]) => {
      return value.sort(
        (a, b) => Case.docketNumberSort(a.docketNumber, b.docketNumber), // This is for internal sorting of consolidated group
      );
    })
    .flat()
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
      } else {
        const blockedDate = getBlockedDateFromBlockedGroup(
          blockedCase.leadDocketNumber!,
          groupedCases,
        );
        blockedDateEarliest = formatDateString(blockedDate, 'MMDDYY');
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
    });

  return {
    blockedCasesCount: blockedCasesFormatted.length,
    blockedCasesFormatted,
  };
};

function getBlockedDateFromBlockedGroup(
  leadDocketNumber: string,
  blockCaseGroups: Map<string, BlockedCaseData[]>,
) {
  const cases = blockCaseGroups.get(leadDocketNumber);
  if (!cases || cases.length === 0) return undefined;

  return cases
    .flatMap(({ blockedDate, automaticBlockedDate }) => [
      blockedDate,
      automaticBlockedDate,
    ])
    .filter((date): date is string => !!date)
    .sort()[0];
}

function groupCases(cases: BlockedCaseData[]): Map<string, BlockedCaseData[]> {
  const leadDocketNumberMap: Map<string, BlockedCaseData[]> = new Map();

  cases.forEach(c => {
    if (c.leadDocketNumber) {
      const consolidatedGroup =
        leadDocketNumberMap.get(c.leadDocketNumber) || [];
      consolidatedGroup.push(c);
      leadDocketNumberMap.set(c.leadDocketNumber, consolidatedGroup);
    } else {
      leadDocketNumberMap.set(c.docketNumber, [c]);
    }
  });

  return leadDocketNumberMap;
}

export type BlockedFormattedCase = {
  docketNumber: string;
  inConsolidatedGroup: boolean;
  consolidatedIconTooltipText?: string;
  isLeadCase: boolean;
  blockedDateEarliest: string;
  caseTitle: string;
  procedureType: string;
  status: CaseStatus;
  blockedReason?: string;
  automaticBlockedReason?: string;
  docketNumberWithSuffix?: string;
  leadDocketNumber?: string;
};
