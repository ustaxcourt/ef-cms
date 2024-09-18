import {
  FORMATS,
  createDateAtStartOfWeekEST,
  formatDateString,
  subtractISODates,
} from '@shared/business/utilities/DateHandler';
import { Get } from 'cerebral';
import { InputOption } from '@web-client/ustc-ui/Utils/types';
import { RawUser } from '@shared/business/entities/User';
import {
  SESSION_STATUS_TYPES,
  SESSION_TYPES,
  TRIAL_CITIES,
} from '@shared/business/entities/EntityConstants';
import { TrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import { TrialSessionInfoDTO } from '@shared/business/dto/trialSessions/TrialSessionInfoDTO';
import { sortBy } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';

export const trialSessionsHelper = (
  get: Get,
): {
  showNewTrialSession: boolean;
  showNoticeIssued: boolean;
  showSessionStatus: boolean;
  showUnassignedJudgeFilter: boolean;
  trialSessionJudges: RawUser[];
  trialSessionJudgeOptions: InputOption[];
  trialSessionRows: (TrialSessionRow | TrialSessionWeek)[];
  sessionTypeOptions: InputOption[];
  searchableTrialLocationOptions: InputOption[];
  trialCitiesByState: InputOption[];
} => {
  const permissions = get(state.permissions)!;
  const trialSessions = get(state.trialSessionsPage.trialSessions);
  const filters = get(state.trialSessionsPage.filters);
  const judge = get(state.judgeUser);

  const showCurrentJudgesOnly =
    filters.currentTab === 'new' ||
    filters.sessionStatus === SESSION_STATUS_TYPES.open;

  let trialSessionJudges; // 10409 TODO BUG. The judge options is not updating correctly. Showing legacy when it should not.
  if (showCurrentJudgesOnly) {
    trialSessionJudges = get(state.judges);
    console.log('current length: ', trialSessionJudges.length);
  } else {
    trialSessionJudges = get(state.legacyAndCurrentJudges);
    console.log('legecy length: ', trialSessionJudges.length);
  }

  const sessionTypeOptions = Object.values(SESSION_TYPES).map(sessionType => ({
    label: sessionType,
    value: sessionType,
  }));

  const trialSessionJudgeOptions: InputOption[] = trialSessionJudges.map(
    trialSessionJudge => ({
      label: trialSessionJudge.name,
      value: trialSessionJudge.userId,
    }),
  );
  const trialCities = sortBy(TRIAL_CITIES.ALL, ['state', 'city']);
  const searchableTrialLocationOptions: InputOption[] = [];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const states: InputOption[] = trialCities.reduce(
    (listOfStates: InputOption[], cityStatePair) => {
      const existingState = listOfStates.find(
        trialState => trialState.label === cityStatePair.state,
      );
      const cityOption: InputOption = {
        label: `${cityStatePair.city}, ${cityStatePair.state}`,
        value: `${cityStatePair.city}, ${cityStatePair.state}`,
      };
      if (existingState) {
        existingState.options?.push(cityOption);
      } else {
        listOfStates.push({
          label: cityStatePair.state,
          options: [cityOption],
        });
      }
      searchableTrialLocationOptions.push(cityOption);
      return listOfStates;
    },
    [],
  );

  const filteredTrialSessions = trialSessions
    .filter(trialSession => {
      const isCalendaredFilter = filters.currentTab === 'calendared';
      return trialSession.isCalendared === isCalendaredFilter;
    })
    .filter(trialSession => {
      if (filters.judgeIds.length === 0) return true;
      const trialSessionHasJudge = filters.judgeIds.some(judgeIdFilter => {
        if (judgeIdFilter === 'unassigned') return !trialSession.judge?.userId;
        return judgeIdFilter === trialSession.judge?.userId;
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
      if (filters.sessionType === 'All') return true;
      return filters.sessionType === trialSession.sessionType;
    })
    .filter(trialSession => {
      if (filters.trialLocation === 'All') return true;
      return filters.trialLocation === trialSession.trialLocation;
    })
    .sort((sessionA, sessionB) => {
      return sessionA.startDate.localeCompare(sessionB.startDate);
    });

  const trialSessionRows = formatTrialSessions({
    judgeAssociatedToUser: judge,
    trialSessions: filteredTrialSessions,
  });

  return {
    searchableTrialLocationOptions,
    sessionTypeOptions,
    showNewTrialSession: permissions.CREATE_TRIAL_SESSION,
    showNoticeIssued: filters.currentTab === 'calendared',
    showSessionStatus: filters.currentTab === 'calendared',
    showUnassignedJudgeFilter: filters.currentTab === 'new',
    trialCitiesByState: states,
    trialSessionJudgeOptions,
    trialSessionJudges,
    trialSessionRows,
  };
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
      /* TODO 10409: There may be a bug in userIsAssignedToSession to session as the previous formatted needed a trialClerk to compute userIsAssignedToSession.
        Look at how formattedTrialSessions.ts calculates userIsAssignedToSession for reference
      */
      const userIsAssignedToSession = isJudgeUserAssigned;

      return {
        alertMessageForNOTT,
        formattedEstimatedEndDate,
        formattedNoticeIssuedDate,
        formattedStartDate,
        judge: trialSession.judge,
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
  judge?: { name: string; userId: string };
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
