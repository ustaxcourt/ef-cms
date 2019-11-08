import { loginAs, setupTest, uploadPetition } from './helpers';
import docketClerkCreatesATrialSession from './journey/docketClerkCreatesATrialSession';
import docketClerkLogIn from './journey/docketClerkLogIn';
import docketClerkSetsCalendarForTrialSession from './journey/docketClerkSetsCalendarForTrialSession';
import docketClerkSignsOut from './journey/docketClerkSignsOut';
import docketClerkUpdatesCaseStatusFromCalendaredToSubmitted from './journey/docketClerkUpdatesCaseStatusFromCalendaredToSubmitted';
import docketClerkUpdatesCaseStatusToReadyForTrial from './journey/docketClerkUpdatesCaseStatusToReadyForTrial';
import docketClerkViewsEligibleCasesForTrialSession from './journey/docketClerkViewsEligibleCasesForTrialSession';
import docketClerkViewsInactiveCasesForTrialSession from './journey/docketClerkViewsInactiveCasesForTrialSession';
import docketClerkViewsTrialSessionList from './journey/docketClerkViewsTrialSessionList';

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

  it('login as a petitioner and create a case', async () => {
    await loginAs(test, 'petitioner');
    const caseDetail = await uploadPetition(test, overrides);
    test.caseId = caseDetail.caseId;
    test.docketNumber = caseDetail.docketNumber;
  });

  docketClerkLogIn(test);
  docketClerkUpdatesCaseStatusToReadyForTrial(test);
  docketClerkCreatesATrialSession(test, overrides);
  docketClerkViewsTrialSessionList(test, overrides);
  docketClerkViewsEligibleCasesForTrialSession(test);
  docketClerkSetsCalendarForTrialSession(test);
  docketClerkUpdatesCaseStatusFromCalendaredToSubmitted(test);
  docketClerkViewsInactiveCasesForTrialSession(test);
  docketClerkUpdatesCaseStatusToReadyForTrial(test);
  docketClerkSignsOut(test);
});
