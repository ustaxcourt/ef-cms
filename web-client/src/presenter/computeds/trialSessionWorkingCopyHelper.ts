import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
import {
  TRIAL_STATUS_TYPES,
  TrialStatusOption,
} from '@shared/business/entities/EntityConstants';
import { TrialSessionState } from '@web-client/presenter/state/trialSessionState';
import { UserCaseNote } from '@shared/business/entities/notes/UserCaseNote';
import { compareCasesByDocketNumber } from '@shared/business/utilities/getFormattedTrialSessionDetails';
import { isClosed, isLeadCase } from '@shared/business/entities/cases/Case';
import { partition, pickBy } from 'lodash';
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

const appendUserNotes = <T>(
  aCase: { docketNumber: string } & T,
  userNotesDictionary: {
    [docketNumber: string]: UserCaseNote;
  },
): T & { userNotes: string } => {
  const userNotes: string = userNotesDictionary[aCase.docketNumber]
    ? userNotesDictionary[aCase.docketNumber].notes
    : '';
  return { ...aCase, userNotes };
};

const appendCalendarNotes = <T>(
  aCase: { docketNumber: string } & T,
  trialSession: TrialSessionState,
): T & { calendarNotes: string } => {
  const trialSessionCase = trialSession.caseOrder?.find(
    orderCase => orderCase.docketNumber === aCase.docketNumber,
  );
  const calendarNotes = trialSessionCase ? trialSessionCase.calendarNotes : '';
  return { ...aCase, calendarNotes: calendarNotes || '' };
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
    .sort(compareCasesByDocketNumber)
    .map(aCase => appendUserNotes(aCase, userNotes))
    .map(aCase => appendCalendarNotes(aCase, trialSession))
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

  const trialStatusFilters = Object.keys(TRIAL_STATUS_TYPES)
    .filter(option => !TRIAL_STATUS_TYPES[option].deprecated)
    .sort((a, b) => {
      return (
        TRIAL_STATUS_TYPES[a].displayOrder - TRIAL_STATUS_TYPES[b].displayOrder
      );
    })
    .map(option => {
      return {
        key: option,
        label: TRIAL_STATUS_TYPES[option].label,
      };
    })
    .concat({
      key: 'statusUnassigned',
      label: 'Unassigned',
    });

  return {
    casesShownCount: formattedCases.length,
    formattedCases: topLevelCases,
    showPrintButton: formattedCases.length > 0,
    trialStatusFilters,
    trialStatusOptions: TRIAL_STATUS_TYPES,
    unassignedLabel: 'Unassigned',
    updatedTrialSessionTypesEnabled: true,
  };
};
