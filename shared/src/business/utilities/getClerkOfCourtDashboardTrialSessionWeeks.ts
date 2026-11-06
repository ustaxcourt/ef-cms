import {
  DAYS_IN_WEEK,
  DAYS_TO_WEEK_END,
} from '@shared/business/entities/EntityConstants';
import {
  FORMATS,
  calculateISODate,
  createDateAtStartOfWeekEST,
  createEndOfDayISO,
  createISODateAtStartOfDayEST,
  createISODateString,
  deconstructDate,
} from '@shared/business/utilities/DateHandler';

export type ClerkOfCourtDashboardTrialSessionWeeks = {
  currentWeekStart: string;
  currentWeekEnd: string;
  nextWeekStart: string;
  nextWeekEnd: string;
};

/**
 * The current week and the next week (Eastern time) that the clerk of court
 * dashboard shows trial sessions for. The API uses the weeks to read only those
 * sessions, and the client uses them to put each session in its week.
 */
export const getClerkOfCourtDashboardTrialSessionWeeks = ():
  ClerkOfCourtDashboardTrialSessionWeeks | undefined => {
  const today = createISODateAtStartOfDayEST();
  const currentWeekStart = createISODateString(
    createDateAtStartOfWeekEST(today, FORMATS.ISO),
    FORMATS.ISO,
  );

  const currentWeekEndDay = calculateISODate({
    dateString: currentWeekStart,
    howMuch: DAYS_TO_WEEK_END,
    units: 'days',
  });
  const currentWeekEnd = createEndOfDayISO(deconstructDate(currentWeekEndDay));

  const nextWeekAnyDay = calculateISODate({
    dateString: today,
    howMuch: DAYS_IN_WEEK,
    units: 'days',
  });
  if (!currentWeekEnd || !nextWeekAnyDay) {
    return undefined;
  }

  const nextWeekStart = createISODateString(
    createDateAtStartOfWeekEST(nextWeekAnyDay, FORMATS.ISO),
    FORMATS.ISO,
  );

  const nextWeekEndDay = calculateISODate({
    dateString: nextWeekStart,
    howMuch: DAYS_TO_WEEK_END,
    units: 'days',
  });
  const nextWeekEnd = createEndOfDayISO(deconstructDate(nextWeekEndDay));
  if (!nextWeekEnd) {
    return undefined;
  }

  return { currentWeekEnd, currentWeekStart, nextWeekEnd, nextWeekStart };
};
