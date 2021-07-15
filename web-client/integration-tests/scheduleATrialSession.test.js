import { docketClerkCreatesATrialSession } from './journey/docketClerkCreatesATrialSession';
import { docketClerkSetsCaseReadyForTrial } from './journey/docketClerkSetsCaseReadyForTrial';
import { docketClerkViewsNewTrialSession } from './journey/docketClerkViewsNewTrialSession';
import { docketClerkViewsTrialSessionList } from './journey/docketClerkViewsTrialSessionList';
import { loginAs, setupTest, uploadPetition } from './helpers';
import { markAllCasesAsQCed } from './journey/markAllCasesAsQCed';
import { petitionsClerkManuallyAddsCaseToTrial } from './journey/petitionsClerkManuallyAddsCaseToTrial';
import { petitionsClerkManuallyAddsCaseToTrialWithoutJudge } from './journey/petitionsClerkManuallyAddsCaseToTrialWithoutJudge';
import { petitionsClerkManuallyRemovesCaseFromTrial } from './journey/petitionsClerkManuallyRemovesCaseFromTrial';
import { petitionsClerkSetsATrialSessionsSchedule } from './journey/petitionsClerkSetsATrialSessionsSchedule';
import { petitionsClerkSubmitsCaseToIrs } from './journey/petitionsClerkSubmitsCaseToIrs';
import { petitionsClerkViewsACalendaredTrialSession } from './journey/petitionsClerkViewsACalendaredTrialSession';
import { petitionsClerkViewsATrialSessionsEligibleCases } from './journey/petitionsClerkViewsATrialSessionsEligibleCases';
import { petitionsClerkViewsATrialSessionsEligibleCasesWithManuallyAddedCase } from './journey/petitionsClerkViewsATrialSessionsEligibleCasesWithManuallyAddedCase';

const cerebralTest = setupTest();

describe('Schedule A Trial Session', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  const caseCount = 2;
  const trialLocation = `Albuquerque, New Mexico, ${Date.now()}`;
  const trialLocation2 = `Boise, Idaho, ${Date.now()}`;
  const overrides = {
    preferredTrialCity: trialLocation,
    trialLocation,
  };
  const overrides2 = {
    judge: {},
    preferredTrialCity: trialLocation2,
    trialLocation: trialLocation2,
  };

  cerebralTest.casesReadyForTrial = [];

  const createdDocketNumbers = [];

  const makeCaseReadyForTrial = (testSession, id, caseOverrides) => {
    loginAs(testSession, 'petitioner@example.com');
    it(`Create case ${id}`, async () => {
      const caseDetail = await uploadPetition(testSession, caseOverrides);
      expect(caseDetail.docketNumber).toBeDefined();
      createdDocketNumbers.push(caseDetail.docketNumber);
      testSession.docketNumber = caseDetail.docketNumber;
    });

    loginAs(cerebralTest, 'petitionsclerk@example.com');
    petitionsClerkSubmitsCaseToIrs(cerebralTest);

    loginAs(cerebralTest, 'docketclerk@example.com');
    docketClerkSetsCaseReadyForTrial(cerebralTest);
  };

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkCreatesATrialSession(cerebralTest, overrides);
  docketClerkViewsTrialSessionList(cerebralTest);
  docketClerkViewsNewTrialSession(cerebralTest);

  for (let i = 0; i < caseCount; i++) {
    const id = i + 1;
    makeCaseReadyForTrial(cerebralTest, id, overrides);
  }

  // Add case with a different city
  makeCaseReadyForTrial(cerebralTest, caseCount + 1, {});

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkViewsATrialSessionsEligibleCases(cerebralTest, caseCount);

  petitionsClerkManuallyAddsCaseToTrial(cerebralTest);
  petitionsClerkViewsATrialSessionsEligibleCasesWithManuallyAddedCase(
    cerebralTest,
    caseCount + 1,
  );
  petitionsClerkManuallyRemovesCaseFromTrial(cerebralTest);
  petitionsClerkViewsATrialSessionsEligibleCases(cerebralTest, caseCount);
  petitionsClerkManuallyAddsCaseToTrial(cerebralTest);

  // only mark cases 0 and 1 as QCed
  markAllCasesAsQCed(cerebralTest, () => {
    return [createdDocketNumbers[0], createdDocketNumbers[1]];
  });

  petitionsClerkSetsATrialSessionsSchedule(cerebralTest);
  // only 2 cases should have been calendared because only 2 were marked as QCed
  petitionsClerkViewsACalendaredTrialSession(cerebralTest, caseCount);

  // create a trial session without a judge
  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkCreatesATrialSession(cerebralTest, overrides2);
  docketClerkViewsTrialSessionList(cerebralTest);

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  makeCaseReadyForTrial(cerebralTest, caseCount + 2, overrides2);
  petitionsClerkManuallyAddsCaseToTrialWithoutJudge(cerebralTest);
});
