import {
  FORMATS,
  createDateAtStartOfWeekEST,
  formatDateString,
  subtractISODates,
} from '@shared/business/utilities/DateHandler';
import { Get } from 'cerebral';
import { RawUser } from '@shared/business/entities/User';
import { SESSION_STATUS_TYPES } from '@shared/business/entities/EntityConstants';
import { TrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import { TrialSessionInfoDTO } from '@shared/business/dto/trialSessions/TrialSessionInfoDTO';
import { state } from '@web-client/presenter/app.cerebral';

export const trialSessionsHelper = (
  get: Get,
): {
  showNewTrialSession: boolean;
  showNoticeIssued: boolean;
  showSessionStatus: boolean;
  showUnassignedJudgeFilter: boolean;
  trialSessionJudges: RawUser[];
  trialSessionRows: (TrialSessionRow | TrialSessionWeek)[];
} => {
  const permissions = get(state.permissions)!;
  const trialSessions = get(state.trialSessionsPage.trialSessions);
  const filters = get(state.trialSessionsPage.filters);
  const judge = get(state.judgeUser);

  const showCurrentJudgesOnly =
    filters.currentTab === 'new' ||
    filters.sessionStatus === SESSION_STATUS_TYPES.open;

  let trialSessionJudges;
  if (showCurrentJudgesOnly) {
    trialSessionJudges = get(state.judges);
  } else {
    trialSessionJudges = get(state.legacyAndCurrentJudges);
  }

  const filteredTrialSessions = trialSessions
    .filter(trialSession => {
      const isCalendaredFilter = filters.currentTab === 'calendared';
      return trialSession.isCalendared === isCalendaredFilter;
    })
    .filter(trialSession => {
      if (filters.judgeId === 'All') return true;
      if (filters.judgeId === 'unassigned') return !trialSession.judge?.userId;
      return trialSession.judge?.userId === filters.judgeId;
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
    showNewTrialSession: permissions.CREATE_TRIAL_SESSION,
    showNoticeIssued: filters.currentTab === 'calendared',
    showSessionStatus: filters.currentTab === 'calendared',
    showUnassignedJudgeFilter: filters.currentTab === 'new',
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
