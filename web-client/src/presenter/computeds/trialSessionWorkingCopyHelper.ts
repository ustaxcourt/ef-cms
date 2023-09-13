import {
  ALLOWLIST_FEATURE_FLAGS,
  TRIAL_STATUS_TYPES,
  TrialStatusOption,
} from '@shared/business/entities/EntityConstants';
import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
import { isClosed, isLeadCase } from '@shared/business/entities/cases/Case';
import { omitBy, partition, pickBy } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';

const compareCasesByPractitioner = (a, b) => {
  const aCount =
    (a.privatePractitioners && a.privatePractitioners.length && 1) || 0;
  const bCount =
    (b.privatePractitioners && b.privatePractitioners.length && 1) || 0;

  return aCount - bCount;
};
const isMemberCaseWithoutCalendaredLead = (
  aCase: RawCase,
  scheduledCases: RawCase[],
): boolean => {
  const leadCase = scheduledCases.find(
    scheduledCase => scheduledCase.docketNumber === aCase.leadDocketNumber,
  );
  return !leadCase;
};

const isSoloCase = (aCase: RawCase): boolean => !aCase.leadDocketNumber;

const isTopLevelCase = (aCase: RawCase, scheduledCases: RawCase[]): boolean =>
  isLeadCase(aCase) ||
  isSoloCase(aCase) ||
  isMemberCaseWithoutCalendaredLead(aCase, scheduledCases);

const isOpenCaseInATrial = (aCase: RawCase): boolean =>
  !isClosed(aCase) && aCase.removedFromTrial !== true;

const isCaseTrialStatusEnabledInFilters = (
  calendaredCase: RawCase,
  caseMetadata: { [docketNumber: string]: { trialStatus: string } },
  enabledTrialStatusFilters: string[],
): boolean => {
  const isCaseWithoutTrialStatus =
    enabledTrialStatusFilters.includes('statusUnassigned') &&
    !caseMetadata[calendaredCase.docketNumber]?.trialStatus;

  const isCaseTrialStatusFilterEnabled = enabledTrialStatusFilters.includes(
    caseMetadata[calendaredCase.docketNumber]?.trialStatus,
  );

  return isCaseWithoutTrialStatus || isCaseTrialStatusFilterEnabled;
};

export const trialSessionWorkingCopyHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): {
  casesShownCount: number;
  formattedCases: any[];
  showPrintButton: boolean;
  trialStatusFilters: { key: string; label: string }[];
  trialStatusOptions: TrialStatusOption;
  unassignedLabel: 'Unassigned' | 'Trial Status';
  updatedTrialSessionTypesEnabled: boolean;
} => {
  const trialSession = get(state.trialSession);
  const {
    caseMetadata,
    filters,
    sort,
    sortOrder,
    userNotes = {},
  } = get(state.trialSessionWorkingCopy);

  //get an array of strings of the trial statuses that are set to true
  const enabledTrialStatusFilters = Object.keys(pickBy(filters));

  const formattedCases = (trialSession.calendaredCases || [])
    .slice()
    .filter(isOpenCaseInATrial)
    .filter(calendaredCase =>
      isCaseTrialStatusEnabledInFilters(
        calendaredCase,
        caseMetadata,
        enabledTrialStatusFilters,
      ),
    )
    .map(caseItem =>
      applicationContext
        .getUtilities()
        .formatCaseForTrialSession({ applicationContext, caseItem }),
    )
    .sort(applicationContext.getUtilities().compareCasesByDocketNumber)
    .map(aCase => {
      let userNotes1: string = '';
      if (userNotes[aCase.docketNumber]) {
        userNotes1 = userNotes[aCase.docketNumber].notes;
      }
      return { ...aCase, userNotes: userNotes1 };
    })
    .map(aCase => {
      const trialSessionCase = trialSession.caseOrder?.find(
        orderCase => orderCase.docketNumber === aCase.docketNumber,
      );
      let calendarNotes: string | undefined;
      if (trialSessionCase) {
        // eslint-disable-next-line prefer-destructuring
        calendarNotes = trialSessionCase.calendarNotes;
      }

      return { ...aCase, calendarNotes };
    })
    .map(aCase => {
      const nestedConsolidatedCases: (typeof aCase)[] = [];
      return { ...aCase, nestedConsolidatedCases };
    });

  const [topLevelCases, memberConsolidatedCases] = partition(
    formattedCases,
    aCase => isTopLevelCase(aCase, formattedCases),
  );

  memberConsolidatedCases.forEach(mCase => {
    const topCase = topLevelCases.find(
      c => c.docketNumber === mCase.leadDocketNumber,
    )!;

    topCase.nestedConsolidatedCases.push(mCase);
  });

  if (sort === 'practitioner') {
    topLevelCases.sort(compareCasesByPractitioner);
  }

  if (sortOrder === 'desc') {
    topLevelCases.reverse();
  }

  const updatedTrialSessionTypesEnabled: boolean = get(
    state.featureFlags[ALLOWLIST_FEATURE_FLAGS.UPDATED_TRIAL_STATUS_TYPES.key],
  );

  const unassignedLabel = updatedTrialSessionTypesEnabled
    ? 'Unassigned'
    : 'Trial Status';

  const trialStatusOptions = omitBy(TRIAL_STATUS_TYPES, statusType => {
    if (updatedTrialSessionTypesEnabled !== true) {
      return statusType.new === true;
    }
  });

  const trialStatusFilters = Object.keys(trialStatusOptions)
    .filter(option => {
      if (updatedTrialSessionTypesEnabled) {
        return !trialStatusOptions[option].deprecated;
      }
      return option;
    })
    .sort((a, b) => {
      if (updatedTrialSessionTypesEnabled) {
        return (
          trialStatusOptions[a].displayOrder -
          trialStatusOptions[b].displayOrder
        );
      }
      return 0;
    })
    .map(option => {
      return {
        key: option,
        label:
          !updatedTrialSessionTypesEnabled &&
          trialStatusOptions[option].legacyLabel
            ? trialStatusOptions[option].legacyLabel!
            : trialStatusOptions[option].label,
      };
    })
    .concat({
      key: 'statusUnassigned',
      label: updatedTrialSessionTypesEnabled
        ? 'Unassigned'
        : 'Status unassigned',
    });

  return {
    casesShownCount: formattedCases.length,
    formattedCases: topLevelCases,
    showPrintButton: formattedCases.length > 0,
    trialStatusFilters,
    trialStatusOptions,
    unassignedLabel,
    updatedTrialSessionTypesEnabled,
  };
};
