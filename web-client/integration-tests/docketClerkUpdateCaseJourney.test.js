import { docketClerkCreatesATrialSession } from './journey/docketClerkCreatesATrialSession';
import { docketClerkUpdatesCaseStatusFromCalendaredToSubmitted } from './journey/docketClerkUpdatesCaseStatusFromCalendaredToSubmitted';
import { docketClerkUpdatesCaseStatusToReadyForTrial } from './journey/docketClerkUpdatesCaseStatusToReadyForTrial';
import { docketClerkViewsEligibleCasesForTrialSession } from './journey/docketClerkViewsEligibleCasesForTrialSession';
import { docketClerkViewsInactiveCasesForTrialSession } from './journey/docketClerkViewsInactiveCasesForTrialSession';
import { docketClerkViewsTrialSessionList } from './journey/docketClerkViewsTrialSessionList';
import { loginAs, setupTest, uploadPetition } from './helpers';
import { markAllCasesAsQCed } from './journey/markAllCasesAsQCed';
import { petitionsClerkSetsATrialSessionsSchedule } from './journey/petitionsClerkSetsATrialSessionsSchedule';

const test = setupTest();

const trialLocation = `Boise, Idaho, ${Date.now()}`;

const overrides = {
  preferredTrialCity: trialLocation,
  trialLocation,
};

describe('docket clerk update case journey', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    test.closeSocket();
  });

  loginAs(test, 'petitioner@example.com');

  it('create a case', async () => {
    const caseDetail = await uploadPetition(test, overrides);
    expect(caseDetail.docketNumber).toBeDefined();
    test.caseId = caseDetail.caseId;
    test.docketNumber = caseDetail.docketNumber;
  });

  loginAs(test, 'docketclerk@example.com');
  docketClerkUpdatesCaseStatusToReadyForTrial(test);
  docketClerkCreatesATrialSession(test, overrides);
  docketClerkViewsTrialSessionList(test, overrides);
  docketClerkViewsEligibleCasesForTrialSession(test);

  loginAs(test, 'petitionsclerk@example.com');
  markAllCasesAsQCed(test, () => [test.caseId]);
  petitionsClerkSetsATrialSessionsSchedule(test);

  loginAs(test, 'docketclerk@example.com');
  docketClerkUpdatesCaseStatusFromCalendaredToSubmitted(test);
  docketClerkViewsInactiveCasesForTrialSession(test);
  docketClerkUpdatesCaseStatusToReadyForTrial(test);
});
