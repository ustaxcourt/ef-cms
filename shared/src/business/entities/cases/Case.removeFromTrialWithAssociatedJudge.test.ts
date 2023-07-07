import { CASE_STATUS_TYPES } from '../EntityConstants';
import { Case } from './Case';
import { MOCK_CASE } from '../../../test/mockCase';
import { MOCK_TRIAL_STANDALONE_REMOTE } from '../../../test/mockTrial';
import { TrialSession } from '../trialSessions/TrialSession';
import { TrialSessionFactory } from '../trialSessions/TrialSessionFactory';
import { applicationContext } from '../../test/createTestApplicationContext';

describe('removeFromTrialWithAssociatedJudge', () => {
  let caseToUpdate: Case;
  let mockTrialSession: TrialSession;

  beforeEach(() => {
    caseToUpdate = new Case(
      {
        ...MOCK_CASE,
      },
      {
        applicationContext,
      },
    );

    mockTrialSession = TrialSessionFactory(
      MOCK_TRIAL_STANDALONE_REMOTE,
      applicationContext,
    );
  });

  it('removes the case from trial, updating the associated judge if one is passed in', () => {
    caseToUpdate.setAsCalendared(mockTrialSession);

    expect(caseToUpdate.status).toEqual(CASE_STATUS_TYPES.calendared);
    expect(caseToUpdate.trialDate).toBeTruthy();
    expect(caseToUpdate.associatedJudge).toEqual(mockTrialSession.judge!.name);
    expect(caseToUpdate.trialLocation).toBeTruthy();
    expect(caseToUpdate.trialSessionId).toBeTruthy();
    expect(caseToUpdate.trialTime).toBeTruthy();

    caseToUpdate.removeFromTrialWithAssociatedJudge('Judge Colvin');

    expect(caseToUpdate.associatedJudge).toEqual('Judge Colvin');
    expect(caseToUpdate.trialDate).toBeFalsy();
    expect(caseToUpdate.trialLocation).toBeFalsy();
    expect(caseToUpdate.trialSessionId).toBeFalsy();
    expect(caseToUpdate.trialTime).toBeFalsy();
  });

  it('removes the case from trial, leaving the associated judge unchanged if one is not passed in', () => {
    caseToUpdate.setAsCalendared(mockTrialSession);

    expect(caseToUpdate.status).toEqual(CASE_STATUS_TYPES.calendared);
    expect(caseToUpdate.trialDate).toBeTruthy();
    expect(caseToUpdate.associatedJudge).toEqual(mockTrialSession.judge!.name);
    expect(caseToUpdate.trialLocation).toBeTruthy();
    expect(caseToUpdate.trialSessionId).toBeTruthy();
    expect(caseToUpdate.trialTime).toBeTruthy();

    caseToUpdate.removeFromTrialWithAssociatedJudge();

    expect(caseToUpdate.associatedJudge).toEqual(mockTrialSession.judge!.name);
    expect(caseToUpdate.trialDate).toBeFalsy();
    expect(caseToUpdate.trialLocation).toBeFalsy();
    expect(caseToUpdate.trialSessionId).toBeFalsy();
    expect(caseToUpdate.trialTime).toBeFalsy();
  });
});
