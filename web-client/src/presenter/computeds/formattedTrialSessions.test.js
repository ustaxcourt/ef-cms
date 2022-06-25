import {
  FORMATS,
  formatNow,
  prepareDateFromString,
} from '../../../../shared/src/business/utilities/DateHandler';
import { applicationContext } from '../../applicationContext';
import { formattedTrialSessions as formattedTrialSessionsComputed } from './formattedTrialSessions';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

const {
  TRIAL_SESSION_PROCEEDING_TYPES,
  TRIAL_SESSION_TYPES,
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
  return prepareDateFromString(date).startOf('week').toFormat('DDD');
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

let TRIAL_SESSIONS_LIST = [];

describe('formattedTrialSessions', () => {
  beforeAll(() => {
    nextYear = (parseInt(formatNow(FORMATS.YEAR)) + 1).toString();
  });

  beforeEach(() => {
    currentUser = testJudgeUser;
    TRIAL_SESSIONS_LIST = [
      {
        caseOrder: [],
        judge: { name: '1', userId: '1' },
        proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
        sessionType: TRIAL_SESSION_TYPES.regular,
        startDate: '2019-11-25T15:00:00.000Z',
        swingSession: true,
        term: 'Fall',
        termYear: '2019',
        trialLocation: 'Hartford, Connecticut',
      },
      {
        caseOrder: [],
        judge: { name: '2', userId: '2' },
        proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.remote,
        sessionType: TRIAL_SESSION_TYPES.small,
        startDate: '2019-11-25T15:00:00.000Z',
        swingSession: true,
        term: 'Winter',
        trialClerk: { name: '10', userId: '10' },
        trialLocation: 'Knoxville, TN',
      },
      {
        caseOrder: [],
        judge: { name: '3', userId: '3' },
        noticeIssuedDate: '2019-07-25T15:00:00.000Z',
        proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
        sessionType: TRIAL_SESSION_TYPES.regular,
        startDate: '2019-11-27T15:00:00.000Z',
        swingSession: true,
        term: 'Winter',
        trialLocation: 'Jacksonville, FL',
      },
      {
        caseOrder: [],
        judge: { name: '4', userId: '4' },
        proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
        sessionType: TRIAL_SESSION_TYPES.hybrid,
        startDate: '2019-11-27T15:00:00.000Z',
        swingSession: true,
        term: 'Summer',
        trialLocation: 'Memphis, TN',
      },
      {
        caseOrder: [],
        judge: { name: '5', userId: '5' },
        proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.remote,
        sessionType: TRIAL_SESSION_TYPES.hybrid,
        startDate: '2019-11-25T15:00:00.000Z',
        swingSession: false,
        term: 'Spring',
        termYear: '2019',
        trialLocation: 'Anchorage, AK',
      },
      {
        caseOrder: [],
        estimatedEndDate: '2045-02-17T15:00:00.000Z',
        judge: { name: '6', userId: '6' },
        proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
        sessionType: TRIAL_SESSION_TYPES.regular,
        startDate: `${nextYear}-02-17T15:00:00.000Z`,
        swingSession: false,
        term: 'Spring',
        trialLocation: 'Jacksonville, FL',
      },
    ];
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
    expect(result.formattedSessions.length).toBe(2);
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
            sessionType: TRIAL_SESSION_TYPES.regular,
          },
        },
        trialSessions: TRIAL_SESSIONS_LIST,
        user: testJudgeUser,
      },
    });
    const flattenedSessions = result.formattedSessions.flatMap(
      week => week.sessions,
    );
    expect(flattenedSessions.length).toBe(3);
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
    expect(result.formattedSessions.length).toBe(2);
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

    expect(result.formattedSessions.length).toBe(2);
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

  it('returns sessionsByTerm with only sessions in that term if form.term is set', () => {
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
        formattedNoticeIssuedDate: '07/25/2019',
        formattedStartDate: '11/27/19',
        judge: { name: '3', userId: '3' },
        noticeIssuedDate: '2019-07-25T15:00:00.000Z',
        proceedingType: 'In Person',
        sessionStatus: 'New',
        sessionType: TRIAL_SESSION_TYPES.regular,
        startDate: '2019-11-27T15:00:00.000Z',
        startOfWeek: 'November 25, 2019',
        startOfWeekSortable: '20191125',
        swingSession: true,
        term: 'Winter',
        trialLocation: 'Jacksonville, FL',
        userIsAssignedToSession: false,
      },
      {
        caseOrder: [],
        formattedNoticeIssuedDate: undefined,
        formattedStartDate: '11/25/19',
        judge: { name: '2', userId: '2' },
        proceedingType: 'Remote',
        sessionStatus: 'New',
        sessionType: TRIAL_SESSION_TYPES.small,
        startDate: '2019-11-25T15:00:00.000Z',
        startOfWeek: 'November 25, 2019',
        startOfWeekSortable: '20191125',
        swingSession: true,
        term: 'Winter',
        trialClerk: { name: '10', userId: '10' },
        trialLocation: 'Knoxville, TN',
        userIsAssignedToSession: false,
      },
    ]);
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
      },
      {
        dateFormatted: getStartOfWeek(
          result.formattedSessions[1].sessions[0].startDate,
        ),
        sessions: [
          {
            judge: { name: '6', userId: '6' },
            userIsAssignedToSession: false,
          },
        ],
      },
    ]);
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
            judge: { name: '6', userId: '6' },
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
      },
      {
        dateFormatted: getStartOfWeek(
          result.formattedSessions[1].sessions[0].startDate,
        ),
        sessions: [
          {
            judge: { name: '6', userId: '6' },
            userIsAssignedToSession: false,
          },
        ],
      },
    ]);
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
