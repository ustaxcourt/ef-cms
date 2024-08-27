import { CASE_STATUS_TYPES, CHIEF_JUDGE } from '../EntityConstants';
import { Case } from './Case';
import { MOCK_CASE } from '../../../test/mockCase';
import { TrialSession } from '../trialSessions/TrialSession';
import { mockDocketClerkUser } from '@shared/test/mockAuthUsers';

describe('updateTrialSessionInformation', () => {
  it('should not change the status of the case', () => {
    const myCase = new Case(
      { ...MOCK_CASE, status: CASE_STATUS_TYPES.closed },
      {
        authorizedUser: mockDocketClerkUser,
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
      authorizedUser: mockDocketClerkUser,
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
        authorizedUser: mockDocketClerkUser,
      },
    );
    const trialSession = new TrialSession({
      isCalendared: true,
      judge: { name: 'Judge Buch', userId: 'buch_id' },
      maxCases: 100,
      sessionType: 'Regular',
      startDate: '2025-03-01T00:00:00.000Z',
      term: 'Fall',
      termYear: '2025',
      trialLocation: 'Birmingham, Alabama',
    });
    myCase.updateTrialSessionInformation(trialSession);

    expect(myCase.trialDate).toBeTruthy();
    expect(myCase.associatedJudge).toEqual('Judge Buch');
    expect(myCase.associatedJudgeId).toEqual('buch_id');
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
        authorizedUser: mockDocketClerkUser,
      },
    );
    const trialSession = new TrialSession({
      isCalendared: false,
      judge: { name: 'Judge Buch' },
      maxCases: 100,
      sessionType: 'Regular',
      startDate: '2025-03-01T00:00:00.000Z',
      term: 'Fall',
      termYear: '2025',
      trialLocation: 'Birmingham, Alabama',
    });
    myCase.setAsCalendared(trialSession);

    expect(myCase.status).toEqual(CASE_STATUS_TYPES.new);
    expect(myCase.trialDate).toBeTruthy();
    expect(myCase.associatedJudge).toEqual(CHIEF_JUDGE);
    expect(myCase.associatedJudgeId).toEqual(undefined);
    expect(myCase.trialLocation).toBeTruthy();
    expect(myCase.trialSessionId).toBeTruthy();
    expect(myCase.trialTime).toBeTruthy();
  });
});
