import { Case } from '@shared/business/entities/cases/Case';
import { Get } from 'cerebral';
import { HIGH_PRIORITY_SUFFIXES } from '@shared/business/entities/EntityConstants';
import {
  addGroupSymbol,
  compareTrialSessionEligibleCases,
  getPriorityGroups,
} from '@web-client/presenter/computeds/formattedEligibleCasesHelper';
// import { getBlockedCases } from '@web-api/persistence/elasticsearch/getBlockedCases';
import { setConsolidationFlagsForDisplay } from '@shared/business/utilities/setConsolidationFlagsForDisplay';
import { state } from '@web-client/presenter/app.cerebral';

const groupKeySymbol = Symbol('group');

export const trialLocationHelper = (
  get: Get,
): {
  location: string;
  formattedEligibleCases: any[];
} => {
  // const permissions = get(state.permissions)!;
  const { eligibleCases, location } = get(state.trialLocationPage);
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

  // const pageSize = 100;

  return {
    formattedEligibleCases: sortedEligibleCases,
    location: trialCityFormatted,
  };
};
