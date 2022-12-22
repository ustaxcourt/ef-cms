import { docketClerkCreatesATrialSession } from './journey/docketClerkCreatesATrialSession';
import { docketClerkUpdatesCaseStatusFromCalendaredToSubmitted } from './journey/docketClerkUpdatesCaseStatusFromCalendaredToSubmitted';
import { docketClerkUpdatesCaseStatusToReadyForTrial } from './journey/docketClerkUpdatesCaseStatusToReadyForTrial';
import { docketClerkViewsEligibleCasesForTrialSession } from './journey/docketClerkViewsEligibleCasesForTrialSession';
import { docketClerkViewsInactiveCasesForTrialSession } from './journey/docketClerkViewsInactiveCasesForTrialSession';
import { docketClerkViewsTrialSessionList } from './journey/docketClerkViewsTrialSessionList';
import { loginAs, setupTest, uploadPetition } from './helpers';
import { markAllCasesAsQCed } from './journey/markAllCasesAsQCed';
import { petitionsClerkSetsATrialSessionsSchedule } from './journey/petitionsClerkSetsATrialSessionsSchedule';

const cerebralTest = setupTest();

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
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitioner@example.com');

  it('create a case', async () => {
    const caseDetail = await uploadPetition(cerebralTest, overrides);
    expect(caseDetail.docketNumber).toBeDefined();
    cerebralTest.docketNumber = caseDetail.docketNumber;
  });

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkUpdatesCaseStatusToReadyForTrial(cerebralTest);
  docketClerkCreatesATrialSession(cerebralTest, overrides);
  docketClerkViewsTrialSessionList(cerebralTest);
  docketClerkViewsEligibleCasesForTrialSession(cerebralTest);

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  markAllCasesAsQCed(cerebralTest, () => [cerebralTest.docketNumber]);
  petitionsClerkSetsATrialSessionsSchedule(cerebralTest);

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkUpdatesCaseStatusFromCalendaredToSubmitted(cerebralTest);
  docketClerkViewsInactiveCasesForTrialSession(cerebralTest);
  docketClerkUpdatesCaseStatusToReadyForTrial(cerebralTest);
});
