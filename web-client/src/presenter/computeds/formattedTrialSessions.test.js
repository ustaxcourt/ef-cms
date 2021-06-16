import { applicationContext } from '../../applicationContext';
import {
  filterFormattedSessionsByStatus,
  formatSession,
  formattedTrialSessions as formattedTrialSessionsComputed,
} from './formattedTrialSessions';
import {
  formatNow,
  prepareDateFromString,
} from '../../../../shared/src/business/utilities/DateHandler';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

const { SESSION_STATUS_GROUPS, USER_ROLES: ROLES } =
  applicationContext.getConstants();

const formattedTrialSessions = withAppContextDecorator(
  formattedTrialSessionsComputed,
  {
    ...applicationContext,
    getCurrentUser: () => currentUser,
  },
);

const getStartOfWeek = date => {
  return prepareDateFromString(date).startOf('isoWeek').format('MMMM D, YYYY');
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
    nextYear = (parseInt(formatNow('YYYY')) + 1).toString();
  });
  beforeEach(() => {
    currentUser = testJudgeUser;
    TRIAL_SESSIONS_LIST = [
      {
        caseOrder: [],
        judge: { name: '1', userId: '1' },
        startDate: '2019-11-25T15:00:00.000Z',
        swingSession: true,
        trialLocation: 'Hartford, Connecticut',
      },
      {
        caseOrder: [],
        judge: { name: '2', userId: '2' },
        startDate: '2019-11-25T15:00:00.000Z',
        swingSession: true,
        trialClerk: { name: '10', userId: '10' },
        trialLocation: 'Knoxville, TN',
      },
      {
        caseOrder: [],
        judge: { name: '3', userId: '3' },
        noticeIssuedDate: '2019-07-25T15:00:00.000Z',
        startDate: '2019-11-27T15:00:00.000Z',
        swingSession: true,
        trialLocation: 'Jacksonville, FL',
      },
      {
        caseOrder: [],
        judge: { name: '4', userId: '4' },
        startDate: '2019-11-27T15:00:00.000Z',
        swingSession: true,
        trialLocation: 'Memphis, TN',
      },
      {
        caseOrder: [],
        judge: { name: '5', userId: '5' },
        startDate: '2019-11-25T15:00:00.000Z',
        swingSession: false,
        trialLocation: 'Anchorage, AK',
      },
      {
        caseOrder: [],
        judge: { name: '6', userId: '6' },
        startDate: `${nextYear}-02-17T15:00:00.000Z`,
        swingSession: false,
        trialLocation: 'Jacksonville, FL',
      },
    ];
  });

  describe('filterFormattedSessionsByStatus', () => {
    let trialTerms;

    beforeEach(() => {
      trialTerms = [
        {
          dateFormatted: 'October 1, 2022',
          sessions: [...TRIAL_SESSIONS_LIST],
        },
        {
          dateFormatted: 'November 1, 2022',
          sessions: [...TRIAL_SESSIONS_LIST],
        },
        {
          dateFormatted: 'December 1, 2022',
          sessions: [...TRIAL_SESSIONS_LIST],
        },
      ];
    });

    it('filters closed cases when all trial session cases are inactive', () => {
      const sessions = trialTerms[0].sessions.slice(0);
      sessions[0] = {
        ...sessions[0],
        caseOrder: [
          { docketNumber: '123-19', removedFromTrial: true },
          { docketNumber: '234-19', removedFromTrial: true },
        ],
      };
      trialTerms[0].sessions = sessions;

      const results = filterFormattedSessionsByStatus(
        trialTerms,
        applicationContext,
      );

      expect(results.Closed.length).toEqual(1);
      expect(results.Closed).toEqual([
        {
          ...trialTerms[0],
          sessions: [sessions[0]],
        },
      ]);
    });

    it('filters open trial sessions', () => {
      const sessions = trialTerms[0].sessions.slice(0);
      sessions[0] = {
        ...sessions[0],
        isCalendared: true,
      };
      trialTerms[0].sessions = sessions;

      const results = filterFormattedSessionsByStatus(
        trialTerms,
        applicationContext,
      );

      expect(results.Open.length).toEqual(1);
      expect(results.Open).toEqual([
        {
          ...trialTerms[0],
          sessions: [sessions[0]],
        },
      ]);
    });

    it('filters new trial sessions', () => {
      TRIAL_SESSIONS_LIST.forEach(session => (session.isCalendared = true));
      const sessions = trialTerms[0].sessions.slice(0);
      sessions[0] = {
        ...sessions[0],
        isCalendared: false,
      };
      trialTerms[0].sessions = sessions;

      const results = filterFormattedSessionsByStatus(
        trialTerms,
        applicationContext,
      );

      expect(results.New.length).toEqual(1);
      expect(results.New).toEqual([
        {
          ...trialTerms[0],
          sessions: [sessions[0]],
        },
      ]);
    });

    it('filters all trial sessions (returns everything) with the sessionStatus on the session', () => {
      const results = filterFormattedSessionsByStatus(
        trialTerms,
        applicationContext,
      );

      const getSessionCount = trialTermsList => {
        let count = 0;
        trialTermsList.forEach(term => (count += term.sessions.length));
        return count;
      };

      expect(results.All.length).toEqual(trialTerms.length);
      expect(getSessionCount(results.All)).toEqual(getSessionCount(trialTerms));
      expect(results.All[0].sessions[0]).toHaveProperty('sessionStatus');
    });
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

  it('formats trial sessions correctly selecting startOfWeek and formatting start date', () => {
    const result = formatSession(TRIAL_SESSIONS_LIST[2], applicationContext);
    expect(result).toMatchObject({
      formattedNoticeIssuedDate: '07/25/2019',
      formattedStartDate: '11/27/19',
      judge: { name: '3', userId: '3' },
      startDate: '2019-11-27T15:00:00.000Z',
      startOfWeek: 'November 25, 2019',
    });
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

  it('filter trial sessions', () => {
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
    const trialSessions = [
      {
        caseOrder: [],
        judge: { name: '1', userId: '1' },
        startDate: '2019-11-25T15:00:00.000Z',
        term: 'Fall',
        termYear: '2019',
        trialLocation: 'Denver, CO',
      },
      {
        caseOrder: [],
        judge: { name: '2', userId: '2' },
        startDate: '2019-04-25T15:00:00.000Z',
        term: 'Spring',
        termYear: '2019',
        trialLocation: 'Jacksonville, FL',
      },
    ];

    let form = {
      term: 'Winter',
      termYear: '2019',
    };
    let result = runCompute(formattedTrialSessions, {
      state: {
        ...baseState,
        form,
        trialSessions,
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
        trialSessions,
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
        trialSessions,
        user: testJudgeUser,
      },
    });
    expect(result.sessionsByTerm.length).toEqual(0);
    expect(result.showSwingSessionOption).toBeFalsy();
  });

  it('returns sessionsByTerm with only sessions in that term if form.term is set', () => {
    const trialSessions = [
      {
        caseOrder: [],
        judge: { name: '1', userId: '1' },
        startDate: '2019-11-25T15:00:00.000Z',
        term: 'Winter',
        trialLocation: 'Denver, CO',
      },
      {
        caseOrder: [],
        judge: { name: '2', userId: '2' },
        startDate: '2019-11-25T15:00:00.000Z',
        term: 'Spring',
        trialLocation: 'Jacksonville, FL',
      },
      {
        caseOrder: [],
        judge: { name: '2', userId: '2' },
        startDate: '2019-11-25T15:00:00.000Z',
        term: 'Summer',
        trialLocation: 'Jacksonville, FL',
      },
      {
        caseOrder: [],
        judge: { name: '3', userId: '3' },
        startDate: '2019-11-25T15:00:00.000Z',
        term: 'Fall',
        trialLocation: 'Houston, TX',
      },
      {
        caseOrder: [],
        judge: { name: '4', userId: '4' },
        startDate: '2019-11-25T15:00:00.000Z',
        term: 'Winter',
        trialLocation: 'Birmingham, Alabama',
      },
      {
        caseOrder: [],
        judge: { name: '5', userId: '5' },
        startDate: '2019-11-25T15:00:00.000Z',
        term: 'Winter',
        trialLocation: 'Seattle, WA',
      },
    ];
    const result = runCompute(formattedTrialSessions, {
      state: {
        ...baseState,
        form: {
          term: 'Winter',
        },
        trialSessions,
        user: testJudgeUser,
      },
    });
    expect(result.sessionsByTerm).toEqual([
      {
        caseOrder: [],
        formattedStartDate: '11/25/19',
        judge: { name: '4', userId: '4' },
        sessionStatus: SESSION_STATUS_GROUPS.new,
        startDate: '2019-11-25T15:00:00.000Z',
        startOfWeek: 'November 25, 2019',
        startOfWeekSortable: '20191125',
        term: 'Winter',
        trialLocation: 'Birmingham, Alabama',
        userIsAssignedToSession: false,
      },
      {
        caseOrder: [],
        formattedStartDate: '11/25/19',
        judge: { name: '1', userId: '1' },
        sessionStatus: SESSION_STATUS_GROUPS.new,
        startDate: '2019-11-25T15:00:00.000Z',
        startOfWeek: 'November 25, 2019',
        startOfWeekSortable: '20191125',
        term: 'Winter',
        trialLocation: 'Denver, CO',
        userIsAssignedToSession: true,
      },
      {
        caseOrder: [],
        formattedStartDate: '11/25/19',
        judge: { name: '5', userId: '5' },
        sessionStatus: SESSION_STATUS_GROUPS.new,
        startDate: '2019-11-25T15:00:00.000Z',
        startOfWeek: 'November 25, 2019',
        startOfWeekSortable: '20191125',
        term: 'Winter',
        trialLocation: 'Seattle, WA',
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
