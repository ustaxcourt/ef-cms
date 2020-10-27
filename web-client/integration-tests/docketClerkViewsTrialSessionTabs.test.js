import { docketClerkCreatesATrialSession } from './journey/docketClerkCreatesATrialSession';
import { docketClerkSetsCaseReadyForTrial } from './journey/docketClerkSetsCaseReadyForTrial';
import { docketClerkViewsTrialSessionList } from './journey/docketClerkViewsTrialSessionList';
import { docketClerkViewsTrialSessionsTab } from './journey/docketClerkViewsTrialSessionsTab';
import { loginAs, setupTest, uploadPetition } from './helpers';
import { markAllCasesAsQCed } from './journey/markAllCasesAsQCed';
import { petitionsClerkManuallyAddsCaseToTrial } from './journey/petitionsClerkManuallyAddsCaseToTrial';
import { petitionsClerkManuallyRemovesCaseFromTrial } from './journey/petitionsClerkManuallyRemovesCaseFromTrial';
import { petitionsClerkSetsATrialSessionsSchedule } from './journey/petitionsClerkSetsATrialSessionsSchedule';
import { petitionsClerkSubmitsCaseToIrs } from './journey/petitionsClerkSubmitsCaseToIrs';
import { petitionsClerkViewsATrialSessionsEligibleCases } from './journey/petitionsClerkViewsATrialSessionsEligibleCases';

const test = setupTest();

describe('Docket Clerk Views Trial Session Tabs', () => {
  beforeEach(() => {
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

  const createdDocketNumbers = [];

  const makeCaseReadyForTrial = (testSession, id, caseOverrides) => {
    loginAs(testSession, 'petitioner@example.com');
    it(`Create case ${id}`, async () => {
      const caseDetail = await uploadPetition(testSession, caseOverrides);
      expect(caseDetail.docketNumber).toBeDefined();
      createdDocketNumbers.push(caseDetail.docketNumber);
      testSession.docketNumber = caseDetail.docketNumber;
    });

    loginAs(test, 'petitionsclerk@example.com');
    petitionsClerkSubmitsCaseToIrs(test);

    loginAs(test, 'docketclerk@example.com');
    docketClerkSetsCaseReadyForTrial(test);
  };

  loginAs(test, 'docketclerk@example.com');
  docketClerkCreatesATrialSession(test, overrides);
  docketClerkViewsTrialSessionList(test, overrides);
  // Trial Session should exist in New tab
  docketClerkViewsTrialSessionsTab(test, { tab: 'New' });

  for (let i = 0; i < caseCount; i++) {
    const id = i + 1;
    makeCaseReadyForTrial(test, id, overrides);
  }

  loginAs(test, 'petitionsclerk@example.com');
  petitionsClerkViewsATrialSessionsEligibleCases(test, caseCount);

  petitionsClerkManuallyAddsCaseToTrial(test);
  // only mark cases 0 and 1 as QCed
  markAllCasesAsQCed(test, () => {
    return [createdDocketNumbers[1]];
  });
  petitionsClerkSetsATrialSessionsSchedule(test);

  loginAs(test, 'docketclerk@example.com');
  // Trial Session should exist in Open tab
  docketClerkViewsTrialSessionsTab(test, { tab: 'Open' });

  loginAs(test, 'petitionsclerk@example.com');
  petitionsClerkManuallyRemovesCaseFromTrial(test);

  loginAs(test, 'docketclerk@example.com');
  // Trial Session should exist in Closed tab
  docketClerkViewsTrialSessionsTab(test, { tab: 'Closed' });
  // Trial Session should exist in All tab
  docketClerkViewsTrialSessionsTab(test, { tab: 'All' });
});
