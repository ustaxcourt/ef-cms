import {
  ALLOWLIST_FEATURE_FLAGS,
  CASE_STATUS_TYPES,
  TRIAL_STATUS_TYPES,
  TrialStatusOption,
} from '@shared/business/entities/EntityConstants';
import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
import { isLeadCase } from '@shared/business/entities/cases/Case';
import { omitBy, pickBy } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';

const compareCasesByPractitioner = (a, b) => {
  const aCount =
    (a.privatePractitioners && a.privatePractitioners.length && 1) || 0;
  const bCount =
    (b.privatePractitioners && b.privatePractitioners.length && 1) || 0;

  return aCount - bCount;
};

const isLeadOrSoloCase = (aCase: RawCase): boolean =>
  isLeadCase(aCase) || !aCase.leadDocketNumber;

const appendNestedConsolidatedCases = (
  leadsAndSolo: RawCase,
  formattedCases: Array<RawCase>,
): RawCase & { nestedConsolidatedCases: RawCase[] } => {
  return {
    ...leadsAndSolo,
    nestedConsolidatedCases: leadsAndSolo.consolidatedCases
      .filter(caseDTO => caseDTO.status === CASE_STATUS_TYPES.calendared)
      .filter(caseDTO => caseDTO.leadDocketNumber !== caseDTO.docketNumber)
      .map(caseDTO =>
        formattedCases.find(
          calenCase => calenCase.docketNumber === caseDTO.docketNumber,
        ),
      ),
  };
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
  const trueFilters = Object.keys(pickBy(filters));

  const formattedCases = (trialSession.calendaredCases || [])
    .slice()
    .filter(
      calendaredCase =>
        !applicationContext.getUtilities().isClosed(calendaredCase) &&
        calendaredCase.removedFromTrial !== true,
    )
    .filter(
      calendaredCase =>
        (trueFilters.includes('statusUnassigned') &&
          (!caseMetadata[calendaredCase.docketNumber] ||
            !caseMetadata[calendaredCase.docketNumber].trialStatus)) ||
        (caseMetadata[calendaredCase.docketNumber] &&
          trueFilters.includes(
            caseMetadata[calendaredCase.docketNumber].trialStatus,
          )),
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
    });

  const casesWithNestedConsolidatedCases = formattedCases
    .filter(isLeadOrSoloCase)
    .map(aCase => appendNestedConsolidatedCases(aCase, formattedCases));

  if (sort === 'practitioner') {
    casesWithNestedConsolidatedCases.sort(compareCasesByPractitioner);
  }

  if (sortOrder === 'desc') {
    casesWithNestedConsolidatedCases.reverse();
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
    formattedCases: casesWithNestedConsolidatedCases,
    showPrintButton: formattedCases.length > 0,
    trialStatusFilters,
    trialStatusOptions,
    unassignedLabel,
    updatedTrialSessionTypesEnabled,
  };
};
