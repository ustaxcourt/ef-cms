import { HIGH_PRIORITY_SUFFIXES } from '@shared/business/entities/EntityConstants';
import { Case } from '@shared/business/entities/cases/Case';
import { Get } from 'cerebral';
import {
  addGroupSymbol,
  compareTrialSessionEligibleCases,
  getPriorityGroups,
  groupKeySymbol,
} from '@web-client/presenter/computeds/formattedEligibleCasesHelper';
import { setConsolidationFlagsForDisplay } from '@shared/business/utilities/setConsolidationFlagsForDisplay';
import { state } from '@web-client/presenter/app.cerebral';
import {
  BlockedFormattedCase,
  groupCases,
  setFormattedBlockDates,
} from '@web-client/presenter/computeds/blockedCasesReportHelper';
import { EligibleCase } from '@shared/business/entities/cases/EligibleCase';

export const trialLocationHelper = (
  get: Get,
): {
  location: string;
  eligibleCasesForDisplay: (EligibleCase & { caseTitle: string })[];
  formattedBlockedCases: BlockedFormattedCase[];
  formattedEligibleCases: (EligibleCase & { caseTitle: string })[];
  totalPagesEligible: number;
  blockedCasesForDisplay: BlockedFormattedCase[];
  totalPagesBlocked: number;
  isExportDisabled: boolean;
} => {
  const pageSize = 100;

  const { blockedCasesPage, eligibleCases, eligibleCasesPage, location } = get(
    state.trialLocationPage,
  );

  const blockedCases = get(state.blockedCases);
  const groupedCases = groupCases(blockedCases);

  const formattedBlockedCases = [...groupedCases.entries()]
    .sort((a, b) => {
      return Case.docketNumberSort(a[0], b[0]);
    })
    .map(([_, value]) => {
      return value.sort((a, b) =>
        Case.docketNumberSort(a.docketNumber, b.docketNumber),
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
      return setFormattedBlockDates(blockedCase, groupedCases);
    })
    .map(blockedCase => {
      if (!blockedCase.blocked && !blockedCase.automaticBlocked) {
        blockedCase.blockedReason = 'Grouped with blocked case';
      }
      return blockedCase;
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

  const currentTab = get(state.trialLocationPage.currentTab);

  const isExportDisabled =
    (currentTab === 'eligibleCases' && formattedEligibleCases.length === 0) ||
    (currentTab === 'blockedCases' && formattedBlockedCases.length === 0);

  return {
    blockedCasesForDisplay,
    eligibleCasesForDisplay,
    formattedBlockedCases,
    formattedEligibleCases: sortedEligibleCases,
    location,
    isExportDisabled,
    totalPagesBlocked: Math.ceil(formattedBlockedCases.length / pageSize),
    totalPagesEligible: Math.ceil(sortedEligibleCases.length / pageSize),
  };
};
