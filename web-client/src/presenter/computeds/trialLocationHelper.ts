import { Case } from '@shared/business/entities/cases/Case';
import { Get } from 'cerebral';
import { HIGH_PRIORITY_SUFFIXES } from '@shared/business/entities/EntityConstants';
import {
  addGroupSymbol,
  compareTrialSessionEligibleCases,
  getPriorityGroups,
  groupKeySymbol,
} from '@web-client/presenter/computeds/formattedEligibleCasesHelper';
import { setConsolidationFlagsForDisplay } from '@shared/business/utilities/setConsolidationFlagsForDisplay';
import { state } from '@web-client/presenter/app.cerebral';

export const trialLocationHelper = (
  get: Get,
): {
  location: string;
  eligibleCasesForDisplay: any[];
  blockedCases: RawCase[];
  formattedEligibleCases: any[];
  totalPages: number;
} => {
  const pageSize = 100;

  const { eligibleCases, eligibleCasesPage, location } = get(
    state.trialLocationPage,
  );

  const formattedEligibleCases = eligibleCases.map(c => {
    let privatePractitioners: string[] = [];
    if (c.privatePractitioners) {
      privatePractitioners = c.privatePractitioners.map(practitioner => {
        return practitioner.name;
      });
    }
    let irsPractitioners: string[] = [];
    if (c.irsPractitioners) {
      irsPractitioners = c.irsPractitioners.map(practitioner => {
        return practitioner.name;
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

  return {
    blockedCases: get(state.blockedCases),
    eligibleCasesForDisplay,
    formattedEligibleCases,
    location: trialCityFormatted,
    totalPages: Math.ceil(sortedEligibleCases.length / pageSize),
  };
};
