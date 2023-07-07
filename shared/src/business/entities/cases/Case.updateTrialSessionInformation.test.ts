import { CASE_STATUS_TYPES, CHIEF_JUDGE } from '../EntityConstants';
import { Case } from './Case';
import { MOCK_CASE } from '../../../test/mockCase';
import { MOCK_TRIAL_INPERSON } from '../../../test/mockTrial';
import { TrialSessionFactory } from '../trialSessions/TrialSessionFactory';
import { applicationContext } from '../../test/createTestApplicationContext';

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

  it('should set all trial session fields when the trial session is calendared', () => {
    const myCase = new Case(MOCK_CASE, {
      applicationContext,
    });
    const trialSession = TrialSessionFactory(
      { ...MOCK_TRIAL_INPERSON, isCalendared: true },
      applicationContext,
    );

    myCase.updateTrialSessionInformation(trialSession);

    expect(myCase.trialDate).toBeTruthy();
    expect(myCase.associatedJudge).toBeTruthy();
    expect(myCase.trialLocation).toBeTruthy();
    expect(myCase.trialSessionId).toBeTruthy();
    expect(myCase.trialTime).toBeTruthy();
  });

  it('should set all trial session fields but not set the associated judge if the trial session is not calendared', () => {
    const myCase = new Case(MOCK_CASE, {
      applicationContext,
    });
    const trialSession = TrialSessionFactory(
      { ...MOCK_TRIAL_INPERSON, isCalendared: false },
      applicationContext,
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
