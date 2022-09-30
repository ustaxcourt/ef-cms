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
        theCase: a,
      });
      let bSortString = getEligibleDocketNumberSortString({
        allCases: eligibleCases,
        theCase: b,
      });
      return aSortString.localeCompare(bSortString);
    }
  };

const getEligibleDocketNumberSortString = ({ allCases, theCase }) => {
  const leadCase = allCases.find(
    aCase => aCase.docketNumber === theCase.leadDocketNumber,
  );

  const isLeadInEligible = !!theCase.leadDocketNumber && !!leadCase;

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
      theCase.docketNumber,
    )}-${getSortableDocketNumber(theCase.docketNumber)}`;
  }

  return `${getSortableDocketNumber(
    isLeadInEligible
      ? theCase.docketNumber === theCase.leadDocketNumber
        ? theCase.docketNumber
        : theCase.leadDocketNumber
      : theCase.docketNumber,
  )}-${getSortableDocketNumber(theCase.docketNumber)}`;
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
