import {
  FORMATS,
  createDateAtStartOfWeekEST,
  createEndOfDayISO,
  createISODateString,
  formatDateString,
  subtractISODates,
} from '@shared/business/utilities/DateHandler';
import { Get } from 'cerebral';
import { RawUser } from '@shared/business/entities/User';
import {
  SESSION_STATUS_TYPES,
  SESSION_TYPES,
  TrialSessionTypes,
} from '@shared/business/entities/EntityConstants';
import { TrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import { TrialSessionInfoDTO } from '@shared/business/dto/trialSessions/TrialSessionInfoDTO';
import {
  TrialSessionsFilters,
  initialTrialSessionPageState,
} from '@web-client/presenter/state/trialSessionsPageState';
import { TrialSessionsPageValidation } from '@shared/business/entities/trialSessions/TrialSessionsPageValidation';
import { getTrialCitiesGroupedByState } from '@shared/business/utilities/trialSession/trialCitiesGroupedByState';
import { state } from '@web-client/presenter/app.cerebral';

export const trialSessionsHelper = (
  get: Get,
): {
  isResetFiltersDisabled: boolean;
  showNewTrialSession: boolean;
  showNoticeIssued: boolean;
  showSessionStatus: boolean;
  trialSessionJudgeOptions: {
    label: string;
    value: { name: string; userId: string };
  }[];
  trialSessionRows: (TrialSessionRow | TrialSessionWeek)[];
  sessionTypeOptions: { label: string; value: TrialSessionTypes }[];
  showCreateTermButton: boolean;
  trialCitiesByState: {
    label: string;
    options: { label: string; value: string }[];
  }[];
  trialSessionsCount: number;
  endDateErrorMessage?: string;
  startDateErrorMessage?: string;
  totalPages: number;
} => {
  const permissions = get(state.permissions)!;
  const trialSessions = get(state.trialSessionsPage.trialSessions);
  const filters = get(state.trialSessionsPage.filters);
  const judge = get(state.judgeUser);
  const judges = get(state.judges);

  const pageSize = 100;

  const showCurrentJudgesOnly =
    filters.currentTab === 'new' ||
    filters.sessionStatus === SESSION_STATUS_TYPES.open;

  let trialSessionJudges: { name: string; userId: string }[];
  if (showCurrentJudgesOnly) {
    trialSessionJudges = judges;
  } else {
    trialSessionJudges = get(state.legacyAndCurrentJudges);
  }

  const userHasSelectedAFilter =
    filters.proceedingType !==
      initialTrialSessionPageState.filters.proceedingType ||
    filters.sessionStatus !==
      initialTrialSessionPageState.filters.sessionStatus ||
    Object.keys(filters.judges).length > 0 ||
    Object.keys(filters.sessionTypes).length > 0 ||
    Object.keys(filters.trialLocations).length > 0 ||
    !!filters.startDate ||
    !!filters.endDate;

  const sessionTypeOptions = Object.values(SESSION_TYPES).map(sessionType => ({
    label: sessionType,
    value: sessionType,
  }));

  const trialSessionJudgeOptions = trialSessionJudges.map(
    trialSessionJudge => ({
      label: trialSessionJudge.name,
      value: { name: trialSessionJudge.name, userId: trialSessionJudge.userId },
    }),
  );

  const showUnassignedJudgeFilter = filters.currentTab === 'new';
  if (showUnassignedJudgeFilter) {
    trialSessionJudgeOptions.push({
      label: 'Unassigned',
      value: { name: 'Unassigned', userId: 'unassigned' },
    });
  }

  const states = getTrialCitiesGroupedByState();

  const { endDateErrorMessage, startDateErrorMessage } =
    validateTrialSessionDateRange({
      endDate: filters.endDate,
      startDate: filters.startDate,
    });

  let filteredTrialSessions: TrialSessionInfoDTO[] = [];
  if (!endDateErrorMessage && !startDateErrorMessage) {
    filteredTrialSessions = filterAndSortTrialSessions({
      filters,
      trialSessions,
    });
  }

  const trialSessionPage = filteredTrialSessions.slice(
    filters.pageNumber * pageSize,
    filters.pageNumber * pageSize + pageSize,
  );

  const trialSessionRows = formatTrialSessions({
    judgeAssociatedToUser: judge,
    trialSessions: trialSessionPage,
  });

  return {
    endDateErrorMessage,
    isResetFiltersDisabled: !userHasSelectedAFilter,
    sessionTypeOptions,
    showCreateTermButton: permissions.SET_TRIAL_SESSION_CALENDAR,
    showNewTrialSession: permissions.CREATE_TRIAL_SESSION,
    showNoticeIssued: filters.currentTab === 'calendared',
    showSessionStatus: filters.currentTab === 'calendared',
    startDateErrorMessage,
    totalPages: Math.ceil(filteredTrialSessions.length / pageSize),
    trialCitiesByState: states,
    trialSessionJudgeOptions,
    trialSessionRows,
    trialSessionsCount: filteredTrialSessions.length,
  };
};

const filterAndSortTrialSessions = ({
  filters,
  trialSessions,
}: {
  trialSessions: TrialSessionInfoDTO[];
  filters: TrialSessionsFilters;
}): TrialSessionInfoDTO[] => {
  //
  return trialSessions
    .filter(trialSession => {
      const isCalendaredFilter = filters.currentTab === 'calendared';
      return trialSession.isCalendared === isCalendaredFilter;
    })
    .filter(trialSession => {
      const selectedJudges = Object.values(filters.judges);
      if (selectedJudges.length === 0) return true;
      const trialSessionHasJudge = selectedJudges.some(judgeFilter => {
        if (judgeFilter.userId === 'unassigned') {
          return !trialSession.judge?.userId;
        }
        return judgeFilter.userId === trialSession.judge?.userId;
      });

      return trialSessionHasJudge;
    })
    .filter(trialSession => {
      if (filters.proceedingType === 'All') return true;
      return trialSession.proceedingType === filters.proceedingType;
    })
    .filter(trialSession => {
      if (filters.currentTab === 'new') return true;
      if (filters.sessionStatus === 'All') return true;
      return filters.sessionStatus === trialSession.sessionStatus;
    })
    .filter(trialSession => {
      if (Object.values(filters.sessionTypes).length === 0) return true;
      return !!filters.sessionTypes[trialSession.sessionType];
    })
    .filter(trialSession => {
      if (Object.values(filters.trialLocations).length === 0) return true;
      return !!filters.trialLocations[trialSession.trialLocation || ''];
    })
    .filter(trialSession => {
      if (!filters.startDate) return true;
      const filterIsoStartDate = createISODateString(
        filters.startDate,
        FORMATS.MMDDYYYY,
      );
      const formattdFilterStartDate = formatDateString(
        filterIsoStartDate,
        FORMATS.ISO,
      );
      const formattedTrialSessionStartDate = formatDateString(
        trialSession.startDate,
        FORMATS.ISO,
      );
      return formattedTrialSessionStartDate >= formattdFilterStartDate;
    })
    .filter(trialSession => {
      if (!filters.endDate) return true;
      const [month, day, year] = filters.endDate.split('/');
      const filterIsoEndofDay = createEndOfDayISO({ day, month, year });
      const formattedFilterEndDate = formatDateString(
        filterIsoEndofDay,
        FORMATS.ISO,
      );
      const formattedTrialSessionStartDate = formatDateString(
        trialSession.startDate,
        FORMATS.ISO,
      );

      return formattedTrialSessionStartDate <= formattedFilterEndDate;
    })
    .sort((sessionA, sessionB) => {
      return sessionA.startDate.localeCompare(sessionB.startDate);
    });
};

const formatTrialSessions = ({
  judgeAssociatedToUser,
  trialSessions,
}: {
  trialSessions: TrialSessionInfoDTO[];
  judgeAssociatedToUser?: RawUser;
}): (TrialSessionRow | TrialSessionWeek)[] => {
  const trialSessionRows: TrialSessionRow[] = trialSessions.map(
    trialSession => {
      const showAlertForNOTTReminder =
        !trialSession.dismissedAlertForNOTT &&
        TrialSession.isStartDateWithinNOTTReminderRange({
          isCalendared: trialSession.isCalendared,
          startDate: trialSession.startDate,
        });

      const alertMessageForNOTT = showAlertForNOTTReminder
        ? `The 30-day notice is due by ${thirtyDaysBeforeTrial(trialSession.startDate)}`
        : '';
      const formattedEstimatedEndDate = formatDateString(
        trialSession.estimatedEndDate,
        FORMATS.MMDDYY,
      );
      const formattedNoticeIssuedDate = formatDateString(
        trialSession.noticeIssuedDate,
        FORMATS.MMDDYYYY,
      );
      const formattedStartDate = formatDateString(
        trialSession.startDate,
        FORMATS.MMDDYY,
      );
      const isJudgeUserAssigned = !!(
        trialSession.judge?.userId === judgeAssociatedToUser?.userId &&
        judgeAssociatedToUser?.userId
      );
      const judge = trialSession.judge || { name: 'Unassigned', userId: '' };
      /* TODO 10409: There may be a bug in userIsAssignedToSession to session as the previous formatted needed a trialClerk to compute userIsAssignedToSession.
        Look at how formattedTrialSessions.ts calculates userIsAssignedToSession for reference
      */
      const userIsAssignedToSession = isJudgeUserAssigned;

      return {
        alertMessageForNOTT,
        formattedEstimatedEndDate,
        formattedNoticeIssuedDate,
        formattedStartDate,
        judge,
        proceedingType: trialSession.proceedingType,
        sessionStatus: trialSession.sessionStatus,
        sessionType: trialSession.sessionType,
        showAlertForNOTTReminder,
        startDate: trialSession.startDate,
        swingSession: !!trialSession.swingSession,
        trialLocation: trialSession.trialLocation || '',
        trialSessionId: trialSession.trialSessionId || '',
        userIsAssignedToSession,
      };
    },
  );

  const trialSessionWithStartWeeks: (TrialSessionRow | TrialSessionWeek)[] = [];

  let lastSessionWeek: TrialSessionWeek = {
    formattedSessionWeekStartDate: '',
    sessionWeekStartDate: '',
  };
  trialSessionRows.forEach(trialSession => {
    const trialSessionStartOfWeek = createDateAtStartOfWeekEST(
      trialSession.startDate,
      FORMATS.ISO,
    );
    if (lastSessionWeek.sessionWeekStartDate < trialSessionStartOfWeek) {
      const formattedSessionWeekStartDate = createDateAtStartOfWeekEST(
        trialSession.startDate,
        FORMATS.MONTH_DAY_YEAR,
      );

      lastSessionWeek = {
        formattedSessionWeekStartDate,
        sessionWeekStartDate: trialSessionStartOfWeek,
      };

      trialSessionWithStartWeeks.push(lastSessionWeek);
    }
    trialSessionWithStartWeeks.push(trialSession);
  });

  return trialSessionWithStartWeeks;
};

export const thirtyDaysBeforeTrial = (startDate?: string): string => {
  if (!startDate) return '';
  const thirtyDaysBeforeTrialIso = subtractISODates(startDate, { day: 29 });

  return formatDateString(thirtyDaysBeforeTrialIso, FORMATS.MMDDYY);
};

type TrialSessionRow = {
  trialSessionId: string;
  showAlertForNOTTReminder: boolean;
  alertMessageForNOTT: string;
  formattedStartDate: string; //MM/DD/YYYY
  formattedEstimatedEndDate: string;
  swingSession: boolean;
  userIsAssignedToSession: boolean;
  trialLocation: string;
  proceedingType: string;
  startDate: string; // ISO format
  sessionType: string;
  judge: { name: string; userId: string };
  formattedNoticeIssuedDate: string;
  sessionStatus: string;
};
export function isTrialSessionRow(item: any): item is TrialSessionRow {
  return !!item?.trialSessionId;
}

type TrialSessionWeek = {
  sessionWeekStartDate: string;
  formattedSessionWeekStartDate: string;
};
export function isTrialSessionWeek(item: any): item is TrialSessionWeek {
  return !!item?.sessionWeekStartDate;
}

function validateTrialSessionDateRange({
  endDate,
  startDate,
}: {
  startDate: string;
  endDate: string;
}): { startDateErrorMessage?: string; endDateErrorMessage?: string } {
  const formattedEndDate = endDate
    ? createISODateString(endDate, FORMATS.MMDDYYYY)
    : undefined;

  const formattedStartDate = startDate
    ? createISODateString(startDate, FORMATS.MMDDYYYY)
    : undefined;

  const errors = new TrialSessionsPageValidation({
    endDate: formattedEndDate,
    startDate: formattedStartDate,
  }).getFormattedValidationErrors();

  return {
    endDateErrorMessage: errors?.endDate,
    startDateErrorMessage: errors?.startDate,
  };
}
