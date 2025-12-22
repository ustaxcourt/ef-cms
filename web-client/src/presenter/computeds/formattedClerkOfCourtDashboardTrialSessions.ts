import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import {
  createDateAtStartOfWeekEST,
  createISODateString,
  FORMATS,
  prepareDateFromString,
} from '@shared/business/utilities/DateHandler';
import { TrialSessionInfoDTO } from '@shared/business/dto/trialSessions/TrialSessionInfoDTO';

type FormattedTrialSession = {
  trialSessionId?: string;
  formattedStartDate: string;
  formattedEstimatedEndDate: string;
  trialLocation?: string;
  proceedingType: string;
  sessionType: string;
  judge?: { name: string; userId: string };
  trialClerk?: { name: string; userId: string };
  startDate: string;
  estimatedEndDate?: string;
};

export const formattedClerkOfCourtDashboardTrialSessions = (
  get: Get,
  applicationContext: ClientApplicationContext,
): {
  formattedCurrentWeekSessions: FormattedTrialSession[];
  formattedNextWeekSessions: FormattedTrialSession[];
} => {
  const { SESSION_STATUS_GROUPS } = applicationContext.getConstants();
  const DAYS_IN_WEEK = 7;
  const DAYS_TO_WEEK_END = 6;

  const today = createISODateString();
  const currentWeekStart = createDateAtStartOfWeekEST(today, FORMATS.ISO);
  const currentWeekStartDateTime = prepareDateFromString(currentWeekStart);
  const currentWeekEnd = currentWeekStartDateTime
    .plus({ days: DAYS_TO_WEEK_END })
    .endOf('day')
    .toISO()!;
  const nextWeekStartDateTime = currentWeekStartDateTime.plus({
    days: DAYS_IN_WEEK,
  });
  const nextWeekStart = createDateAtStartOfWeekEST(
    nextWeekStartDateTime.toISO()!,
    FORMATS.ISO,
  );
  const nextWeekEnd = nextWeekStartDateTime
    .plus({ days: DAYS_TO_WEEK_END })
    .endOf('day')
    .toISO()!;

  const allTrialSessions = get(state.trialSessions) || [];
  const openTrialSessions = allTrialSessions.filter(
    session => session.sessionStatus === SESSION_STATUS_GROUPS.open,
  );

  const currentWeekSessions = openTrialSessions.filter(
    session =>
      session.startDate >= currentWeekStart &&
      session.startDate <= currentWeekEnd,
  );

  const nextWeekSessions = openTrialSessions.filter(
    session =>
      session.startDate >= nextWeekStart && session.startDate <= nextWeekEnd,
  );

  const formatSession = (
    session: TrialSessionInfoDTO,
  ): FormattedTrialSession => ({
    trialSessionId: session.trialSessionId,
    formattedStartDate: applicationContext
      .getUtilities()
      .formatDateString(session.startDate, 'MMDDYY'),
    formattedEstimatedEndDate: session.estimatedEndDate
      ? applicationContext
          .getUtilities()
          .formatDateString(session.estimatedEndDate, 'MMDDYY')
      : '',
    trialLocation: session.trialLocation || '',
    proceedingType: session.proceedingType || '',
    sessionType: session.sessionType || '',
    judge: session.judge || { name: 'Unassigned', userId: '' },
    trialClerk: session.trialClerk,
    startDate: session.startDate,
    estimatedEndDate: session.estimatedEndDate,
  });

  const formattedCurrentWeek = currentWeekSessions
    .map(formatSession)
    .sort((a, b) => a.startDate.localeCompare(b.startDate));

  const formattedNextWeek = nextWeekSessions
    .map(formatSession)
    .sort((a, b) => a.startDate.localeCompare(b.startDate));

  return {
    formattedCurrentWeekSessions: formattedCurrentWeek,
    formattedNextWeekSessions: formattedNextWeek,
  };
};
