import { User } from '../../../../shared/src/business/entities/User';
import { applicationContext } from '../../applicationContext';
import {
  formatSession,
  formattedTrialSessions as formattedTrialSessionsComputed,
} from './formattedTrialSessions';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

const formattedTrialSessions = withAppContextDecorator(
  formattedTrialSessionsComputed,
);

const testJudgeUser = {
  role: User.ROLES.judge,
  userId: '1',
};

const baseState = {
  constants: { USER_ROLES: User.ROLES },
  judgeUser: testJudgeUser,
};

describe('formattedTrialSessions', () => {
  const TRIAL_SESSIONS_LIST = [
    {
      judge: { name: '1', userId: '1' },
      startDate: '2019-11-25T15:00:00.000Z',
      swingSession: true,
      trialLocation: 'Hartford, Connecticut',
    },
    {
      judge: { name: '2', userId: '2' },
      startDate: '2019-11-25T15:00:00.000Z',
      swingSession: true,
      trialLocation: 'Knoxville, TN',
    },
    {
      judge: { name: '3', userId: '3' },
      startDate: '2019-11-27T15:00:00.000Z',
      swingSession: true,
      trialLocation: 'Jacksonville, FL',
    },
    {
      judge: { name: '4', userId: '4' },
      startDate: '2019-11-27T15:00:00.000Z',
      swingSession: true,
      trialLocation: 'Memphis, TN',
    },
    {
      judge: { name: '5', userId: '5' },
      startDate: '2019-11-25T15:00:00.000Z',
      swingSession: false,
      trialLocation: 'Anchorage, AK',
    },
    {
      judge: { name: '6', userId: '6' },
      startDate: '2020-02-17T15:00:00.000Z',
      swingSession: false,
      trialLocation: 'Jacksonville, FL',
    },
  ];

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
    expect(result.formattedSessions.length).toBe(2);
    expect(result.formattedSessions[0].dateFormatted).toEqual(
      'November 25, 2019',
    );
    expect(result.formattedSessions[1].dateFormatted).toEqual(
      'February 17, 2020',
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

  it('shows swing session option only if matching term and term year is found', () => {
    const trialSessions = [
      {
        judge: { name: '1', userId: '1' },
        startDate: '2019-11-25T15:00:00.000Z',
        term: 'Fall',
        termYear: '2019',
        trialLocation: 'Denver, CO',
      },
      {
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
        judge: { name: '1', userId: '1' },
        startDate: '2019-11-25T15:00:00.000Z',
        term: 'Winter',
        trialLocation: 'Denver, CO',
      },
      {
        judge: { name: '2', userId: '2' },
        startDate: '2019-11-25T15:00:00.000Z',
        term: 'Spring',
        trialLocation: 'Jacksonville, FL',
      },
      {
        judge: { name: '3', userId: '3' },
        startDate: '2019-11-25T15:00:00.000Z',
        term: 'Fall',
        trialLocation: 'Houston, TX',
      },
      {
        judge: { name: '4', userId: '4' },
        startDate: '2019-11-25T15:00:00.000Z',
        term: 'Winter',
        trialLocation: 'Birmingham, AL',
      },
      {
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
        formattedStartDate: '11/25/19',
        judge: { name: '4', userId: '4' },
        startDate: '2019-11-25T15:00:00.000Z',
        startOfWeek: 'November 25, 2019',
        term: 'Winter',
        trialLocation: 'Birmingham, AL',
        userIsAssignedToSession: false,
      },
      {
        formattedStartDate: '11/25/19',
        judge: { name: '1', userId: '1' },
        startDate: '2019-11-25T15:00:00.000Z',
        startOfWeek: 'November 25, 2019',
        term: 'Winter',
        trialLocation: 'Denver, CO',
        userIsAssignedToSession: true,
      },
      {
        formattedStartDate: '11/25/19',
        judge: { name: '5', userId: '5' },
        startDate: '2019-11-25T15:00:00.000Z',
        startOfWeek: 'November 25, 2019',
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
        user: { role: User.ROLES.petitionsClerk, userId: '1' },
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
        dateFormatted: 'February 17, 2020',
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
        dateFormatted: 'February 17, 2020',
        sessions: [
          {
            judge: { name: '6', userId: '6' },
            userIsAssignedToSession: false,
          },
        ],
      },
    ]);
  });
});
