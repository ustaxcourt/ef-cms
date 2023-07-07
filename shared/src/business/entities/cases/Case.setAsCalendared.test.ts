import { CASE_STATUS_TYPES, CHIEF_JUDGE } from '../EntityConstants';
import { Case } from './Case';
import { MOCK_CASE } from '../../../test/mockCase';
import { MOCK_TRIAL_STANDALONE_REMOTE } from '../../../test/mockTrial';
import { TrialSession } from '../trialSessions/TrialSession';
import { TrialSessionFactory } from '../trialSessions/TrialSessionFactory';
import { applicationContext } from '../../test/createTestApplicationContext';

describe('setAsCalendared', () => {
  let myCase: Case;
  let mockTrialSession: TrialSession;

  beforeEach(() => {
    myCase = new Case(MOCK_CASE, {
      applicationContext,
    });

    mockTrialSession = TrialSessionFactory(
      MOCK_TRIAL_STANDALONE_REMOTE,
      applicationContext,
    );
  });

  it('should set case as calendared with only judge and trialSessionId if the trial session is calendared', () => {
    myCase.setAsCalendared({
      isCalendared: true,
      judge: {
        name: 'Judge Judy',
      },
      trialSessionId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });
    expect(myCase.trialSessionId).toBeTruthy();
    expect(myCase.status).toEqual(CASE_STATUS_TYPES.calendared);
    expect(myCase.trialDate).toBeUndefined();
    expect(myCase.trialLocation).toBeUndefined();
    expect(myCase.trialTime).toBeUndefined();
  });

  it('should set case as calendared with all trial session fields if the trial session is calendared', () => {
    mockTrialSession.isCalendared = true;
    myCase.setAsCalendared(mockTrialSession);

    expect(myCase.status).toEqual(CASE_STATUS_TYPES.calendared);
    expect(myCase.associatedJudge).toBeTruthy();
    expect(myCase.trialDate).toBeTruthy();
    expect(myCase.trialLocation).toBeTruthy();
    expect(myCase.trialSessionId).toBeTruthy();
    expect(myCase.trialTime).toBeTruthy();
  });

  it('should set all trial session fields but not set the case as calendared or associated judge if the trial session is not calendared', () => {
    mockTrialSession.isCalendared = false;
    myCase.setAsCalendared(mockTrialSession);

    expect(myCase.status).toEqual(CASE_STATUS_TYPES.new);
    expect(myCase.trialDate).toBeTruthy();
    expect(myCase.associatedJudge).toEqual(CHIEF_JUDGE);
    expect(myCase.trialLocation).toBeTruthy();
    expect(myCase.trialSessionId).toBeTruthy();
    expect(myCase.trialTime).toBeTruthy();
  });
});
