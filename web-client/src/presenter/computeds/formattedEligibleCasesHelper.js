import {
  compareCasesByDocketNumber,
  formatCase,
} from '../../../../shared/src/business/utilities/getFormattedTrialSessionDetails';
import { setConsolidationFlagsForDisplay } from '../../../../shared/src/business/utilities/setConsolidationFlagsForDisplay';
import { state } from 'cerebral';

const compareTrialSessionEligibleCases =
  (docketNumberSortFunction = compareCasesByDocketNumber) =>
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
    } else {
      return docketNumberSortFunction(a, b);
    }
  };

const getSortableDocketNumber = docketNumber => {
  const [number, year] = docketNumber.split('-');
  return `${year}-${number.padStart(6, '0')}`;
};

const getFullSortString = (theCase, cases) => {
  const leadCase = cases.find(
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

const compareTrialSessionEligibleCasesGroupsFactory =
  eligibleCases => (a, b) => {
    if (!a || !a.docketNumber || !b || !b.docketNumber) {
      return 0;
    }

    let aSortString = getFullSortString(a, eligibleCases);
    let bSortString = getFullSortString(b, eligibleCases);
    return aSortString.localeCompare(bSortString);
  };

exports.formattedEligibleCasesHelper = (get, applicationContext) => {
  const eligibleCases = get(state.trialSession.eligibleCases) ?? [];

  const sortedCases = eligibleCases
    .map(caseItem =>
      formatCase({ applicationContext, caseItem, eligibleCases }),
    )
    .sort(
      compareTrialSessionEligibleCases(
        compareTrialSessionEligibleCasesGroupsFactory(eligibleCases),
      ),
    )
    .map(caseItem => setConsolidationFlagsForDisplay(caseItem, eligibleCases));

  return sortedCases;
};
