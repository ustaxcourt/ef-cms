import { CASE_STATUS_TYPES, CHIEF_JUDGE } from '../EntityConstants';
import { Case } from './Case';
import { MOCK_CASE } from '../../../test/mockCase';
import { MOCK_TRIAL_STANDALONE_REMOTE } from '../../../test/mockTrial';
import { TrialSession } from '../trialSessions/TrialSession';
import { TrialSessionFactory } from '../trialSessions/TrialSessionFactory';
import { applicationContext } from '../../test/createTestApplicationContext';

describe('removeFromTrial', () => {
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

  it('removes the case from trial, unsetting trial details and setting status to general docket ready for trial', () => {
    const user = 'Petitions Clerk';

    caseToUpdate.setAsCalendared(mockTrialSession);

    expect(caseToUpdate.status).toEqual(CASE_STATUS_TYPES.calendared);
    expect(caseToUpdate.trialDate).toBeTruthy();
    expect(caseToUpdate.associatedJudge).toEqual(
      MOCK_TRIAL_STANDALONE_REMOTE.judge!.name,
    );
    expect(caseToUpdate.trialLocation).toBeTruthy();
    expect(caseToUpdate.trialSessionId).toBeTruthy();
    expect(caseToUpdate.trialTime).toBeTruthy();

    caseToUpdate.removeFromTrial({
      changedBy: user,
    });
    const indexOfLastCaseHistoryItem =
      caseToUpdate.caseStatusHistory.length - 1;

    expect(caseToUpdate.status).toEqual(
      CASE_STATUS_TYPES.generalDocketReadyForTrial,
    );
    expect(caseToUpdate.trialDate).toBeFalsy();
    expect(caseToUpdate.associatedJudge).toEqual(CHIEF_JUDGE);
    expect(caseToUpdate.trialLocation).toBeFalsy();
    expect(caseToUpdate.trialSessionId).toBeFalsy();
    expect(caseToUpdate.trialTime).toBeFalsy();
    expect(
      caseToUpdate.caseStatusHistory[indexOfLastCaseHistoryItem],
    ).toMatchObject({ changedBy: user });
  });

  it('sets the case status to the given case status when provided', () => {
    caseToUpdate.setAsCalendared(mockTrialSession);

    expect(caseToUpdate.status).toEqual(CASE_STATUS_TYPES.calendared);
    expect(caseToUpdate.trialDate).toBeTruthy();
    expect(caseToUpdate.associatedJudge).toEqual(mockTrialSession.judge!.name);
    expect(caseToUpdate.trialLocation).toBeTruthy();
    expect(caseToUpdate.trialSessionId).toBeTruthy();
    expect(caseToUpdate.trialTime).toBeTruthy();

    caseToUpdate.removeFromTrial({ updatedCaseStatus: CASE_STATUS_TYPES.cav });

    expect(caseToUpdate.status).toEqual(CASE_STATUS_TYPES.cav);
    expect(caseToUpdate.associatedJudge).toEqual('Chief Judge');
  });

  it('sets the case status along with the associated judge when provided', () => {
    caseToUpdate.setAsCalendared(mockTrialSession);

    expect(caseToUpdate.status).toEqual(CASE_STATUS_TYPES.calendared);
    expect(caseToUpdate.trialDate).toBeTruthy();
    expect(caseToUpdate.associatedJudge).toEqual(mockTrialSession.judge!.name);
    expect(caseToUpdate.trialLocation).toBeTruthy();
    expect(caseToUpdate.trialSessionId).toBeTruthy();
    expect(caseToUpdate.trialTime).toBeTruthy();

    caseToUpdate.removeFromTrial({
      associatedJudge: 'Judge Dredd',
      updatedCaseStatus: CASE_STATUS_TYPES.cav,
    });

    expect(caseToUpdate.status).toEqual(CASE_STATUS_TYPES.cav);
    expect(caseToUpdate.associatedJudge).toEqual('Judge Dredd');
  });
});
