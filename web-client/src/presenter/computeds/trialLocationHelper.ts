import { HIGH_PRIORITY_SUFFIXES } from '@shared/business/entities/EntityConstants';
import { Case } from '@shared/business/entities/cases/Case';
import { Get } from 'cerebral';
import {
  addGroupSymbol,
  compareTrialSessionEligibleCases,
  getPriorityGroups,
  groupKeySymbol,
} from '@web-client/presenter/computeds/formattedEligibleCasesHelper';
import { compareCasesByDocketNumber } from '@shared/business/utilities/trialSession/getFormattedTrialSessionDetails';
import { setConsolidationFlagsForDisplay } from '@shared/business/utilities/setConsolidationFlagsForDisplay';
import { formatDateString } from '@shared/business/utilities/DateHandler';
import { state } from '@web-client/presenter/app.cerebral';
import { BlockedFormattedCase } from '@web-client/presenter/computeds/blockedCasesReportHelper';

export const trialLocationHelper = (
  get: Get,
): {
  location: string;
  eligibleCasesForDisplay: any[];
  formattedBlockedCases: any[];
  formattedEligibleCases: any[];
  totalPagesEligible: number;
  blockedCasesForDisplay: any[];
  totalPagesBlocked: number;
} => {
  const pageSize = 3;

  const { blockedCasesPage, eligibleCases, eligibleCasesPage, location } = get(
    state.trialLocationPage,
  );

  const blockedCases = get(state.blockedCases);

  const formattedBlockedCases = blockedCases
    .sort(compareCasesByDocketNumber)
    .map(blockedCase =>
      setConsolidationFlagsForDisplay(blockedCase, blockedCases),
    )
    .map(blockedCase => {
      const updatedCase = {
        ...setFormattedBlockDates(blockedCase),
        caseTitle: Case.getCaseTitle(blockedCase.caseCaption || ''),
      };

      return updatedCase;
    });

  const formattedEligibleCases = eligibleCases.map(c => {
    const isDocketSuffixHighPriority = HIGH_PRIORITY_SUFFIXES.includes(
      c.docketNumberSuffix!,
    );
    const caseTitle = Case.getCaseTitle(c.caseCaption);

    return {
      ...c,
      caseTitle,
      isDocketSuffixHighPriority,
    };
  });

  const groups = getPriorityGroups(formattedEligibleCases);

  const sortedEligibleCases = formattedEligibleCases
    .map(caseItem => {
      return addGroupSymbol(
        setConsolidationFlagsForDisplay(
          caseItem,
          groups[caseItem[groupKeySymbol]],
        ),
        caseItem[groupKeySymbol],
      );
    })
    .sort(compareTrialSessionEligibleCases(formattedEligibleCases));

  const eligibleCasesForDisplay = sortedEligibleCases.slice(
    eligibleCasesPage * pageSize,
    eligibleCasesPage * pageSize + pageSize,
  );

  const blockedCasesForDisplay = formattedBlockedCases.slice(
    blockedCasesPage * pageSize,
    blockedCasesPage * pageSize + pageSize,
  );

  return {
    blockedCasesForDisplay,
    eligibleCasesForDisplay,
    formattedBlockedCases,
    formattedEligibleCases,
    location,
    totalPagesBlocked: Math.ceil(formattedBlockedCases.length / pageSize),
    totalPagesEligible: Math.ceil(sortedEligibleCases.length / pageSize),
  };
};

const setFormattedBlockDates = (
  blockedCase: RawCase & {
    inConsolidatedGroup: boolean;
    consolidatedIconTooltipText: string;
    shouldIndent: boolean;
    isLeadCase: boolean;
  },
): BlockedFormattedCase => {
  const blockedFormattedCase: BlockedFormattedCase = {
    ...blockedCase,
    blockedDateEarliest: '',
    caseTitle: '',
  };

  if (blockedCase.blockedDate && blockedCase.automaticBlocked) {
    if (blockedCase.blockedDate < blockedCase.automaticBlockedDate!) {
      blockedFormattedCase.blockedDateEarliest = formatDateString(
        blockedCase.blockedDate,
        'MMDDYY',
      );
    } else {
      blockedFormattedCase.blockedDateEarliest = formatDateString(
        blockedCase.automaticBlockedDate!,
        'MMDDYY',
      );
    }
  } else if (blockedCase.blocked) {
    blockedFormattedCase.blockedDateEarliest = formatDateString(
      blockedCase.blockedDate!,
      'MMDDYY',
    );
  } else if (blockedCase.automaticBlocked) {
    blockedFormattedCase.blockedDateEarliest = formatDateString(
      blockedCase.automaticBlockedDate!,
      'MMDDYY',
    );
  }
  return blockedFormattedCase;
};
