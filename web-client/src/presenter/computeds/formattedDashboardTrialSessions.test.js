import { applicationContext } from '../../applicationContext';
import {
  formatSession,
  formattedDashboardTrialSessions as formattedDashboardTrialSessionsComputed,
} from './formattedDashboardTrialSessions';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

const formattedDashboardTrialSessions = withAppContextDecorator(
  formattedDashboardTrialSessionsComputed,
);

describe('formattedDashboardTrialSessions', () => {
  const TRIAL_SESSIONS_LIST = [
    {
      judge: { name: '1', userId: '1' },
      startDate: '2085-11-25T15:00:00.000Z',
      swingSession: true,
      trialLocation: 'Hartford, Connecticut',
    },
    {
      judge: { name: '2', userId: '1' },
      startDate: '2017-11-25T15:00:00.000Z',
      swingSession: true,
      trialLocation: 'Knoxville, TN',
    },
    {
      judge: { name: '3', userId: '1' },
      startDate: '2017-11-27T15:00:00.000Z',
      swingSession: true,
      trialLocation: 'Jacksonville, FL',
    },
    {
      judge: { name: '4', userId: '1' },
      startDate: '2085-11-27T15:00:00.000Z',
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
    {
      judge: { name: '6', userId: '6' },
      startDate: '2020-02-17T15:00:00.000Z',
      swingSession: false,
      trialLocation: 'Jacksonville, FL',
    },
    {
      judge: { name: '6', userId: '6' },
      startDate: '2020-02-17T15:00:00.000Z',
      swingSession: false,
      trialLocation: 'Jacksonville, FL',
    },
    {
      judge: { name: '6', userId: '6' },
      startDate: '2020-02-17T15:00:00.000Z',
      swingSession: false,
      trialLocation: 'Jacksonville, FL',
    },
    {
      judge: { name: '6', userId: '6' },
      startDate: '2020-02-17T15:00:00.000Z',
      swingSession: false,
      trialLocation: 'Jacksonville, FL',
    },
    {
      judge: { name: '6', userId: '6' },
      startDate: '2020-02-17T15:00:00.000Z',
      swingSession: false,
      trialLocation: 'Jacksonville, FL',
    },
    {
      judge: { name: '6', userId: '6' },
      startDate: '2020-02-17T15:00:00.000Z',
      swingSession: false,
      trialLocation: 'Jacksonville, FL',
    },
    {
      judge: { name: '6', userId: '6' },
      startDate: '2020-02-17T15:00:00.000Z',
      swingSession: false,
      trialLocation: 'Jacksonville, FL',
    },
    {
      judge: { name: '6', userId: '6' },
      startDate: '2020-02-17T15:00:00.000Z',
      swingSession: false,
      trialLocation: 'Jacksonville, FL',
    },
    {
      judge: { name: '6', userId: '6' },
      startDate: '2020-02-17T15:00:00.000Z',
      swingSession: false,
      trialLocation: 'Jacksonville, FL',
    },
    {
      judge: { name: '6', userId: '6' },
      startDate: '2020-02-17T15:00:00.000Z',
      swingSession: false,
      trialLocation: 'Jacksonville, FL',
    },
  ];

  it('formats trial sessions correctly, formatting start date', () => {
    const result = formatSession(TRIAL_SESSIONS_LIST[2], applicationContext);
    expect(result).toMatchObject({
      formattedStartDate: '11/27/17',
      judge: { name: '3', userId: '1' },
      startDate: '2017-11-27T15:00:00.000Z',
    });
  });

  it('filter trial sessions by the logged in user', () => {
    const result = runCompute(formattedDashboardTrialSessions, {
      state: {
        trialSessions: TRIAL_SESSIONS_LIST,
        user: { userId: '1' },
      },
    });

    expect(result.formattedRecentSessions.length).toBe(2);
    expect(result.formattedUpcomingSessions.length).toBe(2);
  });

  it('returns no trial sessions if judge userId does not match any trial sessions', () => {
    const result = runCompute(formattedDashboardTrialSessions, {
      state: {
        trialSessions: TRIAL_SESSIONS_LIST,
        user: { userId: '100' },
      },
    });
    expect(result.formattedRecentSessions.length).toBe(0);
    expect(result.formattedUpcomingSessions.length).toBe(0);
  });

  it('returns no at most 5 trial sessions for judge userId', () => {
    const result = runCompute(formattedDashboardTrialSessions, {
      state: {
        trialSessions: TRIAL_SESSIONS_LIST,
        user: { userId: '6' },
      },
    });
    expect(result.formattedRecentSessions.length).toBe(0);
    expect(result.formattedUpcomingSessions.length).toBe(5);
  });
});
