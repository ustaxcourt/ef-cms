import { CASE_STATUS_TYPES } from '../EntityConstants';
import { Case } from './Case';
import { MOCK_CASE } from '../../../test/mockCase';
import { TrialSession } from '../trialSessions/TrialSession';
import { applicationContext } from '../../test/createTestApplicationContext';

describe('removeFromTrialWithAssociatedJudge', () => {
  it('removes the case from trial, updating the associated judge if one is passed in', () => {
    const caseToUpdate = new Case(
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
        judge: { name: 'Judge Buch', userId: 'buch_id' },
        maxCases: 100,
        sessionType: 'Regular',
        startDate: '2025-03-01T00:00:00.000Z',
        term: 'Fall',
        termYear: '2025',
        trialLocation: 'Birmingham, Alabama',
      },
      { applicationContext },
    );
    caseToUpdate.setAsCalendared(trialSession);

    expect(caseToUpdate.status).toEqual(CASE_STATUS_TYPES.calendared);
    expect(caseToUpdate.trialDate).toBeTruthy();
    expect(caseToUpdate.associatedJudge).toEqual('Judge Buch');
    expect(caseToUpdate.associatedJudgeId).toEqual('buch_id');
    expect(caseToUpdate.trialLocation).toBeTruthy();
    expect(caseToUpdate.trialSessionId).toBeTruthy();
    expect(caseToUpdate.trialTime).toBeTruthy();

    caseToUpdate.removeFromTrialWithAssociatedJudge({
      associatedJudge: 'Judge Colvin',
      associatedJudgeId: 'colvin_id',
    });

    expect(caseToUpdate.associatedJudge).toEqual('Judge Colvin');
    expect(caseToUpdate.associatedJudgeId).toEqual('colvin_id');
    expect(caseToUpdate.trialDate).toBeFalsy();
    expect(caseToUpdate.trialLocation).toBeFalsy();
    expect(caseToUpdate.trialSessionId).toBeFalsy();
    expect(caseToUpdate.trialTime).toBeFalsy();
  });

  it('removes the case from trial, leaving the associated judge unchanged if one is not passed in', () => {
    const caseToUpdate = new Case(
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
        judge: { name: 'Judge Buch', userId: 'buch-id' },
        maxCases: 100,
        sessionType: 'Regular',
        startDate: '2025-03-01T00:00:00.000Z',
        term: 'Fall',
        termYear: '2025',
        trialLocation: 'Birmingham, Alabama',
      },
      { applicationContext },
    );
    caseToUpdate.setAsCalendared(trialSession);

    expect(caseToUpdate.status).toEqual(CASE_STATUS_TYPES.calendared);
    expect(caseToUpdate.trialDate).toBeTruthy();
    expect(caseToUpdate.associatedJudge).toEqual('Judge Buch');
    expect(caseToUpdate.associatedJudgeId).toEqual('buch-id');
    expect(caseToUpdate.trialLocation).toBeTruthy();
    expect(caseToUpdate.trialSessionId).toBeTruthy();
    expect(caseToUpdate.trialTime).toBeTruthy();

    caseToUpdate.removeFromTrialWithAssociatedJudge();

    expect(caseToUpdate.associatedJudge).toEqual('Judge Buch');
    expect(caseToUpdate.associatedJudgeId).toEqual('buch-id');
    expect(caseToUpdate.trialDate).toBeFalsy();
    expect(caseToUpdate.trialLocation).toBeFalsy();
    expect(caseToUpdate.trialSessionId).toBeFalsy();
    expect(caseToUpdate.trialTime).toBeFalsy();
  });
});
