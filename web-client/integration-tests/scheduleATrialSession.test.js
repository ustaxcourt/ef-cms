import { captureCreatedCase } from './journey/captureCreatedCase';
import { docketClerkCreatesATrialSession } from './journey/docketClerkCreatesATrialSession';
import { docketClerkSetsCaseReadyForTrial } from './journey/docketClerkSetsCaseReadyForTrial';
import { docketClerkViewsNewTrialSession } from './journey/docketClerkViewsNewTrialSession';
import { docketClerkViewsTrialSessionList } from './journey/docketClerkViewsTrialSessionList';
import { loginAs, setupTest, uploadPetition } from './helpers';
import { markAllCasesAsQCed } from './journey/markAllCasesAsQCed';
import { petitionerViewsDashboard } from './journey/petitionerViewsDashboard';
import petitionsClerkManuallyAddsCaseToTrial from './journey/petitionsClerkManuallyAddsCaseToTrial';
import petitionsClerkManuallyRemovesCaseFromTrial from './journey/petitionsClerkManuallyRemovesCaseFromTrial';
import petitionsClerkSetsATrialSessionsSchedule from './journey/petitionsClerkSetsATrialSessionsSchedule';
import petitionsClerkSubmitsCaseToIrs from './journey/petitionsClerkSubmitsCaseToIrs';
import petitionsClerkViewsACalendaredTrialSession from './journey/petitionsClerkViewsACalendaredTrialSession';
import petitionsClerkViewsATrialSessionsEligibleCases from './journey/petitionsClerkViewsATrialSessionsEligibleCases';
import petitionsClerkViewsATrialSessionsEligibleCasesWithManuallyAddedCase from './journey/petitionsClerkViewsATrialSessionsEligibleCasesWithManuallyAddedCase';

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

  const createdCases = [];
  const createdDocketNumbers = [];

  const makeCaseReadyForTrial = (test, id, caseOverrides) => {
    loginAs(test, 'petitioner');
    it(`Create case ${id}`, async () => {
      await uploadPetition(test, caseOverrides);
    });
    petitionerViewsDashboard(test);
    captureCreatedCase(test, createdCases, createdDocketNumbers);

    loginAs(test, 'petitionsclerk');
    petitionsClerkSubmitsCaseToIrs(test);

    loginAs(test, 'docketclerk');
    docketClerkSetsCaseReadyForTrial(test);
  };

  loginAs(test, 'docketclerk');
  docketClerkCreatesATrialSession(test, overrides);
  docketClerkViewsTrialSessionList(test, overrides);
  docketClerkViewsNewTrialSession(test);

  for (let i = 0; i < caseCount; i++) {
    const id = i + 1;
    makeCaseReadyForTrial(test, id, overrides);
  }

  // Add case with a different city
  makeCaseReadyForTrial(test, caseCount + 1, {});

  loginAs(test, 'petitionsclerk');
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
    return [createdCases[0], createdCases[1]];
  });

  petitionsClerkSetsATrialSessionsSchedule(test);
  // only 2 cases should have been calendared because only 2 were marked as QCed
  petitionsClerkViewsACalendaredTrialSession(test, caseCount);
});
