import { filterFormattedSessionsByStatus } from './formattedTrialSessions';

describe('formattedTrialSessions filterFormattedSessionsByStatus', () => {
  let TRIAL_SESSIONS_LIST = [];
  let trialTerms;

  beforeEach(() => {
    TRIAL_SESSIONS_LIST = [
      {
        caseOrder: [],
        judge: { name: '1', userId: '1' },
        sessionStatus: 'Open',
        startDate: '2019-11-25T15:00:00.000Z',
        swingSession: true,
        trialLocation: 'Hartford, Connecticut',
      },
      {
        caseOrder: [],
        judge: { name: '2', userId: '2' },
        sessionStatus: 'New',
        startDate: '2019-11-25T15:00:00.000Z',
        swingSession: true,
        trialClerk: { name: '10', userId: '10' },
        trialLocation: 'Knoxville, TN',
      },
      {
        caseOrder: [],
        judge: { name: '3', userId: '3' },
        noticeIssuedDate: '2019-07-25T15:00:00.000Z',
        sessionStatus: 'Closed',
        startDate: '2019-11-27T15:00:00.000Z',
        swingSession: true,
        trialLocation: 'Jacksonville, FL',
      },
    ];

    trialTerms = [
      {
        dateFormatted: 'October 1, 2022',
        sessions: [TRIAL_SESSIONS_LIST[0]],
      },
      {
        dateFormatted: 'November 1, 2022',
        sessions: [TRIAL_SESSIONS_LIST[1]],
      },
      {
        dateFormatted: 'December 1, 2022',
        sessions: [TRIAL_SESSIONS_LIST[2]],
      },
    ];
  });

  it('filters closed cases when all trial session cases are inactive', () => {
    const results = filterFormattedSessionsByStatus(trialTerms);
    expect(results.Closed.length).toEqual(1);
  });

  it('filters open trial sessions', () => {
    const results = filterFormattedSessionsByStatus(trialTerms);
    expect(results.Open.length).toEqual(1);
  });

  it('filters new trial sessions', () => {
    const results = filterFormattedSessionsByStatus(trialTerms);
    expect(results.New.length).toEqual(1);
  });

  it('filters all trial sessions (returns everything) with the sessionStatus on the session', () => {
    const results = filterFormattedSessionsByStatus(trialTerms);

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
