import {
  FORMATS,
  createISODateString,
  getWeeksInRange,
} from '@shared/business/utilities/DateHandler';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import {
  SESSION_STATUS_TYPES,
  SESSION_TERMS_BY_MONTH,
  SESSION_TYPES,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { TrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { assignSessionsToWeeks } from '@web-api/business/useCaseHelper/trialSessions/trialSessionCalendaring/assignSessionsToWeeks';
import { createProspectiveTrialSessions } from '@web-api/business/useCaseHelper/trialSessions/trialSessionCalendaring/createProspectiveTrialSessions';
import { writeTrialSessionDataToExcel } from '@web-api/business/useCaseHelper/trialSessions/trialSessionCalendaring/writeTrialSessionDataToExcel';

// Maximum of 6 sessions per week overall.
const MAX_SESSIONS_PER_WEEK = 6;

// Maximum of 5 total sessions per location during a term.
const MAX_SESSIONS_PER_LOCATION = 5;

// Regular Cases:
// Minimum of 40 cases to create a session.
// Maximum of 100 cases per session.
const REGULAR_CASE_MINIMUM_QUANTITY = 40;
const REGULAR_CASE_MAX_QUANTITY = 100;

// Small Cases:
// Minimum of 40 cases to create a session.
// Maximum of 125 cases per session.
const SMALL_CASE_MINIMUM_QUANTITY = 40;
const SMALL_CASE_MAX_QUANTITY = 125;

// Hybrid Sessions:
// If neither Small nor Regular categories alone meet the session minimum,
// combine them to reach a minimum of 50 cases.
// Maximum of 100 cases per hybrid session.
const HYBRID_CASE_MINIMUM_QUANTITY = 50;
const HYBRID_CASE_MAX_QUANTITY = 100;

// NOTE: will front-load term with trial sessions, and prioritize Regular > Small > Hybrid

export type TrialSessionReadyForCalendaring = TrialSession & { weekOf: string };

export const generateSuggestedTrialSessionCalendarInteractor = async (
  applicationContext: ServerApplicationContext,
  {
    termEndDate,
    termStartDate,
  }: { termEndDate: string; termStartDate: string },
  authorizedUser: UnknownAuthUser,
): Promise<{ message: string; bufferArray: Buffer | undefined }> => {
  console.time('10275: Total interactor time');
  if (
    !isAuthorized(authorizedUser, ROLE_PERMISSIONS.SET_TRIAL_SESSION_CALENDAR)
  ) {
    throw new UnauthorizedError('Unauthorized to generate term');
  }

  //
  // Maximum of 6 sessions per week
  // Maximum of 5 sessions total per location
  // Regular: 40 regular cases minimum to create a session and a maximum of 100 per session
  // Small: 40 small cases minimum to create a session and a maximum of 125 per session
  // Hybrid: After Small and Regular sessions are created, if small and regular cases can be added together to meet a minimum of 50, create a hybrid session. Maximum will be 100 cases per session
  // Special sessions already created will be automatically included
  // If there has been no trial in the last two terms for a location, then add a session if there are any cases. (ignore the minimum rule)
  //
  const calendaringConfig = {
    hybridCaseMaxQuantity: HYBRID_CASE_MAX_QUANTITY,
    hybridCaseMinimumQuantity: HYBRID_CASE_MINIMUM_QUANTITY,
    maxSessionsPerLocation: MAX_SESSIONS_PER_LOCATION,
    maxSessionsPerWeek: MAX_SESSIONS_PER_WEEK,
    regularCaseMaxQuantity: REGULAR_CASE_MAX_QUANTITY,
    regularCaseMinimumQuantity: REGULAR_CASE_MINIMUM_QUANTITY,
    smallCaseMaxQuantity: SMALL_CASE_MAX_QUANTITY,
    smallCaseMinimumQuantity: SMALL_CASE_MINIMUM_QUANTITY,
  };
  console.time('10275: Get ready for trial cases time');
  const cases = await applicationContext
    .getPersistenceGateway()
    .getReadyForTrialCases({ applicationContext });
  console.timeEnd('10275: Get ready for trial cases time');

  console.time('10275: Get trial sessions time');
  const sessions = await applicationContext
    .getPersistenceGateway()
    .getTrialSessions({ applicationContext });
  console.timeEnd('10275: Get trial sessions time');
  // Note (10275): storing trial session data differently would make for a more
  // efficient process of determining which sessions are special, calendared,
  // and not closed.

  console.time('10275: Filter trial sessions time');
  const specialSessions = sessions.filter(session => {
    return (
      session.sessionType === SESSION_TYPES.special &&
      session.isCalendared &&
      session.sessionStatus !== SESSION_STATUS_TYPES.closed
    );
  });
  console.timeEnd('10275: Filter trial sessions time');
  // Note (10275): storing trial session data differently would make for a more
  // efficient process of determining which cities were not visited within the
  // past two terms.

  console.time('10275: Compile cities from last two term time');
  const previousTwoTerms = getPreviousTwoTerms(termStartDate);

  const citiesFromLastTwoTerms = sessions
    .filter(session => {
      const termString = `${session.term}, ${session.termYear}`;
      return (
        previousTwoTerms.includes(termString) &&
        session.sessionType !== SESSION_TYPES.special
      );
    })
    .map(relevantSession => {
      return relevantSession.trialLocation!;
    });
  console.timeEnd('10275: Compile cities from last two term time');

  console.time('10275: Generate prospectiveSessionsByCity time');
  const prospectiveSessionsByCity = createProspectiveTrialSessions({
    calendaringConfig,
    cases,
    citiesFromLastTwoTerms,
  });
  console.timeEnd('10275: Generate prospectiveSessionsByCity time');

  const weeksToLoop = getWeeksInRange({
    endDate: createISODateString(termEndDate, FORMATS.MMDDYYYY),
    startDate: createISODateString(termStartDate, FORMATS.MMDDYYYY),
  });

  console.time('10275: assignSessionsToWeeks time');
  const { scheduledTrialSessions, sessionCountPerWeek } = assignSessionsToWeeks(
    {
      calendaringConfig,
      prospectiveSessionsByCity,
      specialSessions,
      weeksToLoop,
    },
  );
  console.timeEnd('10275: assignSessionsToWeeks time');
  // TODO: extract messages to constants
  if (scheduledTrialSessions.length < 1) {
    return {
      bufferArray: undefined,
      message:
        'There are no trial sessions to schedule within the dates provided.',
    };
  }

  console.time('10275: writeTrialSessionDataToExcel');
  const bufferArray = await writeTrialSessionDataToExcel({
    scheduledTrialSessions,
    sessionCountPerWeek,
    weeks: weeksToLoop,
  });
  console.timeEnd('10275: writeTrialSessionDataToExcel');
  console.timeEnd('10275: Total interactor time');
  return {
    bufferArray,
    message: 'Trial session calendar generated',
  };
};

const getPreviousTwoTerms = (termStartDate: string) => {
  //TODO: refactor this, maybe?

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [month, day, year] = termStartDate.split('/');

  const currentTerm = getTermByMonth(month);

  const terms = [
    `fall ${+year - 1}`,
    `winter ${year}`,
    `spring ${year}`,
    `fall ${year}`,
  ];
  const termsReversed = terms.reverse();
  const termIndex = terms.findIndex(t => `${currentTerm} ${year}` === t);
  const [term1, year1] = termsReversed[termIndex + 1].split(' ');
  const [term2, year2] = termsReversed[termIndex + 2].split(' ');

  return [`${term1}, ${year1}`, `${term2}, ${year2}`];
};

function getTermByMonth(currentMonth: string) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const term = Object.entries(SESSION_TERMS_BY_MONTH).find(([_, months]) =>
    months.includes(parseInt(currentMonth)),
  );
  return term ? term[0] : 'Unknown term';
}