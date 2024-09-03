import {
  FORMATS,
  formatDateString,
} from '@shared/business/utilities/DateHandler';
import { Get } from 'cerebral';
import { RawUser } from '@shared/business/entities/User';
import { TrialSessionInfoDTO } from '@shared/business/dto/trialSessions/TrialSessionInfoDTO';
import { state } from '@web-client/presenter/app.cerebral';

export const trialSessionsHelper = (
  get: Get,
): {
  additionalColumnsShown: number;
  showNewTrialSession: boolean;
  showNoticeIssued: boolean;
  showSessionStatus: boolean;
  showUnassignedJudgeFilter: boolean;
  trialSessionJudges: RawUser[];
  trialSessionRows: (TrialSessionRow | TrialSessionWeek)[];
} => {
  const permissions = get(state.permissions)!;
  const tab = get(state.trialSessionsPage.filters.currentTab);
  const trialSessions = get(state.trialSessionsPage.trialSessions);
  const filters = get(state.trialSessionsPage.filters);
  const judge = get(state.judgeUser);

  const isNewTab = tab === 'new';
  const isCalendared = tab === 'calendared';

  let additionalColumnsShown = 0;
  if (isCalendared) {
    additionalColumnsShown = 1;
  }

  const showCurrentJudgesOnly = isNewTab;

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
      if (sessionA.startDate === sessionB.startDate) {
        const sessionATrialLocation = sessionA.trialLocation || '';
        const sessionBTrialLocation = sessionA.trialLocation || '';
        return sessionATrialLocation.localeCompare(sessionBTrialLocation);
      }
      return sessionA.startDate.localeCompare(sessionB.startDate);
    });

  const trialSessionRows = formatTrialSessions({
    judgeAssociatedToUser: judge,
    trialSessions: filteredTrialSessions,
  });

  return {
    additionalColumnsShown,
    showNewTrialSession: permissions.CREATE_TRIAL_SESSION,
    showNoticeIssued: isCalendared,
    showSessionStatus: isCalendared,
    showUnassignedJudgeFilter: isNewTab,
    trialSessionJudges,
    trialSessionRows,
  };
};

type TrialSessionRow = {
  trialSessionId: string;
  showAlertForNOTTReminder: boolean;
  alertMessageForNOTT: string;
  formattedStartDate: string;
  formattedEstimatedEndDate: string;
  swingSession: boolean;
  userIsAssignedToSession: boolean;
  trialLocation: string;
  proceedingType: string;
  sessionType: string;
  judge?: { name: string; userId: string };
  formattedNoticeIssuedDate: string;
  sessionStatus: string;
};

type TrialSessionWeek = {
  startOfWeekSortable: string;
  dateFormatted: string;
};

export function isTrialSessionRow(item: any): item is TrialSessionRow {
  return !!item?.trialSessionId;
}

export function isTrialSessionWeek(item: any): item is TrialSessionWeek {
  return !!item?.startOfWeekSortable;
}

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
        !!trialSession.isStartDateWithinNOTTReminderRange;

      const alertMessageForNOTT = showAlertForNOTTReminder
        ? `The 30-day notice is due by ${trialSession.thirtyDaysBeforeTrialFormatted}`
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
        swingSession: !!trialSession.swingSession,
        trialLocation: trialSession.trialLocation || '',
        trialSessionId: trialSession.trialSessionId || '',
        userIsAssignedToSession,
      };
    },
  );

  return trialSessionRows;
};
