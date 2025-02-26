import {
  CaseCountsAndSessionsByCity,
  getDataForCalendaring,
} from '@web-api/business/useCaseHelper/trialSessions/trialSessionCalendaring/getDataForCalendaring';
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
  SUGGESTED_TRIAL_SESSION_TITLES,
  USER_MESSAGE_TYPES,
  UserMessageType,
} from '@shared/business/entities/EntityConstants';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { createProspectiveTrialSessions } from '@web-api/business/useCaseHelper/trialSessions/trialSessionCalendaring/createProspectiveTrialSessions';
import { generateCalendar } from '@web-api/business/useCaseHelper/trialSessions/trialSessionCalendaring/generateCalendar';
import {
  maxSessionsPerLocationConstraint,
  maxSessionsPerWeekConstraint,
  oneSessionPerLocationPerWeekConstraint,
  reservedWeekOfAtLocationConstraint,
  washingtonDcSpecialConstraint,
} from '@web-api/business/useCaseHelper/trialSessions/trialSessionCalendaring/constraints';
import { sortObjectByKey } from '@shared/tools/helpers';
import { writeTrialSessionDataToExcel } from '@web-api/business/useCaseHelper/trialSessions/trialSessionCalendaring/writeTrialSessionDataToExcel';
import { RawGenerateSuggestedTermForm } from '@shared/business/entities/trialSessions/GenerateSuggestedTermForm';

export const WASHINGTON_DC_STRING = 'Washington, District of Columbia';
export const WASHINGTON_DC_NORTH_STRING =
  'Washington (North), District of Columbia'; // specials only
export const WASHINGTON_DC_SOUTH_STRING =
  'Washington (South), District of Columbia'; // all session types

// NOTE: will front-load term with trial sessions, and prioritize Regular > Small > Hybrid

export type TrialSessionReadyForCalendaring = TrialSession & { weekOf: string };

export type CalendarGeneratorMessage = {
  message: string;
  title?: string;
  type: UserMessageType;
};

export const generateSuggestedTrialSessionCalendarInteractor = async (
  applicationContext: ServerApplicationContext,
  TERM_BUILDER_INFORMATION: RawGenerateSuggestedTermForm,
  authorizedUser: UnknownAuthUser,
): Promise<{
  message: CalendarGeneratorMessage;
  bufferArray: Buffer | undefined;
}> => {
  if (
    !isAuthorized(authorizedUser, ROLE_PERMISSIONS.SET_TRIAL_SESSION_CALENDAR)
  ) {
    throw new UnauthorizedError('Unauthorized to generate term');
  }

  const {
    termEndDate,
    termStartDate,
    minimumCasesPerLocation, //TODO: FIGURE OUT WHERE TO USE THIS
    ...calendaringConfig
  } = TERM_BUILDER_INFORMATION;

  const cases = await applicationContext
    .getPersistenceGateway()
    .getSuggestedCalendarCases({ applicationContext });

  const sessions = await applicationContext
    .getPersistenceGateway()
    .getTrialSessions({ applicationContext });

  const specialSessions = getSpecialSessionsInTerm({
    sessions,
    termEndDate,
    termStartDate,
  });

  const citiesFromLastTwoTerms = getCitiesFromLastTwoTerms({
    sessions,
    termStartDate,
  });

  // eslint-disable-next-line prefer-const
  let { caseCountsAndSessionsByCity, incorrectSizeRegularCases } =
    getDataForCalendaring({ cases });

  let userMessages: string[];

  ({ caseCountsAndSessionsByCity } = createProspectiveTrialSessions({
    calendaringConfig,
    caseCountsAndSessionsByCity,
    citiesFromLastTwoTerms,
  }));

  const weeksToLoop = getWeeksInRange({
    endDate: termEndDate,
    startDate: termStartDate,
  });

  const constraints = [
    washingtonDcSpecialConstraint,
    maxSessionsPerWeekConstraint,
    maxSessionsPerLocationConstraint,
    oneSessionPerLocationPerWeekConstraint,
    reservedWeekOfAtLocationConstraint,
  ];

  // eslint-disable-next-line prefer-const
  ({ caseCountsAndSessionsByCity, userMessages } = generateCalendar({
    calendaringConfig,
    caseCountsAndSessionsByCity,
    constraints,
    specialSessions,
    weeksToLoop,
  }));

  if (calendarIsEmpty(caseCountsAndSessionsByCity)) {
    return {
      bufferArray: undefined,
      message: {
        message:
          'There are no trial sessions to schedule within the dates provided.',
        title: SUGGESTED_TRIAL_SESSION_TITLES.invalid,
        type: USER_MESSAGE_TYPES.error,
      },
    };
  }

  sortObjectByKey(caseCountsAndSessionsByCity, (a, b) => {
    return a.localeCompare(b);
  });

  const bufferArray = await writeTrialSessionDataToExcel({
    caseCountsAndSessionsByCity,
    incorrectSizeRegularCases,
    userMessages,
    weeks: weeksToLoop,
  });

  return {
    bufferArray,
    message: generateMessage({ userMessages }),
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

export const getPreviousTwoTerms = (
  termStartDate: string,
): [string, string] => {
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

export const getCitiesFromLastTwoTerms = ({
  sessions,
  termStartDate,
}: {
  sessions: RawTrialSession[];
  termStartDate: string;
}): string[] => {
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

const generateMessage = ({
  userMessages,
}: {
  userMessages: string[];
}): CalendarGeneratorMessage => {
  if (userMessages.length === 0) {
    return {
      message: SUGGESTED_TRIAL_SESSION_TITLES.success,
      title: undefined,
      type: USER_MESSAGE_TYPES.success,
    };
  } else {
    let messageString = '';
    userMessages.forEach(userMessage => {
      messageString = messageString + ' ' + userMessage;
    });
    messageString = messageString.trim();

    return {
      message: messageString,
      title: SUGGESTED_TRIAL_SESSION_TITLES.warning,
      type: USER_MESSAGE_TYPES.warning,
    };
  }
};

const calendarIsEmpty = (
  caseCountsAndSessionsByCity: CaseCountsAndSessionsByCity,
) => {
  return Object.values(caseCountsAndSessionsByCity).every(cityObject => {
    return cityObject.scheduledSessions.length < 1;
  });
};

const getCurrentTermByMonth = (currentMonth: string): string => {
  const term = Object.entries(SESSION_TERMS_FOR_GENERATOR).find(([, months]) =>
    months.includes(parseInt(currentMonth)),
  );
  return term ? term[0] : 'Unknown term';
};
