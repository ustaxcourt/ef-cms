import { CASE_STATUS_TYPES, CHIEF_JUDGE } from '../EntityConstants';
import { Case } from './Case';
import { MOCK_CASE } from '../../../test/mockCase';
import { TrialSession } from '../trialSessions/TrialSession';
import { applicationContext } from '../../test/createTestApplicationContext';

describe('removeFromTrial', () => {
  it('removes the case from trial, unsetting trial details and setting status to general docket ready for trial', () => {
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
    const user = 'Petitions Clerk';

    caseToUpdate.setAsCalendared(trialSession);

    expect(caseToUpdate.status).toEqual(CASE_STATUS_TYPES.calendared);
    expect(caseToUpdate.trialDate).toBeTruthy();
    expect(caseToUpdate.associatedJudge).toEqual('Judge Buch');
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
    caseToUpdate.setAsCalendared(trialSession);

    expect(caseToUpdate.status).toEqual(CASE_STATUS_TYPES.calendared);
    expect(caseToUpdate.trialDate).toBeTruthy();
    expect(caseToUpdate.associatedJudge).toEqual('Judge Buch');
    expect(caseToUpdate.trialLocation).toBeTruthy();
    expect(caseToUpdate.trialSessionId).toBeTruthy();
    expect(caseToUpdate.trialTime).toBeTruthy();

    caseToUpdate.removeFromTrial({ updatedCaseStatus: CASE_STATUS_TYPES.cav });

    expect(caseToUpdate.status).toEqual(CASE_STATUS_TYPES.cav);
    expect(caseToUpdate.associatedJudge).toEqual('Chief Judge');
  });

  it('sets the case status along with the associated judge when provided', () => {
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
    caseToUpdate.setAsCalendared(trialSession);

    expect(caseToUpdate.status).toEqual(CASE_STATUS_TYPES.calendared);
    expect(caseToUpdate.trialDate).toBeTruthy();
    expect(caseToUpdate.associatedJudge).toEqual('Judge Buch');
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
