import { docketClerkCreatesATrialSession } from './journey/docketClerkCreatesATrialSession';
import { docketClerkSetsCaseReadyForTrial } from './journey/docketClerkSetsCaseReadyForTrial';
import { docketClerkViewsNewTrialSession } from './journey/docketClerkViewsNewTrialSession';
import { docketClerkViewsTrialSessionList } from './journey/docketClerkViewsTrialSessionList';
import { loginAs, setupTest, uploadPetition } from './helpers';
import { markAllCasesAsQCed } from './journey/markAllCasesAsQCed';
import { petitionsClerkManuallyAddsCaseToTrial } from './journey/petitionsClerkManuallyAddsCaseToTrial';
import { petitionsClerkManuallyRemovesCaseFromTrial } from './journey/petitionsClerkManuallyRemovesCaseFromTrial';
import { petitionsClerkSetsATrialSessionsSchedule } from './journey/petitionsClerkSetsATrialSessionsSchedule';
import { petitionsClerkSubmitsCaseToIrs } from './journey/petitionsClerkSubmitsCaseToIrs';
import { petitionsClerkViewsACalendaredTrialSession } from './journey/petitionsClerkViewsACalendaredTrialSession';
import { petitionsClerkViewsATrialSessionsEligibleCases } from './journey/petitionsClerkViewsATrialSessionsEligibleCases';
import { petitionsClerkViewsATrialSessionsEligibleCasesWithManuallyAddedCase } from './journey/petitionsClerkViewsATrialSessionsEligibleCasesWithManuallyAddedCase';

const test = setupTest();

describe('Schedule A Trial Session', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    test.closeSocket();
  });

  const caseCount = 2;
  const trialLocation = `Albuquerque, New Mexico, ${Date.now()}`;
  const overrides = {
    preferredTrialCity: trialLocation,
    trialLocation,
  };

  test.casesReadyForTrial = [];

  const createdCaseIds = [];
  const createdDocketNumbers = [];

  const makeCaseReadyForTrial = (test, id, caseOverrides) => {
    loginAs(test, 'petitioner@example.com');
    it(`Create case ${id}`, async () => {
      const caseDetail = await uploadPetition(test, caseOverrides);
      expect(caseDetail.docketNumber).toBeDefined();
      createdCaseIds.push(caseDetail.caseId);
      createdDocketNumbers.push(caseDetail.docketNumber);
      test.docketNumber = caseDetail.docketNumber;
    });

    loginAs(test, 'petitionsclerk@example.com');
    petitionsClerkSubmitsCaseToIrs(test);

    loginAs(test, 'docketclerk@example.com');
    docketClerkSetsCaseReadyForTrial(test);
  };

  loginAs(test, 'docketclerk@example.com');
  docketClerkCreatesATrialSession(test, overrides);
  docketClerkViewsTrialSessionList(test, overrides);
  docketClerkViewsNewTrialSession(test);

  for (let i = 0; i < caseCount; i++) {
    const id = i + 1;
    makeCaseReadyForTrial(test, id, overrides);
  }

  // Add case with a different city
  makeCaseReadyForTrial(test, caseCount + 1, {});

  loginAs(test, 'petitionsclerk@example.com');
  petitionsClerkViewsATrialSessionsEligibleCases(test, caseCount);

  petitionsClerkManuallyAddsCaseToTrial(test);
  petitionsClerkViewsATrialSessionsEligibleCasesWithManuallyAddedCase(
    test,
    caseCount + 1,
  );
  petitionsClerkManuallyRemovesCaseFromTrial(test);
  petitionsClerkViewsATrialSessionsEligibleCases(test, caseCount);
  petitionsClerkManuallyAddsCaseToTrial(test);

  // only mark cases 0 and 1 as QCed
  markAllCasesAsQCed(test, () => {
    return [createdCaseIds[0], createdCaseIds[1]];
  });

  petitionsClerkSetsATrialSessionsSchedule(test);
  // only 2 cases should have been calendared because only 2 were marked as QCed
  petitionsClerkViewsACalendaredTrialSession(test, caseCount);
});
