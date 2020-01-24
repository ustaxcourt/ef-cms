import { setupTest } from './helpers';
import { uploadPetition } from './helpers';
import calendarClerkLogIn from './journey/calendarClerkLogIn';
import captureCreatedCase from './journey/captureCreatedCase';
import docketClerkCreatesATrialSession from './journey/docketClerkCreatesATrialSession';
import docketClerkLogIn from './journey/docketClerkLogIn';
import docketClerkSetsCaseReadyForTrial from './journey/docketClerkSetsCaseReadyForTrial';
import docketClerkViewsAnUpcomingTrialSession from './journey/docketClerkViewsAnUpcomingTrialSession';
import docketClerkViewsTrialSessionList from './journey/docketClerkViewsTrialSessionList';
import markAllCasesAsQCed from './journey/markAllCasesAsQCed';
import petitionerLogin from './journey/petitionerLogIn';
import petitionerViewsDashboard from './journey/petitionerViewsDashboard';
import petitionsClerkLogIn from './journey/petitionsClerkLogIn';
import petitionsClerkManuallyAddsCaseToTrial from './journey/petitionsClerkManuallyAddsCaseToTrial';
import petitionsClerkManuallyRemovesCaseFromTrial from './journey/petitionsClerkManuallyRemovesCaseFromTrial';
import petitionsClerkRunsBatchProcess from './journey/petitionsClerkRunsBatchProcess';
import petitionsClerkSendsCaseToIRSHoldingQueue from './journey/petitionsClerkSendsCaseToIRSHoldingQueue';
import petitionsClerkSetsATrialSessionsSchedule from './journey/petitionsClerkSetsATrialSessionsSchedule';
import petitionsClerkViewsACalendaredTrialSession from './journey/petitionsClerkViewsACalendaredTrialSession';
import petitionsClerkViewsATrialSessionsEligibleCases from './journey/petitionsClerkViewsATrialSessionsEligibleCases';
import petitionsClerkViewsATrialSessionsEligibleCasesWithManuallyAddedCase from './journey/petitionsClerkViewsATrialSessionsEligibleCasesWithManuallyAddedCase';
import userSignsOut from './journey/petitionerSignsOut';

const test = setupTest();

describe('Schedule A Trial Session', () => {
  beforeAll(() => {
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
  docketClerkViewsAnUpcomingTrialSession(test);
  userSignsOut(test);

  for (let i = 0; i < caseCount; i++) {
    const id = i + 1;
    makeCaseReadyForTrial(test, id, overrides);
  }

  // Add case with a different city
  makeCaseReadyForTrial(test, caseCount + 1, {});

  petitionsClerkLogIn(test);
  petitionsClerkViewsATrialSessionsEligibleCases(test, caseCount);

  petitionsClerkManuallyAddsCaseToTrial(test);
  petitionsClerkViewsATrialSessionsEligibleCasesWithManuallyAddedCase(
    test,
    caseCount + 1,
  );
  petitionsClerkManuallyRemovesCaseFromTrial(test);
  petitionsClerkViewsATrialSessionsEligibleCases(test, caseCount);

  calendarClerkLogIn(test);
  markAllCasesAsQCed(test, () => {
    return [createdCases[0], createdCases[1]];
  });
  userSignsOut(test);

  petitionsClerkLogIn(test);
  petitionsClerkSetsATrialSessionsSchedule(test);
  petitionsClerkViewsACalendaredTrialSession(test, caseCount);
  userSignsOut(test);
});
