import { DOCKET_NUMBER_SUFFIXES } from '../../../../shared/src/business/entities/EntityConstants';
import { formatCase } from '../../../../shared/src/business/utilities/getFormattedTrialSessionDetails';
import { setConsolidationFlagsForDisplay } from '../../../../shared/src/business/utilities/setConsolidationFlagsForDisplay';
import { state } from 'cerebral';

const groupKeySymbol = Symbol('group');

const addGroupSymbol = (object, value) => {
  Object.defineProperty(object, groupKeySymbol, {
    enumerable: false,
    value,
    writable: true,
  });
  return object;
};

const getPriorityGroups = eligibleCases => {
  const groups = {
    default: [],
    highPriority: [],
    manuallyAdded: [],
    suffixHighPriority: [],
  };

  eligibleCases.forEach(theCase => {
    if (theCase.isManuallyAdded) {
      addGroupSymbol(theCase, 'manuallyAdded');
      groups.manuallyAdded.push(theCase);
    } else if (theCase.highPriority) {
      addGroupSymbol(theCase, 'highPriority');
      groups.highPriority.push(theCase);
    } else if (theCase.isDocketSuffixHighPriority) {
      addGroupSymbol(theCase, 'suffixHighPriority');
      groups.suffixHighPriority.push(theCase);
    } else {
      addGroupSymbol(theCase, 'default');
      groups.default.push(theCase);
    }
  });

  return groups;
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

  let priorityPrefix = 'D';

  if (theCase.isManuallyAdded) {
    priorityPrefix = 'A';
  } else if (theCase.highPriority) {
    priorityPrefix = 'B';
  } else if (theCase.isDocketSuffixHighPriority) {
    priorityPrefix = 'C';
  }

  return `${priorityPrefix}_${getSortableDocketNumber(
    isLeadInEligible
      ? theCase.docketNumber === theCase.leadDocketNumber
        ? theCase.docketNumber
        : theCase.leadDocketNumber
      : theCase.docketNumber,
  )}-${getSortableDocketNumber(theCase.docketNumber)}`;
};

const compareTrialSessionEligibleCases = eligibleCases => {
  const groups = getPriorityGroups(eligibleCases);

  return (a, b) => {
    const aSortString = getFullSortString(a, groups[a[groupKeySymbol]]);
    const bSortString = getFullSortString(b, groups[b[groupKeySymbol]]);
    return aSortString.localeCompare(bSortString);
  };
};

exports.formattedEligibleCasesHelper = (get, applicationContext) => {
  const eligibleCases = get(state.trialSession.eligibleCases) ?? [];

  const filter = get(
    state.screenMetadata.eligibleCasesFilter.hybridSessionFilter,
  );

  const formattedCases = eligibleCases.map(caseItem =>
    formatCase({ applicationContext, caseItem, eligibleCases }),
  );

  const groups = getPriorityGroups(formattedCases);

  const sortedCases = formattedCases
    .map(caseItem => {
      return addGroupSymbol(
        setConsolidationFlagsForDisplay(
          caseItem,
          groups[caseItem[groupKeySymbol]],
        ),
        caseItem[groupKeySymbol],
      );
    })
    .sort(compareTrialSessionEligibleCases(eligibleCases))
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
