import {
  FORMATS,
  formatNow,
  prepareDateFromString,
} from '../../../../shared/src/business/utilities/DateHandler';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { formatTrialSessionDisplayOptions } from './addToTrialSessionModalHelper';
import { formattedTrialSessions as formattedTrialSessionsComputed } from './formattedTrialSessions';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../withAppContext';
jest.mock('./addToTrialSessionModalHelper.ts');

const {
  SESSION_TYPES,
  TRIAL_SESSION_PROCEEDING_TYPES,
  USER_ROLES: ROLES,
} = applicationContext.getConstants();

const formattedTrialSessions = withAppContextDecorator(
  formattedTrialSessionsComputed,
  {
    ...applicationContext,
    getCurrentUser: () => currentUser,
  },
);

const getStartOfWeek = date => {
  return prepareDateFromString(date, null).startOf('week').toFormat('DDD');
};

let nextYear;
let currentUser = {};

const testJudgeUser = {
  role: ROLES.judge,
  userId: '1',
};

const testTrialClerkUser = {
  role: ROLES.trialClerk,
  userId: '10',
};

const baseState = {
  constants: { USER_ROLES: ROLES },
  judgeUser: testJudgeUser,
};

let TRIAL_SESSIONS_LIST: any[] = [];

describe('formattedTrialSessions', () => {
  beforeAll(() => {
    nextYear = (parseInt(formatNow(FORMATS.YEAR)) + 1).toString();
  });

  beforeEach(() => {
    currentUser = testJudgeUser;
    TRIAL_SESSIONS_LIST = [
      {
        caseOrder: [],
        isCalendared: true,
        judge: { name: '1', userId: '1' },
        proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
        sessionStatus: 'Open',
        sessionType: SESSION_TYPES.regular,
        startDate: '2019-11-25T15:00:00.000Z',
        swingSession: true,
        term: 'Fall',
        termYear: '2019',
        trialLocation: 'Hartford, Connecticut',
        trialSessionId: '1',
      },
      {
        caseOrder: [],
        isCalendared: false,
        judge: { name: '2', userId: '2' },
        proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.remote,
        sessionStatus: 'New',
        sessionType: SESSION_TYPES.small,
        startDate: '2019-11-25T15:00:00.000Z',
        swingSession: true,
        term: 'Winter',
        trialClerk: { name: '10', userId: '10' },
        trialLocation: 'Knoxville, TN',
        trialSessionId: '2',
      },
      {
        caseOrder: [],
        isCalendared: false,
        judge: { name: '3', userId: '3' },
        noticeIssuedDate: '2019-07-25T15:00:00.000Z',
        proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
        sessionStatus: 'New',
        sessionType: SESSION_TYPES.regular,
        startDate: '2019-11-27T15:00:00.000Z',
        swingSession: true,
        term: 'Winter',
        trialLocation: 'Jacksonville, FL',
        trialSessionId: '3',
      },
      {
        caseOrder: [],
        isCalendared: false,
        judge: { name: '88', userId: '88' },
        noticeIssuedDate: '2020-07-26T15:00:00.000Z',
        proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
        sessionStatus: 'New',
        sessionType: SESSION_TYPES.regular,
        startDate: '2020-11-26T15:00:00.000Z',
        swingSession: true,
        term: 'Winter',
        trialLocation: 'Jacksonville, FL',
        trialSessionId: '8',
      },
      {
        caseOrder: [],
        isCalendared: true,
        judge: { name: '4', userId: '4' },
        proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
        sessionStatus: 'Open',
        sessionType: SESSION_TYPES.hybrid,
        startDate: '2019-11-27T15:00:00.000Z',
        swingSession: true,
        term: 'Summer',
        trialLocation: 'Memphis, TN',
        trialSessionId: '4',
      },
      {
        caseOrder: [],
        isCalendared: true,
        judge: { name: '5', userId: '5' },
        proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.remote,
        sessionStatus: 'Open',
        sessionType: SESSION_TYPES.hybrid,
        startDate: '2019-11-25T15:00:00.000Z',
        swingSession: false,
        term: 'Spring',
        termYear: '2019',
        trialLocation: 'Anchorage, AK',
      },
      {
        caseOrder: [],
        estimatedEndDate: '2045-02-17T15:00:00.000Z',
        isCalendared: true,
        judge: { name: '6', userId: '6' },
        proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
        sessionStatus: 'Open',
        sessionType: SESSION_TYPES.regular,
        startDate: `${nextYear}-02-17T15:00:00.000Z`,
        swingSession: false,
        term: 'Spring',
        trialLocation: 'Jacksonville, FL',
      },
    ];

    formatTrialSessionDisplayOptions.mockImplementation(session => session);
  });

  it('does not error if user is undefined', () => {
    let error;
    try {
      runCompute(formattedTrialSessions, {
        state: {
          ...baseState,
          trialSessions: TRIAL_SESSIONS_LIST,
        },
      });
    } catch (err) {
      error = err;
    }
    expect(error).toBeUndefined();
  });

  it('groups trial sessions into arrays according to session weeks', () => {
    const result = runCompute(formattedTrialSessions, {
      state: {
        ...baseState,
        trialSessions: TRIAL_SESSIONS_LIST,
        user: testJudgeUser,
      },
    });

    expect(result.filteredTrialSessions).toBeDefined();
    expect(result.formattedSessions.length).toBe(3);
    expect(result.formattedSessions[0].dateFormatted).toEqual(
      'November 25, 2019',
    );
    expect(result.formattedSessions[1].dateFormatted).toEqual(
      getStartOfWeek(result.formattedSessions[1].sessions[0].startDate),
    );
  });

  it('should filter trial sessions by judge', () => {
    const result = runCompute(formattedTrialSessions, {
      state: {
        ...baseState,
        screenMetadata: { trialSessionFilters: { judge: { userId: '1' } } },
        trialSessions: TRIAL_SESSIONS_LIST,
        user: testJudgeUser,
      },
    });
    expect(result.formattedSessions.length).toBe(1);
  });

  it('should double filter trial sessions', () => {
    const result = runCompute(formattedTrialSessions, {
      state: {
        ...baseState,
        screenMetadata: {
          trialSessionFilters: {
            proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
            sessionType: SESSION_TYPES.regular,
          },
        },
        trialSessions: TRIAL_SESSIONS_LIST,
        user: testJudgeUser,
      },
    });
    const flattenedSessions = result.formattedSessions.flatMap(
      week => week.sessions,
    );
    expect(flattenedSessions.length).toBe(4);
  });

  it('returns all trial sessions if judge userId trial session filter is an empty string', () => {
    const result = runCompute(formattedTrialSessions, {
      state: {
        ...baseState,
        screenMetadata: { trialSessionFilters: { judge: { userId: '' } } },
        trialSessions: TRIAL_SESSIONS_LIST,
        user: testJudgeUser,
      },
    });
    expect(result.formattedSessions.length).toBe(3);
  });

  it('does NOT return the unassigned judge filter on trial sessions tabs other than "new"', () => {
    let result = runCompute(formattedTrialSessions, {
      state: {
        ...baseState,
        currentViewMetadata: {
          trialSessions: {
            tab: 'open',
          },
        },
        screenMetadata: {
          trialSessionFilters: { judge: { userId: 'unassigned' } },
        },
        trialSessions: TRIAL_SESSIONS_LIST,
        user: testJudgeUser,
      },
    });

    expect(result.formattedSessions.length).toBe(3);
  });

  it('shows swing session option only if matching term and term year is found', () => {
    let form = {
      term: 'Winter',
      termYear: '2019',
    };
    let result = runCompute(formattedTrialSessions, {
      state: {
        ...baseState,
        form,
        trialSessions: TRIAL_SESSIONS_LIST,
        user: testJudgeUser,
      },
    });
    expect(result.sessionsByTerm.length).toEqual(0);
    expect(result.showSwingSessionOption).toBeFalsy();

    form.term = 'Spring';
    result = runCompute(formattedTrialSessions, {
      state: {
        ...baseState,
        form,
        trialSessions: TRIAL_SESSIONS_LIST,
        user: testJudgeUser,
      },
    });
    expect(result.sessionsByTerm.length).toEqual(1);
    expect(result.showSwingSessionOption).toBeTruthy();

    form.termYear = '2011'; // similar term but not a matching year
    result = runCompute(formattedTrialSessions, {
      state: {
        ...baseState,
        form,
        trialSessions: TRIAL_SESSIONS_LIST,
        user: testJudgeUser,
      },
    });
    expect(result.sessionsByTerm.length).toEqual(0);
    expect(result.showSwingSessionOption).toBeFalsy();
  });

  it('returns sessionsByTerm with only sessions in that term sorted chronologically if form.term is set', () => {
    const result = runCompute(formattedTrialSessions, {
      state: {
        ...baseState,
        form: {
          term: 'Winter',
        },
        trialSessions: TRIAL_SESSIONS_LIST,
        user: testJudgeUser,
      },
    });

    expect(result.sessionsByTerm).toEqual([
      {
        caseOrder: [],
        formattedEstimatedEndDate: '',
        formattedNoticeIssuedDate: '07/25/2019',
        formattedStartDate: '11/27/19',
        isCalendared: false,
        judge: { name: '3', userId: '3' },
        noticeIssuedDate: '2019-07-25T15:00:00.000Z',
        proceedingType: 'In Person',
        sessionStatus: 'New',
        sessionType: 'Regular',
        showAlertForNOTTReminder: undefined,
        startDate: '2019-11-27T15:00:00.000Z',
        startOfWeek: 'November 25, 2019',
        startOfWeekSortable: '20191125',
        swingSession: true,
        term: 'Winter',
        trialLocation: 'Jacksonville, FL',
        trialSessionId: '3',
        userIsAssignedToSession: false,
      },
      {
        caseOrder: [],
        formattedEstimatedEndDate: '',
        formattedNoticeIssuedDate: '07/26/2020',
        formattedStartDate: '11/26/20',
        isCalendared: false,
        judge: { name: '88', userId: '88' },
        noticeIssuedDate: '2020-07-26T15:00:00.000Z',
        proceedingType: 'In Person',
        sessionStatus: 'New',
        sessionType: 'Regular',
        showAlertForNOTTReminder: undefined,
        startDate: '2020-11-26T15:00:00.000Z',
        startOfWeek: 'November 23, 2020',
        startOfWeekSortable: '20201123',
        swingSession: true,
        term: 'Winter',
        trialLocation: 'Jacksonville, FL',
        trialSessionId: '8',
        userIsAssignedToSession: false,
      },
      {
        caseOrder: [],
        formattedEstimatedEndDate: '',
        formattedNoticeIssuedDate: '',
        formattedStartDate: '11/25/19',
        isCalendared: false,
        judge: { name: '2', userId: '2' },
        proceedingType: 'Remote',
        sessionStatus: 'New',
        sessionType: 'Small',
        showAlertForNOTTReminder: undefined,
        startDate: '2019-11-25T15:00:00.000Z',
        startOfWeek: 'November 25, 2019',
        startOfWeekSortable: '20191125',
        swingSession: true,
        term: 'Winter',
        trialClerk: { name: '10', userId: '10' },
        trialLocation: 'Knoxville, TN',
        trialSessionId: '2',
        userIsAssignedToSession: false,
      },
    ]);
  });

  it('makes a call to format display text on sessionsByTerm', () => {
    runCompute(formattedTrialSessions, {
      state: {
        ...baseState,
        form: {
          term: 'Winter',
        },
        trialSessions: TRIAL_SESSIONS_LIST,
        user: testJudgeUser,
      },
    });

    expect(formatTrialSessionDisplayOptions).toHaveBeenCalled();
  });

  it('removes the current trial session from the sessionsByTerm when state.trialSession.trialSessionId is defined', () => {
    const { sessionsByTerm } = runCompute(formattedTrialSessions, {
      state: {
        ...baseState,
        form: {
          term: 'Winter',
        },
        trialSession: { trialSessionId: TRIAL_SESSIONS_LIST[1].trialSessionId },
        trialSessions: TRIAL_SESSIONS_LIST,
        user: testJudgeUser,
      },
    });

    expect(
      sessionsByTerm.find(
        session =>
          session.trialSessionId === TRIAL_SESSIONS_LIST[1].trialSessionId,
      ),
    ).toBeUndefined();
  });

  it('sets userIsAssignedToSession false for all sessions if there is no associated judgeUser', () => {
    const result = runCompute(formattedTrialSessions, {
      state: {
        ...baseState,
        judgeUser: undefined,
        trialSessions: TRIAL_SESSIONS_LIST,
        user: { role: ROLES.petitionsClerk, userId: '1' },
      },
    });

    expect(result.formattedSessions[0]).toMatchObject({
      dateFormatted: 'November 25, 2019',
      sessions: [
        {
          judge: { name: '5', userId: '5' },
          userIsAssignedToSession: false,
        },
        {
          judge: { name: '1', userId: '1' },
          userIsAssignedToSession: false,
        },
        {
          judge: { name: '2', userId: '2' },
          userIsAssignedToSession: false,
        },
        {
          judge: { name: '3', userId: '3' },
          userIsAssignedToSession: false,
        },
        {
          judge: { name: '4', userId: '4' },
          userIsAssignedToSession: false,
        },
      ],
    });

    expect(result.formattedSessions[1]).toMatchObject({
      dateFormatted: getStartOfWeek(
        result.formattedSessions[1].sessions[0].startDate,
      ),
      sessions: [
        {
          judge: { name: '88', userId: '88' },
          userIsAssignedToSession: false,
        },
      ],
    });
  });

  it('sets userIsAssignedToSession true for sessions the judge user is assigned to', () => {
    const result = runCompute(formattedTrialSessions, {
      state: {
        ...baseState,
        trialSessions: TRIAL_SESSIONS_LIST,
        user: testJudgeUser,
      },
    });
    expect(result.formattedSessions).toMatchObject([
      {
        dateFormatted: 'November 25, 2019',
        sessions: [
          {
            judge: { name: '5', userId: '5' },
            userIsAssignedToSession: false,
          },
          {
            judge: { name: '1', userId: '1' },
            userIsAssignedToSession: true,
          },
          {
            judge: { name: '2', userId: '2' },
            userIsAssignedToSession: false,
          },
          {
            judge: { name: '3', userId: '3' },
            userIsAssignedToSession: false,
          },
          {
            judge: { name: '4', userId: '4' },
            userIsAssignedToSession: false,
          },
        ],
      },
      {
        dateFormatted: getStartOfWeek(
          result.formattedSessions[1].sessions[0].startDate,
        ),
        sessions: [
          {
            judge: { name: '88', userId: '88' },
            userIsAssignedToSession: false,
          },
        ],
      },
      {
        dateFormatted: 'February 17, 2025',
        sessions: [
          {
            caseOrder: [],
            estimatedEndDate: '2045-02-17T15:00:00.000Z',
            formattedEstimatedEndDate: '02/17/45',
            formattedNoticeIssuedDate: '',
            formattedStartDate: '02/17/25',
            isCalendared: true,
            judge: { name: '6', userId: '6' },
            proceedingType: 'In Person',
            sessionStatus: 'Open',
            sessionType: 'Regular',
            showAlertForNOTTReminder: undefined,
            startDate: '2025-02-17T15:00:00.000Z',
            startOfWeek: 'February 17, 2025',
            startOfWeekSortable: '20250217',
            swingSession: false,
            term: 'Spring',
            trialLocation: 'Jacksonville, FL',
            userIsAssignedToSession: false,
          },
        ],
      },
    ]);
  });

  it('sets userIsAssignedToSession true for sessions the current trial clerk user is assigned to', () => {
    currentUser = testTrialClerkUser;

    const result = runCompute(formattedTrialSessions, {
      state: {
        ...baseState,
        judgeUser: undefined,
        trialSessions: TRIAL_SESSIONS_LIST,
      },
    });

    expect(result.formattedSessions[0]).toMatchObject({
      dateFormatted: 'November 25, 2019',
      sessions: [
        {
          judge: { name: '5', userId: '5' },
          userIsAssignedToSession: false,
        },
        {
          judge: { name: '1', userId: '1' },
          userIsAssignedToSession: false,
        },
        {
          trialClerk: { name: '10', userId: '10' },
          userIsAssignedToSession: true,
        },
        {
          judge: { name: '3', userId: '3' },
          userIsAssignedToSession: false,
        },
        {
          judge: { name: '4', userId: '4' },
          userIsAssignedToSession: false,
        },
      ],
    });

    expect(result.formattedSessions[1]).toMatchObject({
      dateFormatted: getStartOfWeek(
        result.formattedSessions[1].sessions[0].startDate,
      ),
      sessions: [
        {
          judge: { name: '88', userId: '88' },
          userIsAssignedToSession: false,
        },
      ],
    });
  });

  it('sets userIsAssignedToSession false if the current user and session have no associated judge', () => {
    const startDate = `${nextYear}-02-17T15:00:00.000Z`;
    const result = runCompute(formattedTrialSessions, {
      state: {
        ...baseState,
        judgeUser: undefined,
        trialSessions: [
          {
            caseOrder: [],
            judge: undefined,
            sessionStatus: 'Open',
            startDate,
            swingSession: false,
            trialLocation: 'Jacksonville, FL',
          },
        ],
        user: { role: ROLES.petitionsClerk, userId: '1' },
      },
    });
    expect(result.formattedSessions).toMatchObject([
      {
        dateFormatted: getStartOfWeek(startDate),
        sessions: [
          {
            userIsAssignedToSession: false,
          },
        ],
      },
    ]);
  });
});
