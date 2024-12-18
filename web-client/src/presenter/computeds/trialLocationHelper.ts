import {
  CASE_STATUS_TYPES,
  CaseStatus,
  HIGH_PRIORITY_SUFFIXES,
} from '@shared/business/entities/EntityConstants';
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
import { setFormattedBlockDates } from '@web-client/presenter/computeds/blockedCasesReportHelper';
import { state } from '@web-client/presenter/app.cerebral';

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

  const statusFilter: CaseStatus[] = [
    CASE_STATUS_TYPES.generalDocketReadyForTrial,
    CASE_STATUS_TYPES.generalDocket,
    CASE_STATUS_TYPES.assignedCase,
    CASE_STATUS_TYPES.assignedMotion,
  ];

  const filteredBlockedCases = blockedCases.filter(blockedCase =>
    statusFilter.includes(blockedCase.status),
  );
  const formattedBlockedCases = filteredBlockedCases
    .sort(compareCasesByDocketNumber)
    .map(blockedCase => {
      // const blockedCaseWithConsolidatedProperties =
      //   setConsolidationFlagsForDisplay(blockedCase);

      const updatedCase = {
        ...setFormattedBlockDates(blockedCase),
        caseTitle: Case.getCaseTitle(blockedCase.caseCaption || ''),
      };

      return updatedCase;
    });

  const formattedEligibleCases = eligibleCases.map(c => {
    let privatePractitioners: string[] = [];
    if (c.privatePractitioners) {
      privatePractitioners = '';
      c.privatePractitioners.forEach(practitioner => {
        return (privatePractitioners += ` ${practitioner.name}`);
      });
    }
    let irsPractitioners: string[] = [];
    if (c.irsPractitioners) {
      irsPractitioners = '';
      c.irsPractitioners.forEach(practitioner => {
        return (irsPractitioners += ` ${practitioner.name}`);
      });
    }
    const isDocketSuffixHighPriority = HIGH_PRIORITY_SUFFIXES.includes(
      c.docketNumberSuffix!,
    );
    const caseTitle = Case.getCaseTitle(c.caseCaption);

    return {
      ...c,
      caseTitle,
      irsPractitioners,
      isDocketSuffixHighPriority,
      privatePractitioners,
    };
  });

  const trialCityFormatted = location.replace('-', ', ');

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
    location: trialCityFormatted,
    totalPagesBlocked: Math.ceil(formattedBlockedCases.length / pageSize),
    totalPagesEligible: Math.ceil(sortedEligibleCases.length / pageSize),
  };
};
