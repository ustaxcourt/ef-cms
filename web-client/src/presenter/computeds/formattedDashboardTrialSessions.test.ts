import {
  FORMATS,
  formatNow,
} from '../../../../shared/src/business/utilities/DateHandler';
import { applicationContext } from '../../applicationContext';
import {
  formatSession,
  formattedDashboardTrialSessions as formattedDashboardTrialSessionsComputed,
} from './formattedDashboardTrialSessions';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../withAppContext';

const formattedDashboardTrialSessions = withAppContextDecorator(
  formattedDashboardTrialSessionsComputed,
  applicationContext,
);

let nextYear;

let TRIAL_SESSIONS_LIST;

describe('formattedDashboardTrialSessions', () => {
  beforeEach(() => {
    nextYear = (parseInt(formatNow(FORMATS.YEAR)) + 1).toString();

    TRIAL_SESSIONS_LIST = [
      {
        isCalendared: true,
        judge: { name: '1', userId: '1' },
        sessionStatus: 'Open',
        startDate: '2017-11-25T15:00:00.000Z',
        swingSession: true,
        trialLocation: 'Hartford, Connecticut',
      },
      {
        isCalendared: true,
        judge: { name: '2', userId: '1' },
        sessionStatus: 'Open',
        startDate: `${nextYear}-02-17T15:00:00.000Z`,
        swingSession: true,
        trialLocation: 'Knoxville, TN',
      },
      {
        isCalendared: true,
        judge: { name: '3', userId: '1' },
        sessionStatus: 'Closed',
        startDate: '2017-11-27T15:00:00.000Z',
        swingSession: true,
        trialLocation: 'Jacksonville, FL',
      },
      {
        isCalendared: true,
        judge: { name: '3', userId: '1' },
        sessionStatus: 'New',
        startDate: '2017-11-27T15:00:00.000Z',
        swingSession: true,
        trialLocation: 'Jacksonville, FL',
      },
    ];
  });

  it('formats trial sessions correctly, formatting start date', () => {
    const result = formatSession(TRIAL_SESSIONS_LIST[2], applicationContext);
    expect(result).toMatchObject({
      formattedStartDate: '11/27/17',
      judge: { name: '3', userId: '1' },
      startDate: '2017-11-27T15:00:00.000Z',
    });
  });

  it('returns the expected recent and upcoming sessions', () => {
    applicationContext.getCurrentUser = () => ({
      userId: '6',
    });
    const result = runCompute(formattedDashboardTrialSessions, {
      state: {
        trialSessions: TRIAL_SESSIONS_LIST,
      },
    });
    expect(result.formattedRecentSessions.length).toBe(1);
    expect(result.formattedUpcomingSessions.length).toBe(1);
  });

  it('returns only open trial sessions', () => {
    applicationContext.getCurrentUser = () => ({
      userId: '6',
    });

    const trialSessions = [...TRIAL_SESSIONS_LIST];
    trialSessions.forEach(session => {
      session.isCalendared = false;
    });
    const result = runCompute(formattedDashboardTrialSessions, {
      state: {
        trialSessions,
      },
    });
    expect(result.formattedRecentSessions.length).toBe(1);
    expect(result.formattedUpcomingSessions.length).toBe(1);
  });
});
