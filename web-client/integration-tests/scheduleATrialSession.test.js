import { setupTest } from './helpers';
import { uploadPetition } from './helpers';
import docketClerkCreatesATrialSession from './journey/docketClerkCreatesATrialSession';
import docketClerkLogIn from './journey/docketClerkLogIn';
import docketClerkViewsAnUpcomingTrialSession from './journey/docketClerkViewsAnUpcomingTrialSession';
import docketClerkViewsTrialSessionList from './journey/docketClerkViewsTrialSessionList';
import petitionerLogin from './journey/petitionerLogIn';
import petitionerViewsDashboard from './journey/petitionerViewsDashboard';
import petitionsClerkLogIn from './journey/petitionsClerkLogIn';
import petitionsClerkRunsBatchProcess from './journey/petitionsClerkRunsBatchProcess';
import petitionsClerkSendsCaseToIRSHoldingQueue from './journey/petitionsClerkSendsCaseToIRSHoldingQueue';
import petitionsClerkSetsATrialSessionsSchedule from './journey/petitionsClerkSetsATrialSessionsSchedule';
import petitionsClerkSetsCaseReadyForTrial from './journey/petitionsClerkSetsCaseReadyForTrial';
import petitionsClerkViewsACalendaredTrialSession from './journey/petitionsClerkViewsACalendaredTrialSession';
import petitionsClerkViewsATrialSessionsEligibleCases from './journey/petitionsClerkViewsATrialSessionsEligibleCases';
import userSignsOut from './journey/petitionerSignsOut';

const test = setupTest();

describe('Schedule A Trial Session', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  const trialLocation = `Albuquerque, New Mexico, ${Date.now()}`;
  const overrides = {
    preferredTrialCity: trialLocation,
    trialLocation,
  };

  docketClerkLogIn(test);
  docketClerkCreatesATrialSession(test, overrides);
  docketClerkViewsTrialSessionList(test, overrides);
  docketClerkViewsAnUpcomingTrialSession(test);
  userSignsOut(test);

  for (let i = 0; i < 2; i++) {
    petitionerLogin(test);
    it(`Create case ${i + 1}`, async () => {
      await uploadPetition(test, overrides);
    });
    petitionerViewsDashboard(test);
    userSignsOut(test);
    petitionsClerkLogIn(test);
    petitionsClerkSendsCaseToIRSHoldingQueue(test);
    petitionsClerkRunsBatchProcess(test);
    petitionsClerkSetsCaseReadyForTrial(test);
    userSignsOut(test);
  }

  petitionsClerkLogIn(test);
  petitionsClerkViewsATrialSessionsEligibleCases(test);
  petitionsClerkSetsATrialSessionsSchedule(test);
  petitionsClerkViewsACalendaredTrialSession(test);
  userSignsOut(test);
});
