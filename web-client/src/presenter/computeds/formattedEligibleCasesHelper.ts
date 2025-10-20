import { state } from '@web-client/presenter/app.cerebral';
import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
import { FormattedTrialSessionCase } from '@shared/business/utilities/trialSession/getFormattedTrialSessionDetails';
import { TRIAL_SESSION_ELIGIBLE_CASES_BUFFER } from '@shared/business/entities/EntityConstants';

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
    default: [] as FormattedTrialSessionCase[],
    manuallyAdded: [] as FormattedTrialSessionCase[],
    suffixHighPriority: [] as FormattedTrialSessionCase[],
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

export const sortEligbleCases = (cases, formattedCases) =>
  // Sort by default group (lowest priority)
  cases
    .sort((a, b) => {
      if (a[groupKeySymbol] === 'default' && b[groupKeySymbol] === 'default') {
        const aSortable = getSortableDocketNumber(a.docketNumber);
        const bSortable = getSortableDocketNumber(b.docketNumber);
        return aSortable.localeCompare(bSortable);
      }
      return 0;
    })
    // Sort by suffixHighPriority group (medium priority)
    .sort((a, b) => {
      if (
        a[groupKeySymbol] === 'suffixHighPriority' &&
        b[groupKeySymbol] === 'suffixHighPriority'
      ) {
        const aSortable = getSortableDocketNumber(a.docketNumber);
        const bSortable = getSortableDocketNumber(b.docketNumber);
        return aSortable.localeCompare(bSortable);
      }
      if (a[groupKeySymbol] === 'suffixHighPriority') return -1;
      if (b[groupKeySymbol] === 'suffixHighPriority') return 1;
      return 0;
    })
    // Sort by manuallyAdded group (highest priority)
    .sort((a, b) => {
      if (
        a[groupKeySymbol] === 'manuallyAdded' &&
        b[groupKeySymbol] === 'manuallyAdded'
      ) {
        const aSortable = getSortableDocketNumber(a.docketNumber);
        const bSortable = getSortableDocketNumber(b.docketNumber);
        return aSortable.localeCompare(bSortable);
      }
      if (a[groupKeySymbol] === 'manuallyAdded') return -1;
      if (b[groupKeySymbol] === 'manuallyAdded') return 1;
      return 0;
    })
    // Group consolidated cases together with lead case first
    .sort((a, b) => {
      const aLeadDocket = a.leadDocketNumber || a.docketNumber;
      const bLeadDocket = b.leadDocketNumber || b.docketNumber; // Fixed: was b.leadDocketNumber

      // Get the priority group of the lead case for each consolidation group
      const aLeadCase = formattedCases.find(
        c => c.docketNumber === aLeadDocket,
      );
      const bLeadCase = formattedCases.find(
        c => c.docketNumber === bLeadDocket,
      );

      const aLeadPriority = aLeadCase?.[groupKeySymbol] || 'default';
      const bLeadPriority = bLeadCase?.[groupKeySymbol] || 'default';

      // Sort consolidation groups by their lead case priority
      const priorityOrder = {
        manuallyAdded: 0,
        suffixHighPriority: 1,
        default: 2,
      };
      const priorityCompare =
        priorityOrder[aLeadPriority] - priorityOrder[bLeadPriority];
      if (priorityCompare !== 0) return priorityCompare;

      // Within same priority, sort by lead docket number
      if (aLeadDocket !== bLeadDocket) {
        const aLeadSortable = getSortableDocketNumber(aLeadDocket);
        const bLeadSortable = getSortableDocketNumber(bLeadDocket);
        return aLeadSortable.localeCompare(bLeadSortable);
      }

      // Within same consolidation group, lead case first, then members by docket number
      if (!a.leadDocketNumber && b.leadDocketNumber) return -1;
      if (a.leadDocketNumber && !b.leadDocketNumber) return 1;

      if (a.leadDocketNumber && b.leadDocketNumber) {
        const aSortable = getSortableDocketNumber(a.docketNumber);
        const bSortable = getSortableDocketNumber(b.docketNumber);
        return aSortable.localeCompare(bSortable);
      }

      return 0;
    })
    .sort((a, b) => b.isAgedCase - a.isAgedCase);

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

  const groups = getPriorityGroups(formattedCases);

  const mappedCases = formattedCases.map(caseItem => {
    return addGroupSymbol(
      setConsolidationFlagsForDisplay(
        caseItem,
        groups[caseItem[groupKeySymbol]],
      ),
      caseItem[groupKeySymbol],
    );
  });

  const sortedCases = sortEligbleCases(mappedCases, formattedCases)
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

  return sortedCases;
};
