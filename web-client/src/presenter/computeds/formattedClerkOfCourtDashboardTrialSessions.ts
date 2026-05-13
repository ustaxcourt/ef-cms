import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import {
  calculateISODate,
  createDateAtStartOfWeekEST,
  createEndOfDayISO,
  createISODateAtStartOfDayEST,
  deconstructDate,
  FORMATS,
} from '@shared/business/utilities/DateHandler';
import {
  DAYS_IN_WEEK,
  DAYS_TO_WEEK_END,
} from '@shared/business/entities/EntityConstants';
import { TrialSessionInfoDTO } from '@shared/business/dto/trialSessions/TrialSessionInfoDTO';

export type FormattedTrialSession = {
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

/**
 * Formats and filters trial sessions for the Clerk of Court dashboard.
 * Returns sessions grouped by current week and next week, sorted by start date.
 * Only includes open trial sessions within the specified date ranges.
 *
 * @param {Function} get the cerebral get function
 * @param {object} applicationContext the application context
 * @returns {object} object containing formattedCurrentWeekSessions and formattedNextWeekSessions arrays
 */
export const formattedClerkOfCourtDashboardTrialSessions = (
  get: Get,
  applicationContext: ClientApplicationContext,
): {
  formattedCurrentWeekSessions: FormattedTrialSession[];
  formattedNextWeekSessions: FormattedTrialSession[];
} => {
  const { SESSION_STATUS_GROUPS } = applicationContext.getConstants();

  const today = createISODateAtStartOfDayEST();
  let currentWeekStart = createDateAtStartOfWeekEST(today, FORMATS.ISO);
  currentWeekStart = applicationContext
    .getUtilities()
    .createISODateString(currentWeekStart, FORMATS.ISO);

  const currentWeekEndDay = calculateISODate({
    dateString: currentWeekStart,
    howMuch: DAYS_TO_WEEK_END,
    units: 'days',
  });

  const currentWeekEndISO = createEndOfDayISO(
    deconstructDate(currentWeekEndDay),
  );

  if (!currentWeekEndISO) {
    return {
      formattedCurrentWeekSessions: [],
      formattedNextWeekSessions: [],
    };
  }

  const currentWeekEnd = currentWeekEndISO;

  const nextWeekAnyDayDateTimeISO = calculateISODate({
    dateString: today,
    howMuch: DAYS_IN_WEEK,
    units: 'days',
  });

  if (!nextWeekAnyDayDateTimeISO) {
    return {
      formattedCurrentWeekSessions: [],
      formattedNextWeekSessions: [],
    };
  }

  let nextWeekStart = createDateAtStartOfWeekEST(
    nextWeekAnyDayDateTimeISO,
    FORMATS.ISO,
  );
  nextWeekStart = applicationContext
    .getUtilities()
    .createISODateString(nextWeekStart, FORMATS.ISO);

  const nextWeekEndDay = calculateISODate({
    dateString: nextWeekStart,
    howMuch: DAYS_TO_WEEK_END,
    units: 'days',
  });

  const nextWeekEndISO = createEndOfDayISO(deconstructDate(nextWeekEndDay));

  if (!nextWeekEndISO) {
    return {
      formattedCurrentWeekSessions: [],
      formattedNextWeekSessions: [],
    };
  }

  const nextWeekEnd = nextWeekEndISO;

  const allTrialSessions = get(state.trialSessions);
  if (!allTrialSessions || !Array.isArray(allTrialSessions)) {
    return {
      formattedCurrentWeekSessions: [],
      formattedNextWeekSessions: [],
    };
  }

  const openTrialSessions = allTrialSessions.filter(
    session =>
      session &&
      session.sessionStatus === SESSION_STATUS_GROUPS.open &&
      session.startDate,
  );

  const currentWeekSessions = openTrialSessions.filter(
    session =>
      session.startDate &&
      session.startDate >= currentWeekStart &&
      session.startDate <= currentWeekEnd,
  );

  const nextWeekSessions = openTrialSessions.filter(
    session =>
      session.startDate &&
      session.startDate >= nextWeekStart &&
      session.startDate <= nextWeekEnd,
  );

  const formatSession = (
    session: TrialSessionInfoDTO,
  ): FormattedTrialSession => {
    const trialClerk =
      session.trialClerk && session.trialClerk.name
        ? session.trialClerk
        : session.alternateTrialClerkName
          ? { name: session.alternateTrialClerkName, userId: '' }
          : undefined;

    return {
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
      trialClerk,
      startDate: session.startDate,
      estimatedEndDate: session.estimatedEndDate,
    };
  };

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