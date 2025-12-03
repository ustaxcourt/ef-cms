import { state } from '@web-client/presenter/app.cerebral';
import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
import { FormattedTrialSessionCase } from '@shared/business/utilities/trialSession/getFormattedTrialSessionDetails';
import { TRIAL_SESSION_ELIGIBLE_CASES_BUFFER } from '@shared/business/entities/EntityConstants';
import { EligibleCase } from '@shared/business/entities/cases/EligibleCase';

export const groupKeySymbol = Symbol('group');

export const addGroupSymbol = (object, value) => {
  Object.defineProperty(object, groupKeySymbol, {
    enumerable: false,
    value,
    writable: true,
  });
  return object;
};

export const getPriorityGroups = eligibleCases => {
  const groups = {
    default: [] as (FormattedTrialSessionCase | EligibleCase)[],
    manuallyAdded: [] as (FormattedTrialSessionCase | EligibleCase)[],
    suffixHighPriority: [] as (FormattedTrialSessionCase | EligibleCase)[],
  };

  eligibleCases.forEach(theCase => {
    if (theCase.isManuallyAdded) {
      addGroupSymbol(theCase, 'manuallyAdded');
      groups.manuallyAdded.push(theCase);
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

const getFullSortString = theCase => {
  let priorityPrefix = '';

  if (theCase.isAgedCase) {
    priorityPrefix += 'A';
  }
  if (theCase.isManuallyAdded) {
    priorityPrefix += 'B';
  }
  if (theCase.isDocketSuffixHighPriority) {
    priorityPrefix += 'C';
  }

  priorityPrefix += 'D';

  return `${priorityPrefix}_${getSortableDocketNumber(theCase.docketNumber)}`;
};

export const compareTrialSessionEligibleCases = () => {
  return (a, b) => {
    const aSortString = getFullSortString(a);
    const bSortString = getFullSortString(b);
    return aSortString.localeCompare(bSortString);
  };
};

export const getFormattedEligibleCases = formattedCases => {
  const memberCasesObj = {} as Record<
    string,
    EligibleCase[] | FormattedTrialSessionCase[]
  >;

  formattedCases.forEach(caseItem => {
    if (
      caseItem.leadDocketNumber &&
      caseItem.leadDocketNumber !== caseItem.docketNumber
    ) {
      const { leadDocketNumber } = caseItem;
      if (!memberCasesObj[leadDocketNumber])
        memberCasesObj[leadDocketNumber] = [];
      memberCasesObj[leadDocketNumber].push(caseItem);
    }
  });

  formattedCases.forEach(caseItem => {
    if (
      caseItem.leadDocketNumber &&
      caseItem.leadDocketNumber === caseItem.docketNumber &&
      memberCasesObj[caseItem.leadDocketNumber]
    ) {
      caseItem.memberCases = memberCasesObj[caseItem.leadDocketNumber];
      caseItem.memberCases.sort((a, b) => {
        const aSortString = getFullSortString(a);
        const bSortString = getFullSortString(b);
        return aSortString.localeCompare(bSortString);
      });
    }
  });

  const formattedCasesWithoutMembers = formattedCases.filter(caseItem => {
    return !(
      caseItem.leadDocketNumber &&
      caseItem.leadDocketNumber !== caseItem.docketNumber
    );
  });

  return formattedCasesWithoutMembers;
};

export const formattedEligibleCasesHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): any => {
  const { DOCKET_NUMBER_SUFFIXES } = applicationContext.getConstants();
  const { formatCaseForTrialSession, setConsolidationFlagsForDisplay } =
    applicationContext.getUtilities();

  const eligibleCases = get(state.trialSession.eligibleCases) ?? [];

  const { maxCases, caseOrder } = get(state.trialSession);
  const caseLimit =
    maxCases! + (TRIAL_SESSION_ELIGIBLE_CASES_BUFFER - caseOrder.length);

  const filter = get(
    state.screenMetadata.eligibleCasesFilter.hybridSessionFilter,
  );

  const formattedCases = eligibleCases.map(caseItem =>
    formatCaseForTrialSession({ applicationContext, caseItem, eligibleCases }),
  );

  const formattedCasesWithoutMembers =
    getFormattedEligibleCases(formattedCases);

  const groups = getPriorityGroups(formattedCasesWithoutMembers);

  const sortedCases = formattedCasesWithoutMembers
    .map(caseItem => {
      return addGroupSymbol(
        setConsolidationFlagsForDisplay(
          caseItem,
          groups[caseItem[groupKeySymbol]],
        ),
        caseItem[groupKeySymbol],
      );
    })
    .sort(compareTrialSessionEligibleCases())
    .filter(eligibleCase => {
      if (filter === 'Small') {
        return (
          eligibleCase.docketNumberSuffix === DOCKET_NUMBER_SUFFIXES.SMALL ||
          eligibleCase.docketNumberSuffix ===
            DOCKET_NUMBER_SUFFIXES.SMALL_LIEN_LEVY
        );
      } else if (filter === 'Regular') {
        return (
          !eligibleCase.docketNumberSuffix ||
          (eligibleCase.docketNumberSuffix !== DOCKET_NUMBER_SUFFIXES.SMALL &&
            eligibleCase.docketNumberSuffix !==
              DOCKET_NUMBER_SUFFIXES.SMALL_LIEN_LEVY)
        );
      } else {
        return true;
      }
    })
    .splice(0, caseLimit); //10493: consider removing limit entirely

  const flattenedCases = sortedCases.reduce((acc, c) => {
    acc.push(c);
    if (c.memberCases) {
      acc = acc.concat(c.memberCases);
    }
    return acc;
  }, []);

  return flattenedCases;
};
