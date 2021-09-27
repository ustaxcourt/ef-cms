import {
  FORMATS,
  formatNow,
} from '../../../../shared/src/business/utilities/DateHandler';
import { applicationContext } from '../../applicationContext';
import { filterFormattedSessionsByStatus } from './formattedTrialSessions';

let nextYear;

describe('formattedTrialSessions filterFormattedSessionsByStatus', () => {
  beforeAll(() => {
    nextYear = (parseInt(formatNow(FORMATS.YEAR)) + 1).toString();
  });

  let TRIAL_SESSIONS_LIST = [];
  let trialTerms;

  beforeEach(() => {
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
