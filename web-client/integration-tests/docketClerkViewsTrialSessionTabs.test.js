import { setupTest } from './helpers';
import { uploadPetition } from './helpers';
import calendarClerkLogIn from './journey/calendarClerkLogIn';
import calendarClerkSetsATrialSessionsSchedule from './journey/calendarClerkSetsATrialSessionsSchedule';
import captureCreatedCase from './journey/captureCreatedCase';
import docketClerkCreatesATrialSession from './journey/docketClerkCreatesATrialSession';
import docketClerkLogIn from './journey/docketClerkLogIn';
import docketClerkSetsCaseReadyForTrial from './journey/docketClerkSetsCaseReadyForTrial';
import docketClerkViewsTrialSessionList from './journey/docketClerkViewsTrialSessionList';
import docketClerkViewsTrialSessionsTab from './journey/docketClerkViewsTrialSessionsTab';
import markAllCasesAsQCed from './journey/markAllCasesAsQCed';
import petitionerLogin from './journey/petitionerLogIn';
import petitionerViewsDashboard from './journey/petitionerViewsDashboard';
import petitionsClerkLogIn from './journey/petitionsClerkLogIn';
import petitionsClerkManuallyAddsCaseToTrial from './journey/petitionsClerkManuallyAddsCaseToTrial';
import petitionsClerkManuallyRemovesCaseFromTrial from './journey/petitionsClerkManuallyRemovesCaseFromTrial';
import petitionsClerkRunsBatchProcess from './journey/petitionsClerkRunsBatchProcess';
import petitionsClerkSendsCaseToIRSHoldingQueue from './journey/petitionsClerkSendsCaseToIRSHoldingQueue';
import petitionsClerkViewsATrialSessionsEligibleCases from './journey/petitionsClerkViewsATrialSessionsEligibleCases';
import userSignsOut from './journey/petitionerSignsOut';

const test = setupTest();

describe('Docket Clerk Views Trial Session Tabs', () => {
  beforeEach(() => {
    jest.setTimeout(30000);
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
    petitionerLogin(test);
    it(`Create case ${id}`, async () => {
      await uploadPetition(test, caseOverrides);
    });
    petitionerViewsDashboard(test);
    captureCreatedCase(test, createdCases, createdDocketNumbers);

    userSignsOut(test);
    petitionsClerkLogIn(test);
    petitionsClerkSendsCaseToIRSHoldingQueue(test);
    petitionsClerkRunsBatchProcess(test);
    userSignsOut(test);
    docketClerkLogIn(test);
    docketClerkSetsCaseReadyForTrial(test);
    userSignsOut(test);
  };

  docketClerkLogIn(test);
  docketClerkCreatesATrialSession(test, overrides);
  docketClerkViewsTrialSessionList(test, overrides);
  // Trial Session should exist in New tab
  docketClerkViewsTrialSessionsTab(test, { tab: 'New' });
  userSignsOut(test);

  for (let i = 0; i < caseCount; i++) {
    const id = i + 1;
    makeCaseReadyForTrial(test, id, overrides);
  }

  petitionsClerkLogIn(test);
  petitionsClerkViewsATrialSessionsEligibleCases(test, caseCount);

  petitionsClerkManuallyAddsCaseToTrial(test);
  userSignsOut(test);

  calendarClerkLogIn(test);
  // only mark cases 0 and 1 as QCed
  markAllCasesAsQCed(test, () => {
    return [createdCases[1]];
  });
  userSignsOut(test);

  calendarClerkLogIn(test);
  calendarClerkSetsATrialSessionsSchedule(test);
  userSignsOut(test);

  docketClerkLogIn(test);
  // Trial Session should exist in Open tab
  docketClerkViewsTrialSessionsTab(test, { tab: 'Open' });
  userSignsOut(test);

  petitionsClerkLogIn(test);
  petitionsClerkManuallyRemovesCaseFromTrial(test);
  userSignsOut(test);

  docketClerkLogIn(test);
  // Trial Session should exist in Closed tab
  docketClerkViewsTrialSessionsTab(test, { tab: 'Closed' });
  // Trial Session should exist in All tab
  docketClerkViewsTrialSessionsTab(test, { tab: 'All' });
  userSignsOut(test);
});
