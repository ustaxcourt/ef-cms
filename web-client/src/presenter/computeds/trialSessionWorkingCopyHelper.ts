import { ClientApplicationContext } from '@web-client/applicationContext';
import {
  FormattedTrialSessionCase,
  compareCasesByDocketNumber,
} from '@shared/business/utilities/getFormattedTrialSessionDetails';
import { Get } from 'cerebral';
import { TRIAL_STATUS_TYPES } from '@shared/business/entities/EntityConstants';
import { TrialSessionState } from '@web-client/presenter/state/trialSessionState';
import { UserCaseNote } from '@shared/business/entities/notes/UserCaseNote';
import { isClosed, isLeadCase } from '@shared/business/entities/cases/Case';
import { partition, pickBy } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';

export type TrialSessionWorkingCopyCase = FormattedTrialSessionCase & {
  userNotes: string;
  calendarNotes: string;
  nestedConsolidatedCases: TrialSessionWorkingCopyCase[];
};

export const trialSessionWorkingCopyHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): {
  casesShownCount: number;
  formattedCases: TrialSessionWorkingCopyCase[];
  showPrintButton: boolean;
  trialStatusFilters: { key: string; label: string }[];
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
      applicationContext.getUtilities().formatCaseForTrialSession({
        applicationContext,
        caseItem,
        eligibleCases: trialSession.calendaredCases,
        setFilingPartiesCode: true,
      }),
    )
    .sort(compareCasesByDocketNumber)
    .map(aCase => appendUserNotes(aCase, userNotes))
    .map(aCase => appendCalendarNotes(aCase, trialSession))
    .map(aCase => {
      const nestedConsolidatedCases: TrialSessionWorkingCopyCase[] = [];
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
  };
};

function compareCasesByPractitioner(a, b) {
  const aCount =
    (a.privatePractitioners && a.privatePractitioners.length && 1) || 0;
  const bCount =
    (b.privatePractitioners && b.privatePractitioners.length && 1) || 0;

  return aCount - bCount;
}

function isMemberCaseWithoutCalendaredLead(
  aCase: RawCase,
  scheduledCases: RawCase[],
): boolean {
  const leadCase = scheduledCases.find(
    scheduledCase => scheduledCase.docketNumber === aCase.leadDocketNumber,
  );
  return !leadCase;
}

function isSoloCase(aCase: RawCase): boolean {
  return !aCase.leadDocketNumber;
}

function isTopLevelCase(aCase: RawCase, scheduledCases: RawCase[]): boolean {
  return (
    isLeadCase(aCase) ||
    isSoloCase(aCase) ||
    isMemberCaseWithoutCalendaredLead(aCase, scheduledCases)
  );
}

function isOpenCaseInATrial(aCase: RawCase): boolean {
  return !isClosed(aCase) && aCase.removedFromTrial !== true;
}

function isCaseTrialStatusEnabledInFilters(
  calendaredCase: RawCase,
  caseMetadata: { [docketNumber: string]: { trialStatus: string } },
  enabledTrialStatusFilters: string[],
): boolean {
  const isCaseWithoutTrialStatus =
    enabledTrialStatusFilters.includes('statusUnassigned') &&
    !caseMetadata[calendaredCase.docketNumber]?.trialStatus;

  const isCaseTrialStatusFilterEnabled = enabledTrialStatusFilters.includes(
    caseMetadata[calendaredCase.docketNumber]?.trialStatus,
  );

  return isCaseWithoutTrialStatus || isCaseTrialStatusFilterEnabled;
}

function appendUserNotes<T>(
  aCase: { docketNumber: string } & T,
  userNotesDictionary: {
    [docketNumber: string]: UserCaseNote;
  },
): T & { userNotes: string } {
  const userNotes: string = userNotesDictionary[aCase.docketNumber]
    ? userNotesDictionary[aCase.docketNumber].notes
    : '';
  return { ...aCase, userNotes };
}

function appendCalendarNotes<T>(
  aCase: { docketNumber: string } & T,
  trialSession: TrialSessionState,
): T & { calendarNotes: string } {
  const trialSessionCase = trialSession.caseOrder?.find(
    orderCase => orderCase.docketNumber === aCase.docketNumber,
  );
  const calendarNotes = trialSessionCase ? trialSessionCase.calendarNotes : '';
  return { ...aCase, calendarNotes: calendarNotes || '' };
}
