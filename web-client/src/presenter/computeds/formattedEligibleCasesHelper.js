import {
  formatCase,
  getSortableDocketNumber,
} from '../../../../shared/src/business/utilities/getFormattedTrialSessionDetails';
import { state } from 'cerebral';

const compareTrialSessionEligibleCases =
  ({ eligibleCases }) =>
  (a, b) => {
    if (a.isManuallyAdded && !b.isManuallyAdded) {
      return -1;
    } else if (!a.isManuallyAdded && b.isManuallyAdded) {
      return 1;
    } else if (a.highPriority && !b.highPriority) {
      return -1;
    } else if (!a.highPriority && b.highPriority) {
      return 1;
    } else if (a.isDocketSuffixHighPriority && !b.isDocketSuffixHighPriority) {
      return -1;
    } else if (!a.isDocketSuffixHighPriority && b.isDocketSuffixHighPriority) {
      return 1;
    } else if (
      (a.isManuallyAdded && b.isManuallyAdded) ||
      (a.highPriority && b.highPriority) ||
      (a.isDocketSuffixHighPriority && b.isDocketSuffixHighPriority)
    ) {
      let aSortString = getSortableDocketNumber(a.docketNumber);
      let bSortString = getSortableDocketNumber(b.docketNumber);
      return aSortString.localeCompare(bSortString);
    } else {
      let aSortString = getEligibleDocketNumberSortString({
        allCases: eligibleCases,
        caseToSort: a,
      });
      let bSortString = getEligibleDocketNumberSortString({
        allCases: eligibleCases,
        caseToSort: b,
      });
      return aSortString.localeCompare(bSortString);
    }
  };

const getEligibleDocketNumberSortString = ({ allCases, caseToSort }) => {
  const leadCase = allCases.find(
    aCase => aCase.docketNumber === caseToSort.leadDocketNumber,
  );

  const isLeadInEligible = !!caseToSort.leadDocketNumber && !!leadCase;

  const isLeadCaseManuallyAdded = leadCase?.isManuallyAdded;
  const isLeadCaseHighPriority = leadCase?.highPriority;
  const isLeadCaseDocketSuffixHighPriority =
    leadCase?.isDocketSuffixHighPriority;

  if (
    isLeadCaseManuallyAdded ||
    isLeadCaseHighPriority ||
    isLeadCaseDocketSuffixHighPriority
  ) {
    return `${getSortableDocketNumber(
      caseToSort.docketNumber,
    )}-${getSortableDocketNumber(caseToSort.docketNumber)}`;
  }

  return `${getSortableDocketNumber(
    isLeadInEligible
      ? caseToSort.docketNumber === caseToSort.leadDocketNumber
        ? caseToSort.docketNumber
        : caseToSort.leadDocketNumber
      : caseToSort.docketNumber,
  )}-${getSortableDocketNumber(caseToSort.docketNumber)}`;
};

exports.formattedEligibleCasesHelper = (get, applicationContext) => {
  const eligibleCases = get(state.trialSession.eligibleCases) ?? [];

  const sortedCases = eligibleCases
    .map(caseItem =>
      formatCase({ applicationContext, caseItem, eligibleCases }),
    )
    .sort(compareTrialSessionEligibleCases({ eligibleCases }))
    .map(caseItem =>
      applicationContext
        .getUtilities()
        .setConsolidationFlagsForDisplay(caseItem, eligibleCases),
    );

  return sortedCases;
};
