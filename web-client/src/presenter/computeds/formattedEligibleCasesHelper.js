import { DOCKET_NUMBER_SUFFIXES } from '../../../../shared/src/business/entities/EntityConstants';
import { formatCase } from '../../../../shared/src/business/utilities/getFormattedTrialSessionDetails';
import { setConsolidationFlagsForDisplay } from '../../../../shared/src/business/utilities/setConsolidationFlagsForDisplay';
import { state } from 'cerebral';

const compareTrialSessionEligibleCases = eligibleCases => (a, b) => {
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
    let aSortString = getFullSortString(a, eligibleCases);
    let bSortString = getFullSortString(b, eligibleCases);
    return aSortString.localeCompare(bSortString);
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

exports.formattedEligibleCasesHelper = (get, applicationContext) => {
  const eligibleCases = get(state.trialSession.eligibleCases) ?? [];

  const filter = get(
    state.screenMetadata.eligibleCasesFilter.hybridSessionFilter,
  );

  const sortedCases = eligibleCases
    .map(caseItem =>
      formatCase({ applicationContext, caseItem, eligibleCases }),
    )
    .sort(compareTrialSessionEligibleCases(eligibleCases))
    .map(caseItem => setConsolidationFlagsForDisplay(caseItem, eligibleCases))
    .filter(eligibleCase => {
      if (filter === 'Small') {
        return (
          eligibleCase.docketNumberSuffix === DOCKET_NUMBER_SUFFIXES.SMALL ||
          eligibleCase.docketNumberSuffix ===
            DOCKET_NUMBER_SUFFIXES.SMALL_LIEN_LEVY
        );
      } else if (filter === 'Regular') {
        return (
          eligibleCase.docketNumberSuffix === null ||
          (eligibleCase.docketNumberSuffix !== DOCKET_NUMBER_SUFFIXES.SMALL &&
            eligibleCase.docketNumberSuffix !==
              DOCKET_NUMBER_SUFFIXES.SMALL_LIEN_LEVY)
        );
      } else {
        return true;
      }
    });

  return sortedCases;
};
