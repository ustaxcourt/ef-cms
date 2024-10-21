import {
  FORMATS,
  deconstructDate,
  formatDateString,
  getWeeksInRange,
  isDateWithinGivenInterval,
} from '@shared/business/utilities/DateHandler';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import {
  RawTrialSession,
  TrialSession,
} from '@shared/business/entities/trialSessions/TrialSession';
import {
  SESSION_STATUS_TYPES,
  SESSION_TYPES,
  SUGGESTED_TRIAL_SESSION_MESSAGES,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { assignSessionsToWeeks } from '@web-api/business/useCaseHelper/trialSessions/trialSessionCalendaring/assignSessionsToWeeks';
import { createProspectiveTrialSessions } from '@web-api/business/useCaseHelper/trialSessions/trialSessionCalendaring/createProspectiveTrialSessions';
import { getDataForCalendaring } from '@web-api/business/useCaseHelper/trialSessions/trialSessionCalendaring/getDataForCalendaring';
import { writeTrialSessionDataToExcel } from '@web-api/business/useCaseHelper/trialSessions/trialSessionCalendaring/writeTrialSessionDataToExcel';

const MAX_SESSIONS_PER_WEEK = 6;
const MAX_SESSIONS_PER_LOCATION = 5;

const REGULAR_CASE_MINIMUM_QUANTITY = 40;
const REGULAR_CASE_MAX_QUANTITY = 100;

const SMALL_CASE_MINIMUM_QUANTITY = 40;
const SMALL_CASE_MAX_QUANTITY = 125;

const HYBRID_CASE_MINIMUM_QUANTITY = 50;
const HYBRID_CASE_MAX_QUANTITY = 100;

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

export const WASHINGTON_DC_STRING = 'Washington, District of Columbia';
export const WASHINGTON_DC_NORTH_STRING =
  'Washington (North), District of Columbia'; // specials only
export const WASHINGTON_DC_SOUTH_STRING =
  'Washington (South), District of Columbia'; // all session types

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

  console.time('10275: Get ready for trial cases time');
  const cases = await applicationContext
    .getPersistenceGateway()
    .getSuggestedCalendarCases({ applicationContext });

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
  const specialSessions = getSpecialSessionsInTerm({
    sessions,
    termEndDate,
    termStartDate,
  });

  console.timeEnd('10275: Filter trial sessions time');
  // Note (10275): storing trial session data differently would make for a more
  // efficient process of determining which cities were not visited within the
  // past two terms.

  console.time('10275: Compile cities from last two term time');
  const citiesFromLastTwoTerms = getCitiesFromLastTwoTerms({
    sessions,
    termStartDate,
  });
  console.timeEnd('10275: Compile cities from last two term time');

  console.time('10275: Generate prospectiveSessionsByCity time');

  const {
    incorrectSizeRegularCases,
    initialRegularCaseCountsByCity,
    initialSmallCaseCountsByCity,
    regularCasesByCity,
    smallCasesByCity,
  } = getDataForCalendaring({ cases, citiesFromLastTwoTerms });

  const { prospectiveSessionsByCity } = createProspectiveTrialSessions({
    calendaringConfig,
    citiesFromLastTwoTerms,
    regularCasesByCity,
    smallCasesByCity,
  });

  console.timeEnd('10275: Generate prospectiveSessionsByCity time');

  const weeksToLoop = getWeeksInRange({
    endDate: termEndDate,
    startDate: termStartDate,
  });

  console.time('10275: assignSessionsToWeeks time');

  const {
    remainingRegularCaseCountByCity,
    remainingSmallCaseCountByCity,
    scheduledTrialSessionsByCity,
    sessionCountPerWeek,
  } = assignSessionsToWeeks({
    calendaringConfig,
    prospectiveSessionsByCity,
    regularCaseCountByCity: initialRegularCaseCountsByCity,
    smallCaseCountByCity: initialSmallCaseCountsByCity,
    specialSessions,
    weeksToLoop,
  });

  console.timeEnd('10275: assignSessionsToWeeks time');

  if (Object.keys(scheduledTrialSessionsByCity).length < 1) {
    return {
      bufferArray: undefined,
      message: SUGGESTED_TRIAL_SESSION_MESSAGES.invalid,
    };
  }

  const sortedScheduledTrialSessionsByCity = Object.keys(
    scheduledTrialSessionsByCity,
  )
    .sort((a, b) => {
      return a.localeCompare(b);
    })
    .reduce((obj, key) => {
      obj[key] = scheduledTrialSessionsByCity[key];
      return obj;
    }, {});

  console.time('10275: writeTrialSessionDataToExcel');
  const bufferArray = await writeTrialSessionDataToExcel({
    initialRegularCaseCountsByCity,
    initialSmallCaseCountsByCity,
    remainingRegularCaseCountByCity,
    remainingSmallCaseCountByCity,
    sessionCountPerWeek,
    sortedScheduledTrialSessionsByCity,
    weeks: weeksToLoop,
  });
  console.timeEnd('10275: writeTrialSessionDataToExcel');
  console.timeEnd('10275: Total interactor time');

  const message = generateSuccessMessage({ incorrectSizeRegularCases });

  return {
    bufferArray,
    message,
  };
};

export const getSpecialSessionsInTerm = ({
  sessions,
  termEndDate,
  termStartDate,
}: {
  sessions: RawTrialSession[];
  termEndDate: string;
  termStartDate: string;
}): RawTrialSession[] => {
  return sessions.filter(session => {
    const isSessionInTerm = isDateWithinGivenInterval({
      date: session.startDate,
      intervalEndDate: formatDateString(termEndDate, FORMATS.ISO),
      intervalStartDate: formatDateString(termStartDate, FORMATS.ISO),
    });

    return (
      session.sessionType === SESSION_TYPES.special &&
      session.isCalendared &&
      session.sessionStatus !== SESSION_STATUS_TYPES.closed &&
      isSessionInTerm
    );
  });
};

export const getPreviousTwoTerms = (termStartDate: string) => {
  const { month, year } = deconstructDate(termStartDate);

  const currentTerm = getCurrentTermByMonth(month);
  const terms = [
    `spring, ${+year - 1}`,
    `fall, ${+year - 1}`,
    `winter, ${year}`,
    `spring, ${year}`,
    `fall, ${year}`,
  ];
  const termIndex = terms.findIndex(t => `${currentTerm}, ${year}` === t);
  const term1 = terms[termIndex - 1];
  const term2 = terms[termIndex - 2];

  return [term1, term2];
};

const SESSION_TERMS_FOR_GENERATOR = {
  fall: [9, 10, 11, 12],
  spring: [4, 5, 6, 7, 8],
  winter: [1, 2, 3],
};

export const getCitiesFromLastTwoTerms = ({ sessions, termStartDate }) => {
  const previousTwoTerms = getPreviousTwoTerms(termStartDate);
  return sessions
    .filter(session => {
      const termString = `${session.term.toLowerCase()}, ${session.termYear}`;
      return (
        previousTwoTerms.includes(termString) &&
        session.sessionType !== SESSION_TYPES.special
      );
    })
    .map(relevantSession => {
      return relevantSession.trialLocation!;
    });
};

const generateSuccessMessage = ({ incorrectSizeRegularCases }) => {
  let successMessage = SUGGESTED_TRIAL_SESSION_MESSAGES.success;
  if (incorrectSizeRegularCases.length > 0) {
    const docketNumbers: string[] = [];
    incorrectSizeRegularCases.forEach(incorrectSizeRegularCase => {
      docketNumbers.push(incorrectSizeRegularCase.docketNumber);
    });

    docketNumbers.sort((a, b) => {
      return (
        Case.getSortableDocketNumber(a)! - Case.getSortableDocketNumber(b)!
      );
    });

    successMessage =
      successMessage +
      ` The following cases have a procedure type the does not match their preferred trial location's procedure type: ${docketNumbers.join(', ')}`;
  }

  return successMessage;
};

function getCurrentTermByMonth(currentMonth: string) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const term = Object.entries(SESSION_TERMS_FOR_GENERATOR).find(([_, months]) =>
    months.includes(parseInt(currentMonth)),
  );
  return term ? term[0] : 'Unknown term';
}
