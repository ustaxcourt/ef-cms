const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { Case } = require('./Case');
const { CASE_STATUS_TYPES, CHIEF_JUDGE } = require('../EntityConstants');
const { MOCK_CASE } = require('../../../test/mockCase');
const { TrialSession } = require('../trialSessions/TrialSession');

describe('updateTrialSessionInformation', () => {
  it('should not change the status of the case', () => {
    const myCase = new Case(
      { ...MOCK_CASE, status: CASE_STATUS_TYPES.closed },
      {
        applicationContext,
      },
    );
    myCase.updateTrialSessionInformation({
      isCalendared: false,
      judge: {
        name: 'Judge Judy',
      },
      trialSessionId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });
    expect(myCase.status).toBe(CASE_STATUS_TYPES.closed);
  });

  it('should set only judge and trialSessionId if the trial session is calendared', () => {
    const myCase = new Case(MOCK_CASE, {
      applicationContext,
    });
    myCase.updateTrialSessionInformation({
      isCalendared: false,
      judge: {
        name: 'Judge Judy',
      },
      trialSessionId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });
    expect(myCase.trialSessionId).toBeTruthy();
  });

  it('should set all trial session fields if the trial session is calendared', () => {
    const myCase = new Case(
      {
        ...MOCK_CASE,
      },
      {
        applicationContext,
      },
    );
    const trialSession = new TrialSession(
      {
        isCalendared: true,
        judge: { name: 'Judge Buch' },
        maxCases: 100,
        sessionType: 'Regular',
        startDate: '2025-03-01T00:00:00.000Z',
        term: 'Fall',
        termYear: '2025',
        trialLocation: 'Birmingham, Alabama',
      },
      { applicationContext },
    );
    myCase.updateTrialSessionInformation(trialSession);

    expect(myCase.trialDate).toBeTruthy();
    expect(myCase.associatedJudge).toBeTruthy();
    expect(myCase.trialLocation).toBeTruthy();
    expect(myCase.trialSessionId).toBeTruthy();
    expect(myCase.trialTime).toBeTruthy();
  });

  it('should set all trial session fields but not set the associated judge if the trial session is not calendared', () => {
    const myCase = new Case(
      {
        ...MOCK_CASE,
      },
      {
        applicationContext,
      },
    );
    const trialSession = new TrialSession(
      {
        isCalendared: false,
        judge: { name: 'Judge Buch' },
        maxCases: 100,
        sessionType: 'Regular',
        startDate: '2025-03-01T00:00:00.000Z',
        term: 'Fall',
        termYear: '2025',
        trialLocation: 'Birmingham, Alabama',
      },
      { applicationContext },
    );
    myCase.setAsCalendared(trialSession);

    expect(myCase.status).toEqual(CASE_STATUS_TYPES.new);
    expect(myCase.trialDate).toBeTruthy();
    expect(myCase.associatedJudge).toEqual(CHIEF_JUDGE);
    expect(myCase.trialLocation).toBeTruthy();
    expect(myCase.trialSessionId).toBeTruthy();
    expect(myCase.trialTime).toBeTruthy();
  });
});
